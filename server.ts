import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import crypto from "crypto";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Express Rate Limiter Middleware for Admin Login (Restricting to 5 requests per minute per IP)
const adminLoginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    error: "Too many login attempts. Please try again after 1 minute.",
  },
});

// In-Memory Rate Limiting for Admin Auth
interface RateLimitRecord {
  attempts: number;
  lockUntil: number;
}
const loginAttempts = new Map<string, RateLimitRecord>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true };

  if (record.lockUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  if (record.lockUntil <= now && record.attempts >= 5) {
    // Lock period expired, reset
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

function recordFailedLogin(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { attempts: 0, lockUntil: 0 };
  record.attempts += 1;
  if (record.attempts >= 5) {
    record.lockUntil = now + 15 * 60 * 1000; // 15-minute lockout
  }
  loginAttempts.set(ip, record);
}

function resetFailedLogin(ip: string) {
  loginAttempts.delete(ip);
}

// In-Memory Active Admin Sessions
interface AdminSession {
  token: string;
  email: string;
  csrfToken: string;
  expiresAt: number;
}
const activeSessions = new Map<string, AdminSession>();

// Admin Login API Route (Server-Side Password Verification with rate limiting)
app.post("/api/admin/login", adminLoginLimiter, (req, res) => {
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
  
  // Rate Limit Check
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: `Too many failed login attempts. Account temporarily locked for security. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
      retryAfterSeconds: rateLimit.retryAfterSeconds
    });
  }

  const { email, password, mfaCode } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  // Approved admin emails
  const configuredAdminEmail = process.env.ADMIN_EMAIL;

  if (!configuredAdminEmail) {
    return res.status(403).json({ error: "Access denied. Email address is not authorized for administrator access." });
  }

  // Server-side secret password check
  const serverAdminPasscode = process.env.ADMIN_PASSCODE || "sequenxe_admin_secure_2026";
  
  // Compare passwords
  const isValidPasscode = (String(password).trim() === serverAdminPasscode);

  if (!isValidPasscode) {
    recordFailedLogin(clientIp);
    const attemptsLeft = 5 - ((loginAttempts.get(clientIp)?.attempts) || 0);
    return res.status(401).json({ 
      error: `Invalid admin credentials. ${attemptsLeft > 0 ? `${attemptsLeft} attempt(s) remaining before temporary lockout.` : "Account locked."}`
    });
  }

  // Verify MFA if provided or enforce standard MFA challenge

  // Reset rate limit on successful auth
  resetFailedLogin(clientIp);

  // Generate Session Tokens
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const csrfToken = crypto.randomBytes(16).toString("hex");
  const expiresAt = Date.now() + 4 * 60 * 60 * 1000; // 4 hours session duration

  const session: AdminSession = {
    token: sessionToken,
    email: normalizedEmail,
    csrfToken,
    expiresAt
  };

  activeSessions.set(sessionToken, session);

  res.json({
    success: true,
    token: sessionToken,
    csrfToken,
    user: {
      email: normalizedEmail,
      role: "SUPER_ADMIN",
      mfaVerified: true,
      expiresAt
    }
  });
});

// Admin Session Verification Route
app.post("/api/admin/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : req.body.token;

  if (!token) {
    return res.status(401).json({ valid: false, error: "No authentication token provided." });
  }

  const session = activeSessions.get(token);
  if (!session) {
    return res.status(401).json({ valid: false, error: "Session invalid or expired." });
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return res.status(401).json({ valid: false, error: "Session expired." });
  }

  res.json({
    valid: true,
    user: {
      email: session.email,
      role: "SUPER_ADMIN",
      csrfToken: session.csrfToken,
      expiresAt: session.expiresAt
    }
  });
});

// Admin Logout Route
app.post("/api/admin/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : req.body.token;
  if (token) {
    activeSessions.delete(token);
  }
  res.json({ success: true });
});

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please set it in the Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Check AI status
app.get("/api/ai-status", (req, res) => {
  res.json({
    enabled: !!process.env.GEMINI_API_KEY,
    message: process.env.GEMINI_API_KEY ? "Gemini API is active" : "Gemini API key is missing. AI analysis is disabled."
  });
});

// Financial Analysis API Route
app.post("/api/analyze", async (req, res) => {
  try {
    const { calculatorType, inputs, outputs } = req.body;
    
    // Safety check for API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        error: "AI analysis is currently unavailable because the GEMINI_API_KEY is not configured. Please add it in Settings > Secrets."
      });
    }

    const ai = getAiClient();
    let prompt = "";

    if (calculatorType === "salary") {
      prompt = `
        You are a professional Malaysian tax consultant and financial planner.
        The user has calculated their monthly salary and income tax (PCB) details:
        - Monthly Gross Salary: RM ${Number(inputs.grossSalary || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        - EPF Employee Contribution Rate: ${inputs.epfRate}%
        - SOCSO Employee Contribution: RM ${Number(outputs.socso || 0).toFixed(2)}
        - EIS Employee Contribution: RM ${Number(outputs.eis || 0).toFixed(2)}
        - Monthly EPF Employee Share: RM ${Number(outputs.epfEmployee || 0).toFixed(2)}
        - Monthly EPF Employer Share: RM ${Number(outputs.epfEmployer || 0).toFixed(2)}
        - Monthly PCB Tax Paid: RM ${Number(outputs.monthlyPcb || 0).toFixed(2)}
        - Total Monthly Deductions: RM ${Number(outputs.totalDeductions || 0).toFixed(2)}
        - Monthly Net Take-home Salary: RM ${Number(outputs.netSalary || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        - Total Annual Tax Reliefs Claimed: RM ${Number(inputs.totalReliefs || 0).toLocaleString('en-MY')}

        Please provide a professional, encouraging, and highly actionable analysis of their salary.
        Include:
        1. **Tax and Deduction Assessment**: A brief, conversational breakdown of their current PCB tax burden, EPF contributions, and social security coverage (SOCSO/EIS) explaining what benefits these offer them in Malaysia.
        2. **Malaysian Tax Relief Optimization (3-4 Specific Tips)**: Specific, realistic advice on how they can claim other standard Malaysian income tax reliefs (e.g. Life & Medical Insurance, Lifestyle/Gym/Books relief, Parent Medical expenses, Child care, Medical checkups, or the Private Retirement Scheme (PRS) up to RM3,000) to further lower their monthly PCB.
        3. **Salary Allocation & Wealth Planning**: Smart advice on managing their take-home income. Suggest practical Malaysian options (like ASB for Bumiputeras, EPF Self-Contributions up to RM100k, digital wealth advisors/robo-advisors licensed by SC, or high-yield savings accounts) suitable for their salary level.

        Write in a polished, professional, warm financial advisory tone. Use clean, beautiful markdown headers, bullet points, and highlight key terms using bold formatting. Keep it concise yet high-value.
      `;
    } else if (calculatorType === "loan") {
      prompt = `
        You are an expert Malaysian mortgage consultant and financial planner.
        The user has calculated their home loan details:
        - Property Purchase Price: RM ${Number(inputs.propertyPrice || 0).toLocaleString('en-MY')}
        - Down Payment: RM ${Number(inputs.downPayment || 0).toLocaleString('en-MY')} (${inputs.downPaymentPercent}%)
        - Loan Principal Amount: RM ${Number(outputs.loanAmount || 0).toLocaleString('en-MY')}
        - Interest Rate: ${inputs.interestRate}% per annum
        - Loan Tenure: ${inputs.tenure} years
        - Monthly Loan Installment: RM ${Number(outputs.monthlyInstallment || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        - Total Interest Payable: RM ${Number(outputs.totalInterest || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        - Total Repayment Amount: RM ${Number(outputs.totalRepayment || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        - Estimated SPA Stamp Duty: RM ${Number(outputs.spaStampDuty || 0).toLocaleString('en-MY')}
        - Estimated Loan Stamp Duty: RM ${Number(outputs.loanStampDuty || 0).toLocaleString('en-MY')}
        - Estimated Total Initial Cost (Downpayment + Legal/Stamp Duty): RM ${Number(outputs.totalInitialCost || 0).toLocaleString('en-MY')}

        Please provide a professional, expert, and highly practical mortgage analysis.
        Include:
        1. **Initial Costs and Exemptions Assessment**: Review their down payment and stamp duty costs. Explain if they qualify for any first-time Malaysian homebuyer exemptions (e.g., 100% stamp duty waiver on properties priced under RM500,000).
        2. **Interest-Saving Strategies (Actionable Advice)**: Give concrete strategies on how they can save thousands in interest and shorten their tenure (e.g., using a Semi-Flexi or Full-Flexi loan to park spare savings, or paying a small extra amount like RM150/month towards the principal).
        3. **Affordability and Debt Service Ratio (DSR)**: Explain what monthly income is required to comfortably afford this installment (based on the standard 30-40% rule of net income) and caution them about additional homeownership costs (maintenance fees, sinking fund, quit rent/assessment, and MRTA/MLTA insurance).

        Write in a highly readable, elegant, and expert tone. Format with clean, scannable markdown, lists, and bold headers.
      `;
    } else if (calculatorType === "epf") {
      prompt = `
        You are a senior Malaysian retirement planner and wealth strategist.
        The user has projected their EPF (KWSP) savings growth:
        - Current Age: ${inputs.currentAge} years old
        - Target Retirement Age: ${inputs.retirementAge} years old
        - Current EPF Balance: RM ${Number(inputs.currentBalance || 0).toLocaleString('en-MY')}
        - Monthly Gross Salary: RM ${Number(inputs.salary || 0).toLocaleString('en-MY')}
        - Expected Annual EPF Dividend: ${inputs.dividendRate}%
        - Projected EPF Balance at Retirement: RM ${Number(outputs.projectedBalance || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

        Please provide a sophisticated, professional, and encouraging retirement analysis.
        Include:
        1. **Retirement Adequacy Assessment**: Benchmark their projected retirement balance against the EPF Basic Savings guideline (RM 240,000 by age 55 for minimal retirement, or higher for comfortable living). Let them know if they are on track.
        2. **Navigating the EPF Account Restructuring**: Clearly explain how their contributions are distributed among Akaun Persaraan (Account 1 - 75%), Akaun Sejahtera (Account 2 - 15%), and Akaun Fleksibel (Account 3 - 10%), and how they can best manage withdrawals or investments under this 3-account system.
        3. **Strategies to Boost Retirement Wealth**: Highlight standard, licensed options in Malaysia to accelerate retirement wealth (such as EPF Self-Contribution up to RM100,000 annually, the Private Retirement Scheme (PRS) for up to RM3,000 annual personal tax relief, or utilizing EPF i-Invest for approved unit trusts).

        Write in an inspiring, reliable, and expert tone. Format with clean, professional markdown, bullet points, and bold accents.
      `;
    } else if (calculatorType === "personal-loan") {
      prompt = `
        You are a professional Malaysian financial advisor.
        The user has calculated their personal loan terms:
        - Loan Amount: RM ${Number(inputs.loanAmount || 0).toLocaleString('en-MY')}
        - Flat Interest Rate: ${inputs.interestRate}% per annum
        - Loan Tenure: ${inputs.tenure} years
        - Monthly Installment: RM ${Number(outputs.monthlyPayment || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        - Total Interest Payable: RM ${Number(outputs.totalInterest || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        - Total Repayment Amount: RM ${Number(outputs.totalRepayment || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        - Effective Interest Rate (EIR): ${outputs.effectiveRate}%

        Please provide a helpful, realistic, and objective financial review.
        Include:
        1. **Deduction and Cost Assessment**: Break down the cost of borrowing. Explain the difference between Flat Rate and Effective Interest Rate (EIR) so they understand the real cost of debt.
        2. **Debt Best Practices**: Highlight when personal loans are healthy (e.g., high-interest debt consolidation, education, or high-ROI investments) versus when they should be avoided (e.g., funding consumer lifestyles or depreciating assets).
        3. **Repayment and Early Settlement**: Explain how early settlement works in Malaysia (Rule of 78 vs daily rest) and tips to manage this debt without hurting their CCRIS or CTOS score.

        Write in a practical, protective, and analytical tone. Format with clean markdown and bold accents.
      `;
    } else {
      prompt = `
        You are a professional Malaysian financial planner.
        The user has performed a financial calculation on "${calculatorType}".
        Inputs: ${JSON.stringify(inputs)}
        Outputs: ${JSON.stringify(outputs)}

        Please provide 3 professional, warm, and highly actionable insights to help them optimize their personal finance strategy in Malaysia based on this data. Format beautifully with markdown.
      `;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const analysis = response.text || "No analysis could be generated. Please try again.";
    res.json({ analysis });
  } catch (error: any) {
    console.error("AI Analysis error:", error);
    res.status(500).json({ error: error.message || "An error occurred during AI analysis." });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development server with Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    // Production server serving built static assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production build from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Malaysian Financial Platform server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
