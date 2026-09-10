import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';
import { Dog, DogPricePoint } from '../types';

interface DogIndividualPriceChartProps {
  dog: Dog;
  variant?: 'card' | 'detailed';
  className?: string;
  breedAveragePrice?: number;
}

/**
 * Returns or generates a deterministic, realistic 4-step milestone price trajectory for any dog.
 */
export function getDogPriceHistory(dog: Dog): DogPricePoint[] {
  if (dog.priceHistory && dog.priceHistory.length > 0) {
    return dog.priceHistory;
  }

  const currentPrice = dog.price;
  const isRescue = dog.isRescue || dog.category === 'rescue';

  if (isRescue) {
    // Rescue dogs start with intake medical costs, then shelter subsidies bring the adoption fee down
    const p1 = Math.round(currentPrice * 1.35);
    const p2 = Math.round(currentPrice * 1.2);
    const p3 = Math.round(currentPrice * 1.08);
    return [
      {
        date: 'Intake',
        price: p1,
        milestone: 'Intake & Health Triage',
        note: 'Intake examination, rabies & core vaccines'
      },
      {
        date: 'Wk 2',
        price: p2,
        milestone: 'Spay/Neuter Protocol',
        note: 'Surgical sterilisation & microchipping'
      },
      {
        date: 'Wk 4',
        price: p3,
        milestone: 'Shelter Subsidy Applied',
        note: 'Community rescue donor fund reduction'
      },
      {
        date: 'Current',
        price: currentPrice,
        milestone: 'Current Adoption Fee',
        note: 'Final accredited rescue adoption fee'
      }
    ];
  }

  if (dog.category === 'puppy') {
    // Puppies start with preliminary litter reservation, then value increases as veterinary milestones & certifications are reached
    const p1 = Math.round(currentPrice * 0.8);
    const p2 = Math.round(currentPrice * 0.88);
    const p3 = Math.round(currentPrice * 0.95);
    return [
      {
        date: 'Wk 4',
        price: p1,
        milestone: 'Litter Reservation',
        note: 'Initial reservation & pedigree registry'
      },
      {
        date: 'Wk 6',
        price: p2,
        milestone: 'First Health Protocol',
        note: 'DHLPP vaccine series & microchip implant'
      },
      {
        date: 'Wk 8',
        price: p3,
        milestone: 'OFA & DNA Clearances',
        note: 'Veterinary genetic clearance & ENS certified'
      },
      {
        date: 'Current',
        price: currentPrice,
        milestone: 'Placement Ready Fee',
        note: 'Includes 10-yr guarantee, starter kit & health dossier'
      }
    ];
  }

  // Adult or Young dog
  const p1 = Math.round(currentPrice * 0.86);
  const p2 = Math.round(currentPrice * 0.93);
  return [
    {
      date: 'Month 1',
      price: p1,
      milestone: 'Health Assessment',
      note: 'Comprehensive veterinary and cardiac check'
    },
    {
      date: 'Month 2',
      price: p2,
      milestone: 'Behavioral Evaluation',
      note: 'CGC obedience readiness verification'
    },
    {
      date: 'Current',
      price: currentPrice,
      milestone: 'Verified Placement Fee',
      note: 'Complete health dossier & escrow guarantee'
    }
  ];
}

