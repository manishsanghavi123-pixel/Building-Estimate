import React from 'react';
import { ProjectConfig, BOQItem, Language } from '../types/estimation';
import { IndianRupee, Layers, Calendar, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

interface QuickEstimatorProps {
  config: ProjectConfig;
  items: BOQItem[];
  totalCost: number;
  subtotal: number;
  contractorMarginAmount: number;
  contingencyAmount: number;
  gstAmount: number;
  language: Language;
  onNavigateToBOQ: () => void;
  onNavigateToMaterials: () => void;
}

export const QuickEstimator: React.FC<QuickEstimatorProps> = ({
  config,
  items,
  totalCost,
  subtotal,
  contractorMarginAmount,
  contingencyAmount,
  gstAmount,
  language,
  onNavigateToBOQ,
  onNavigateToMaterials,
}) => {
  const isGu = language === 'gu';
  const area = Math.max(1, config.builtUpAreaSqFt);
  const costPerSqFt = Math.round(totalCost / area);

  // Group items by broad domain buckets
  const activeItems = items.filter((i) => i.isEnabled);
  const civilCost = activeItems
    .filter((i) => ['substructure', 'superstructure'].includes(i.category))
    .reduce((sum, i) => sum + i.amount, 0);

  const masonryPlasterCost = activeItems
    .filter((i) => i.category === 'masonry_plaster')
    .reduce((sum, i) => sum + i.amount, 0);

  const finishingCost = activeItems
    .filter((i) => ['flooring_tiling', 'doors_windows', 'painting'].includes(i.category))
    .reduce((sum, i) => sum + i.amount, 0);

  const mepCost = activeItems
    .filter((i) => ['electrical', 'plumbing'].includes(i.category))
    .reduce((sum, i) => sum + i.amount, 0);

  const approvalsAmenitiesCost = activeItems
    .filter((i) => ['approvals', 'special_amenities'].includes(i.category))
    .reduce((sum, i) => sum + i.amount, 0);

  const overheadsCost = contractorMarginAmount + contingencyAmount + gstAmount;

  const costBreakdownGroups = [
    {
      title: isGu ? '૧. આર.સી.સી. સ્ટ્રક્ચર (પાયો, સ્લેબ, કોલમ)' : '1. RCC Structural (Footings & Frame)',
      amount: civilCost,
      color: 'bg-amber-600',
      pct: subtotal > 0 ? Math.round((civilCost / totalCost) * 100) : 0,
    },
    {
      title: isGu ? '૨. ચણતર, પ્લાસ્ટર & વોટરપ્રૂફિંગ' : '2. Brickwork, Plaster & Waterproofing',
      amount: masonryPlasterCost,
      color: 'bg-orange-500',
      pct: subtotal > 0 ? Math.round((masonryPlasterCost / totalCost) * 100) : 0,
    },
    {
      title: isGu ? '૩. ફિનિશિંગ (ટાઇલ્સ, બારી-બારણાં, કલર)' : '3. Finishing (Flooring, Doors, Paint)',
      amount: finishingCost,
      color: 'bg-emerald-600',
      pct: subtotal > 0 ? Math.round((finishingCost / totalCost) * 100) : 0,
    },
    {
      title: isGu ? '૪. પ્લમ્બિંગ અને ઇલેક્ટ્રિકલ (MEP)' : '4. Plumbing & Electrical MEP',
      amount: mepCost,
      color: 'bg-blue-600',
      pct: subtotal > 0 ? Math.round((mepCost / totalCost) * 100) : 0,
    },
    {
      title: isGu ? '૫. પ્લાન પાસિંગ, લિફ્ટ & સ્પેશિયલ ફીચર્સ' : '5. Approvals, Elevator & Amenities',
      amount: approvalsAmenitiesCost,
      color: 'bg-purple-600',
      pct: subtotal > 0 ? Math.round((approvalsAmenitiesCost / totalCost) * 100) : 0,
    },
    {
      title: isGu ? '૬. કોન્ટ્રાક્ટર સુપરવિઝન, બફર & GST' : '6. Contractor Fee, Contingency & GST',
      amount: overheadsCost,
      color: 'bg-neutral-600',
      pct: subtotal > 0 ? Math.round((overheadsCost / totalCost) * 100) : 0,
    },
  ];

  // Duration estimation logic
  const durationMonths =
    config.type === 'building'
      ? Math.max(12, Math.round(config.floorsCount * 2.2 + 6))
      : config.type === 'bungalow'
      ? Math.max(6, Math.round(config.floorsCount * 2.5 + 3))
      : Math.max(5, Math.round(config.floorsCount * 2 + 2));

  // Format in Lakhs/Crores for scannability
  const formatLakhs = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} ${isGu ? 'કરોડ' : 'Cr'}`;
    }
    return `₹${(val / 100000).toFixed(2)} ${isGu ? 'લાખ' : 'Lakh'}`;
  };

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Estimate */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-xs font-semibold">{isGu ? 'કુલ અંદાજિત ખર્ચ' : 'Total Estimated Cost'}</span>
            <IndianRupee className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black font-mono text-neutral-900 tabular-nums">
            ₹{totalCost.toLocaleString('en-IN')}
          </div>
          <div className="text-xs font-semibold text-neutral-500 mt-1">
            {formatLakhs(totalCost)}
          </div>
        </div>

        {/* Metric 2: Cost per Sq.Ft */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-xs font-semibold">{isGu ? 'ભાવ દર ચોરસ ફૂટ' : 'Rate Per Sq.Ft'}</span>
            <Layers className="w-4 h-4 text-neutral-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
            ₹{costPerSqFt.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            {isGu ? 'વિથ મટીરીયલ (With Material)' : 'All Inclusive with Material'}
          </div>
        </div>

        {/* Metric 3: Built-Up Area */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-xs font-semibold">{isGu ? 'કુલ બાંધકામ ક્ષેત્રફળ' : 'Super Built-Up Area'}</span>
            <span className="text-xs font-bold text-neutral-400 font-mono">SQ.FT</span>
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
            {config.builtUpAreaSqFt.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            ≈ {Math.round(config.builtUpAreaSqFt / 9)} {isGu ? 'ચોરસ વાર' : 'Sq. Yard'}
          </div>
        </div>

        {/* Metric 4: Estimated Time to Construct */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-xs font-semibold">{isGu ? 'અંદાજિત સમયગાળો' : 'Estimated Time'}</span>
            <Calendar className="w-4 h-4 text-neutral-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {durationMonths} {isGu ? 'મહિના' : 'Months'}
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            {isGu ? 'પાયાથી સંપૂર્ણ હેન્ડઓવર' : 'Foundation to Handover'}
          </div>
        </div>
      </div>

      {/* Main Two-Column Breakdown & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Cost Category Share Bars (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                {isGu ? 'બાંધકામ ખર્ચ વહેંચણી (Category Breakdown)' : 'Cost Breakdown by Category'}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                {isGu
                  ? 'કયા તબક્કામાં કેટલો ખર્ચ થશે તેની સચોટ ટકાવારી અને રકમ.'
                  : 'Proportional budget distribution across major construction stages.'}
              </p>
            </div>
            <button
              onClick={onNavigateToBOQ}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>{isGu ? 'સંપૂર્ણ BOQ જુઓ' : 'View Full BOQ'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Visual Category Breakdown Rows */}
          <div className="space-y-3.5">
            {costBreakdownGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-700">{group.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-neutral-900 tabular-nums">
                      ₹{group.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-400 w-8 text-right font-mono">
                      {group.pct}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${group.color} transition-all duration-300`}
                    style={{ width: `${Math.min(100, Math.max(2, group.pct))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary Note */}
          <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>
              {isGu ? 'કોન્ટ્રાક્ટર માર્જિન:' : 'Contractor Margin:'}{' '}
              <strong className="text-neutral-800 font-mono">{config.contractorMarginPct}%</strong>
            </span>
            <span>
              {isGu ? 'આકસ્મિક બફર:' : 'Contingency:'}{' '}
              <strong className="text-neutral-800 font-mono">{config.contingencyPct}%</strong>
            </span>
            <span>
              {isGu ? 'GST ટેક્સ:' : 'GST:'}{' '}
              <strong className="text-neutral-800 font-mono">{config.gstPct}%</strong>
            </span>
          </div>
        </div>

        {/* Right Column: Key Takeaways & Recommendations for Gujarat Construction */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isGu ? 'મહત્વની બાબતો અને સલાહ' : 'Key Engineering Notes'}</span>
            </h3>

            <div className="space-y-3 text-xs text-neutral-600">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="font-bold text-neutral-800 block mb-1">
                  {isGu ? '૧. સિમેન્ટ ક્યુરિંગ (પાણી પાવાની મુદત)' : '1. Proper Curing Duration'}
                </span>
                <p className="text-neutral-600 leading-relaxed">
                  {isGu
                    ? 'સ્લેબ અને થાંભલાને ઓછામાં ઓછું ૧૪ થી ૨૧ દિવસ સુધી સતત ભીના રાખવા જેથી સિમેન્ટ પૂરી મજબૂતી પકડે.'
                    : 'Maintain continuous water curing for RCC slabs and columns for minimum 14-21 days.'}
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="font-bold text-neutral-800 block mb-1">
                  {isGu ? '૨. સ્ટીલ ક્વોલિટી (Fe550D સળિયા)' : '2. Steel Grade Certification'}
                </span>
                <p className="text-neutral-600 leading-relaxed">
                  {isGu
                    ? 'હંમેશા ISI માર્કા વાળા Fe550D પ્રાઇમરી સળિયા (ટાટા, જિંદાલ, સ્ટીલ ઓથોરિટી) વાપરવા.'
                    : 'Use genuine BIS-certified Fe550D TMT rebar with high ductility for seismic safety.'}
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="font-bold text-neutral-800 block mb-1">
                  {isGu ? '૩. માટી ખોદાણ & ઉધઈ નિયંત્રણ' : '3. Anti-Termite Injection'}
                </span>
                <p className="text-neutral-600 leading-relaxed">
                  {isGu
                    ? 'પ્લિન્થ લેવલ પર ઉધઈ વિરોધી કેમિકલ સ્પ્રે કરાવવાથી ભવિષ્યમાં લાકડાના બારણાં-ફર્નિચર સુરક્ષિત રહે છે.'
                    : 'Pre-construction chemical anti-termite treatment prevents subterranean termite infestation in woodwork.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100">
            <button
              onClick={onNavigateToMaterials}
              className="w-full py-2 px-3 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{isGu ? 'જથ્થા ગણતરી (સિમેન્ટ/સ્ટીલ થેલીઓ) જુઓ' : 'View Exact Material Counts'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
