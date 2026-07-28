import React from 'react';
import { TrendingDown, TrendingUp, Minus, Activity, Landmark, ShieldCheck } from 'lucide-react';

export interface MarketRateTrendProps {
  type: 'home-loan' | 'personal-loan';
  className?: string;
}

export interface RateTrendItem {
  title: string;
  oprRate: string;
  avgMarketRate: string;
  trendDirection: 'down' | 'up' | 'stable';
  trendDelta: string;
  trendLabel: string;
  period: string;
  summaryText: string;
  sparklineData: number[];
  months: string[];
}

export const MOCK_MARKET_RATES: Record<'home-loan' | 'personal-loan', RateTrendItem> = {
  'home-loan': {
    title: 'Current Home Loan Rate Trend',
    oprRate: '3.00%',
    avgMarketRate: '3.85% - 4.15% p.a.',
    trendDirection: 'down',
    trendDelta: '-0.15% Easing',
    trendLabel: 'Trending Down',
    period: 'BNM Benchmark Rate',
    summaryText: 'BNM Overnight Policy Rate (OPR) holds at 3.00%. Commercial mortgage packages offer competitive loan rates averaging ~3.85% p.a.',
    sparklineData: [4.05, 3.98, 3.92, 3.88, 3.85],
    months: ['May', 'Jun', 'Jul', 'Aug', 'Sep']
  },
  'personal-loan': {
    title: 'Current Personal Loan Rate Trend',
    oprRate: '3.00%',
    avgMarketRate: '4.50% - 6.80% p.a.',
    trendDirection: 'stable',
    trendDelta: '0.00% Stable',
    trendLabel: 'Stable Rates',
    period: 'BNM Benchmark Rate',
    summaryText: 'Personal loan flat interest rates remain stable across major Malaysian bank lenders with selective digital application rebates.',
    sparklineData: [5.20, 5.15, 5.10, 5.10, 5.10],
    months: ['May', 'Jun', 'Jul', 'Aug', 'Sep']
  }
};

export function MarketInterestRateTrend({ type, className = '' }: MarketRateTrendProps) {
  const data = MOCK_MARKET_RATES[type];

  // Calculate sparkline SVG coordinates (viewBox 0 0 120 32)
  const points = data.sparklineData;
  const min = Math.min(...points) - 0.1;
  const max = Math.max(...points) + 0.1;
  const width = 120;
  const height = 32;

  const svgPoints = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - ((val - min) / (max - min)) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const isDown = data.trendDirection === 'down';
  const isUp = data.trendDirection === 'up';

  return (
    <div className={`bg-card-custom border border-border-custom rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-border-custom pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Landmark className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-text-primary">
              {data.title}
            </h3>
            <p className="text-[10px] text-text-secondary">
              Market Benchmark & Rate Indicator
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
          isDown 
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
            : isUp 
            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
        }`}>
          {isDown && <TrendingDown className="h-3.5 w-3.5" />}
          {isUp && <TrendingUp className="h-3.5 w-3.5" />}
          {!isDown && !isUp && <Minus className="h-3.5 w-3.5" />}
          {data.trendDelta}
        </span>
      </div>

      {/* Metrics & Mini Sparkline Graph */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-7 grid grid-cols-2 gap-2">
          <div className="bg-bg-custom/50 rounded-xl p-2.5 border border-border-custom">
            <span className="text-[10px] font-medium text-text-secondary block">BNM OPR Rate</span>
            <span className="text-sm font-bold text-text-primary">{data.oprRate}</span>
          </div>
          <div className="bg-bg-custom/50 rounded-xl p-2.5 border border-border-custom">
            <span className="text-[10px] font-medium text-text-secondary block">Avg Lending Rate</span>
            <span className="text-sm font-bold text-primary">{data.avgMarketRate}</span>
          </div>
        </div>

        {/* Graphical Sparkline Indicator */}
        <div className="sm:col-span-5 bg-bg-custom/50 rounded-xl p-2.5 border border-border-custom flex flex-col justify-between h-full">
          <div className="flex justify-between items-center text-[10px] text-text-secondary mb-1">
            <span className="flex items-center gap-1 font-semibold text-text-primary">
              <Activity className="h-3 w-3 text-primary" /> 5-Mo Trend
            </span>
            <span className="font-mono text-[9px]">{data.months[0]} - {data.months[data.months.length - 1]}</span>
          </div>
          
          <div className="h-8 w-full flex items-center justify-center">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-7 overflow-visible">
              <defs>
                <linearGradient id={`trend-grad-${type}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDown ? '#10B981' : '#FE2E4B'} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={isDown ? '#10B981' : '#FE2E4B'} stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon
                points={`0,${height} ${svgPoints} ${width},${height}`}
                fill={`url(#trend-grad-${type})`}
              />
              <polyline
                fill="none"
                stroke={isDown ? '#10B981' : isUp ? '#FE2E4B' : '#F59E0B'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={svgPoints}
              />
              <circle
                cx={width}
                cy={height - ((points[points.length - 1] - min) / (max - min)) * height}
                r="3"
                fill={isDown ? '#10B981' : isUp ? '#FE2E4B' : '#F59E0B'}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Summary Note */}
      <p className="text-[11px] leading-relaxed text-text-secondary bg-bg-custom/30 rounded-xl p-2.5 border border-border-custom flex items-start gap-2">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
        <span>{data.summaryText}</span>
      </p>
    </div>
  );
}