export const DogIndividualPriceChart: React.FC<DogIndividualPriceChartProps> = ({
  dog,
  variant = 'card',
  className = '',
  breedAveragePrice
}) => {
  const history = getDogPriceHistory(dog);
  const startPrice = history[0].price;
  const currentPrice = history[history.length - 1].price;
  const priceDelta = currentPrice - startPrice;
  const isSubsidized = priceDelta < 0;

  // Custom tooltip for Card variant
  const CardTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as DogPricePoint;
      return (
        <div className="bg-[#111c2d] text-white px-2.5 py-1.5 rounded-xl shadow-xl border border-[#2b3e5f] text-[11px] z-50 pointer-events-none">
          <div className="font-bold text-[#ffdcc3] flex items-center justify-between gap-2">
            <span>{data.milestone}</span>
            <span className="text-white font-black">${data.price.toLocaleString()}</span>
          </div>
          {data.note && <div className="text-[10px] text-[#cbd7ef] mt-0.5">{data.note}</div>}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for Detailed variant
  const DetailedTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as DogPricePoint;
      return (
        <div className="bg-[#111c2d] text-white p-3 rounded-2xl shadow-2xl border border-[#2b3e5f] text-xs max-w-xs z-50">
          <div className="flex items-center justify-between gap-3 mb-1.5 pb-1.5 border-b border-[#2b3e5f]">
            <span className="font-bold text-white text-sm">{data.milestone}</span>
            <span className="font-black text-[#ffdcc3] text-base">${data.price.toLocaleString()}</span>
          </div>
          <div className="space-y-1 text-[11px] text-[#cbd7ef]">
            <div className="flex items-center justify-between">
              <span className="text-[#8898b3]">Timeline Stage:</span>
              <span className="font-semibold text-white">{data.date}</span>
            </div>
            {data.note && (
              <p className="text-[11px] text-[#9fb0cf] mt-1 italic">&ldquo;{data.note}&rdquo;</p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // CARD VARIANT (for dog cards in grids & lists)
  if (variant === 'card') {
    return (
      <div
        className={`bg-[#f8faff] rounded-2xl p-2.5 border border-[#e2ecfd] mt-2.5 transition-all ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between text-[10px] font-bold mb-1">
          <span className="text-[#485b7e] flex items-center gap-1">
            <span className="material-symbols-outlined text-xs text-[#8d4b00]">show_chart</span>
            <span>Price Trend ({dog.name})</span>
          </span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-0.5 ${
              isSubsidized
                ? 'bg-emerald-100 text-[#006c4a]'
                : priceDelta > 0
                ? 'bg-[#ffdcc3] text-[#8d4b00]'
                : 'bg-[#e2ecfd] text-[#485b7e]'
            }`}
          >
            {isSubsidized ? (
              <>
                <span className="material-symbols-outlined text-[11px]">arrow_downward</span>
                <span>-${Math.abs(priceDelta).toLocaleString()} Subsidy</span>
              </>
            ) : priceDelta > 0 ? (
              <>
                <span className="material-symbols-outlined text-[11px]">health_and_safety</span>
                <span>+${priceDelta.toLocaleString()} Certifications</span>
              </>
            ) : (
              <span>Locked Fee</span>
            )}
          </span>
        </div>

        {/* Mini Chart Area */}
        <div className="h-16 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 4, right: 8, left: 8, bottom: 2 }}>
              <Tooltip content={<CardTooltip />} />
              <XAxis dataKey="date" hide={false} tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#6e7f9e' }} />
              <YAxis hide domain={['dataMin - 50', 'dataMax + 50']} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isSubsidized ? '#006c4a' : '#d97706'}
                strokeWidth={2.5}
                dot={{
                  r: 3.5,
                  fill: isSubsidized ? '#006c4a' : '#d97706',
                  stroke: '#ffffff',
                  strokeWidth: 1.5
                }}
                activeDot={{
                  r: 5.5,
                  fill: '#111c2d',
                  stroke: isSubsidized ? '#82f5c1' : '#ffdcc3',
                  strokeWidth: 2
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-[9px] text-[#6e7f9e] pt-0.5">
          <span>Start: ${startPrice.toLocaleString()}</span>
          <span className="font-bold text-[#111c2d]">Current: ${currentPrice.toLocaleString()}</span>
        </div>
      </div>
    );
  }

  // DETAILED VARIANT (for DogDetailScreen)
  const breedAvg = breedAveragePrice || (dog.isRescue ? 375 : 2400);

  return (
    <div className={`bg-white rounded-3xl p-6 sm:p-7 border border-[#dee8ff] shadow-xs space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dee8ff] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ffdcc3] text-[#8d4b00] flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-xl">insights</span>
          </div>
          <div>
            <h3 className="font-['Epilogue'] font-bold text-lg text-[#111c2d]">
              {dog.name}&rsquo;s Price Trajectory & Milestone Curve
            </h3>
            <p className="text-xs text-[#554336]">
              Verified progression of health investments, genetic clearances, and transparent fee schedule.
            </p>
          </div>
        </div>

        {/* Badge comparison */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f0f3ff] text-[#111c2d] border border-[#dee8ff]">
            Current: ${currentPrice.toLocaleString()}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
              isSubsidized
                ? 'bg-emerald-100 text-[#006c4a]'
                : 'bg-[#ffdcc3] text-[#8d4b00]'
            }`}
          >
            <span className="material-symbols-outlined text-xs">
              {isSubsidized ? 'arrow_downward' : 'trending_up'}
            </span>
            <span>
              {isSubsidized
                ? `-$${Math.abs(priceDelta).toLocaleString()} Subsidy`
                : `+$${priceDelta.toLocaleString()} Value Added`}
            </span>
          </span>
        </div>
      </div>

      {/* Main Chart Graphic */}
      <div className="h-64 sm:h-72 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={history} margin={{ top: 15, right: 20, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id={`dogPriceGrad-${dog.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isSubsidized ? '#006c4a' : '#d97706'}
                  stopOpacity={0.25}
                />
                <stop
                  offset="95%"
                  stopColor={isSubsidized ? '#006c4a' : '#d97706'}
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="#8898b3"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#dee8ff' }}
            />
            <YAxis
              stroke="#8898b3"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#dee8ff' }}
              tickFormatter={(val) => `$${val}`}
              domain={['dataMin - 100', 'dataMax + 100']}
            />
            <Tooltip content={<DetailedTooltip />} />
            {breedAvg && (
              <ReferenceLine
                y={breedAvg}
                stroke="#6e7f9e"
                strokeDasharray="4 4"
                label={{
                  value: `Breed Average: $${breedAvg}`,
                  position: 'top',
                  fill: '#6e7f9e',
                  fontSize: 11,
                  fontWeight: 'bold'
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="price"
              fill={`url(#dogPriceGrad-${dog.id})`}
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="price"
              name={`${dog.name}'s Fee`}
              stroke={isSubsidized ? '#006c4a' : '#d97706'}
              strokeWidth={3.5}
              dot={{
                r: 6,
                fill: isSubsidized ? '#006c4a' : '#d97706',
                stroke: '#ffffff',
                strokeWidth: 2,
                cursor: 'pointer'
              }}
              activeDot={{
                r: 8,
                fill: '#111c2d',
                stroke: isSubsidized ? '#82f5c1' : '#ffdcc3',
                strokeWidth: 3,
                cursor: 'pointer'
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Milestone Step Timeline Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
        {history.map((step, idx) => (
          <div
            key={idx}
            className="p-3 rounded-2xl bg-[#f8faff] border border-[#e2ecfd] relative flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-[#8d4b00] bg-[#ffdcc3]/50 px-2 py-0.5 rounded-md">
                  {step.date}
                </span>
                <span className="font-black text-sm text-[#111c2d]">${step.price.toLocaleString()}</span>
              </div>
              <h5 className="font-bold text-xs text-[#111c2d] mt-1">{step.milestone}</h5>
              {step.note && <p className="text-[11px] text-[#554336] mt-0.5">{step.note}</p>}
            </div>
            {idx === history.length - 1 && (
              <div className="mt-2 text-[10px] font-bold text-[#006c4a] flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">check_circle</span>
                <span>Active & Escrow Protected</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cost Inclusions Explainer */}
      <div className="p-4 rounded-2xl bg-[#f0f3ff] border border-[#dee8ff] text-xs text-[#485b7e] space-y-2">
        <span className="font-bold text-[#111c2d] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-[#006c4a]">verified</span>
          <span>What is included in {dog.name}&rsquo;s ${currentPrice.toLocaleString()} Placement Fee?</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs text-[#006c4a]">check</span>
            <span>Comprehensive veterinary health certificate & vaccinations</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs text-[#006c4a]">check</span>
            <span>Lifetime microchip registration & ENS protocol certification</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs text-[#006c4a]">check</span>
            <span>OFA genetic clearances and pedigree lineage documentation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs text-[#006c4a]">check</span>
            <span>72-Hour PawPalace Veterinary Escrow Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};
