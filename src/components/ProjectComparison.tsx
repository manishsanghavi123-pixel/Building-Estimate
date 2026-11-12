import React, { useState } from 'react';
import { ProjectConfig, QualityTier, ProjectType, Language, MarketRates } from '../types/estimation';
import { QUALITY_TIER_LABELS, PROJECT_TYPE_LABELS } from '../data/translations';
import { generateBOQItems } from '../data/defaultData';
import { Check, ArrowRight, Scale } from 'lucide-react';

interface ProjectComparisonProps {
  currentConfig: ProjectConfig;
  rates: MarketRates;
  onApplyConfig: (newConfig: Partial<ProjectConfig>) => void;
  language: Language;
}

export const ProjectComparison: React.FC<ProjectComparisonProps> = ({
  currentConfig,
  rates,
  onApplyConfig,
  language,
}) => {
  const isGu = language === 'gu';
  const [comparisonMode, setComparisonMode] = useState<'tiers' | 'types'>('tiers');

  const area = currentConfig.builtUpAreaSqFt;

  // Calculate costs for all 4 quality tiers
  const tierComparisons = (['economy', 'standard', 'premium', 'luxury'] as QualityTier[]).map((tier) => {
    const dummyConfig: ProjectConfig = { ...currentConfig, quality: tier };
    const items = generateBOQItems(dummyConfig, rates);
    const subtotal = items.reduce((sum, i) => sum + i.amount, 0);
    const contractor = Math.round((subtotal * dummyConfig.contractorMarginPct) / 100);
    const contingency = Math.round((subtotal * dummyConfig.contingencyPct) / 100);
    const gst = Math.round(((subtotal + contractor + contingency) * dummyConfig.gstPct) / 100);
    const total = subtotal + contractor + contingency + gst;
    const ratePerSqFt = Math.round(total / area);

    return {
      tier,
      total,
      ratePerSqFt,
      cementBags: Math.round(area * 0.42),
      steelKg: Math.round(area * 4.0),
    };
  });

  // Calculate costs for all 3 project types
  const typeComparisons = (['bungalow', 'row_house', 'building'] as ProjectType[]).map((type) => {
    const dummyConfig: ProjectConfig = {
      ...currentConfig,
      type,
      floorsCount: type === 'building' ? 5 : 2,
      hasElevator: type === 'building',
    };
    const items = generateBOQItems(dummyConfig, rates);
    const subtotal = items.reduce((sum, i) => sum + i.amount, 0);
    const contractor = Math.round((subtotal * dummyConfig.contractorMarginPct) / 100);
    const contingency = Math.round((subtotal * dummyConfig.contingencyPct) / 100);
    const gst = Math.round(((subtotal + contractor + contingency) * dummyConfig.gstPct) / 100);
    const total = subtotal + contractor + contingency + gst;
    const ratePerSqFt = Math.round(total / area);

    return {
      type,
      total,
      ratePerSqFt,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header with Mode Switch */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-600" />
              <span>{isGu ? 'બાંધકામ પ્લાન સરખામણી (Comparison Matrix)' : 'Project Cost Comparison Matrix'}</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              {isGu
                ? `હાલના ${area.toLocaleString('en-IN')} ચોરસ ફૂટ બાંધકામ વિસ્તારના આધારે સરખામણી.`
                : `Benchmarked for ${area.toLocaleString('en-IN')} sq.ft built-up area.`}
            </p>
          </div>

          {/* Segmented Mode Switch */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg shrink-0">
            <button
              onClick={() => setComparisonMode('tiers')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                comparisonMode === 'tiers'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {isGu ? 'ગુણવત્તા સ્તર (Quality Tiers)' : 'Quality Tiers'}
            </button>
            <button
              onClick={() => setComparisonMode('types')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                comparisonMode === 'types'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {isGu ? 'મકાન પ્રકાર (Bungalow vs Row House vs Building)' : 'Archetypes'}
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Quality Tiers Comparison Matrix */}
      {comparisonMode === 'tiers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tierComparisons.map((c) => {
            const isCurrent = currentConfig.quality === c.tier;
            const tierMeta = QUALITY_TIER_LABELS[c.tier];

            return (
              <div
                key={c.tier}
                className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all ${
                  isCurrent ? 'border-amber-600 ring-2 ring-amber-600/20' : 'border-neutral-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-900">
                      {tierMeta[language]}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {isGu ? 'હાલમાં પસંદિત' : 'Active'}
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <span className="text-2xl font-black font-mono text-neutral-900 tabular-nums">
                      ₹{c.total.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-mono font-bold text-neutral-500 block mt-0.5">
                      ₹{c.ratePerSqFt.toLocaleString('en-IN')} / sq.ft
                    </span>
                  </div>

                  {/* Feature highlights */}
                  <div className="mt-5 space-y-2 text-xs text-neutral-600 border-t border-neutral-100 pt-4">
                    <div className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        {c.tier === 'economy'
                          ? isGu ? '૬૦૦x૬૦૦ વિટ્રિફાઇડ, સ્ટાન્ડર્ડ ફ્લશ દરવાજા' : '600x600 vitrified, standard flush doors'
                          : c.tier === 'standard'
                          ? isGu ? '૬૦૦x૧૨૦૦ ટાઇલ્સ, UPVC બારી, Cera ફિટિંગ્સ' : '600x1200 tiles, UPVC windows, Cera'
                          : c.tier === 'premium'
                          ? isGu ? '૮૦૦x૧૬૦૦ GVT, Jaquar, વેનીયર દરવાજા, રોયલ પેઇન્ટ' : '800x1600 GVT, Jaquar, Veneer doors, Royale'
                          : isGu ? 'ઇટાલિયન માર્બલ, સ્માર્ટ લોક, સાઉન્ડપ્રૂફ ગ્લાસ, લક્ઝરી' : 'Italian marble, Smart locks, Soundproof glass'}
                      </span>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        {isGu ? `સિમેન્ટ: ~${c.cementBags} થેલી` : `Cement: ~${c.cementBags} bags`}
                      </span>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        {isGu ? `સ્ટીલ: ~${(c.steelKg / 1000).toFixed(1)} MT` : `Steel: ~${(c.steelKg / 1000).toFixed(1)} MT`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    disabled={isCurrent}
                    onClick={() => onApplyConfig({ quality: c.tier })}
                    className={`w-full py-2 px-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? 'bg-neutral-100 text-neutral-400 cursor-default'
                        : 'bg-neutral-900 text-white hover:bg-neutral-800'
                    }`}
                  >
                    <span>{isCurrent ? (isGu ? 'હાલમાં ચાલુ છે' : 'Currently Active') : (isGu ? 'આ સ્તર લાગુ કરો' : 'Select Tier')}</span>
                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mode 2: Project Archetypes Comparison */}
      {comparisonMode === 'types' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {typeComparisons.map((c) => {
            const isCurrent = currentConfig.type === c.type;
            const typeMeta = PROJECT_TYPE_LABELS[c.type];

            return (
              <div
                key={c.type}
                className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all ${
                  isCurrent ? 'border-amber-600 ring-2 ring-amber-600/20' : 'border-neutral-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-neutral-900">
                      {typeMeta[language]}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {isGu ? 'હાલમાં પસંદિત' : 'Active'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                    {typeMeta[isGu ? 'descGu' : 'descEn']}
                  </p>

                  <div>
                    <span className="text-2xl font-black font-mono text-neutral-900 tabular-nums">
                      ₹{c.total.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-mono font-bold text-neutral-500 block mt-0.5">
                      ₹{c.ratePerSqFt.toLocaleString('en-IN')} / sq.ft
                    </span>
                  </div>

                  <div className="mt-5 space-y-2 text-xs text-neutral-600 border-t border-neutral-100 pt-4">
                    <div className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        {c.type === 'bungalow'
                          ? isGu ? 'સ્વતંત્ર પાયો, કમ્પાઉન્ડ દીવાલ, ટેરેસ ગાર્ડન' : 'Private plot, compound wall, terrace'
                          : c.type === 'row_house'
                          ? isGu ? 'શેર્ડ દીવાલોથી ૮-૧૦% દીવાલ ખર્ચની બચત' : 'Shared walls save 8-10% masonry cost'
                          : isGu ? 'લિફ્ટ, સ્ટિલ્ટ પાર્કિંગ, ફાયર સેફ્ટી કમ્પ્લાયન્સ' : 'Elevator, stilt parking, fire safety'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    disabled={isCurrent}
                    onClick={() => onApplyConfig({ type: c.type })}
                    className={`w-full py-2 px-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? 'bg-neutral-100 text-neutral-400 cursor-default'
                        : 'bg-neutral-900 text-white hover:bg-neutral-800'
                    }`}
                  >
                    <span>{isCurrent ? (isGu ? 'હાલમાં પસંદિત' : 'Currently Active') : (isGu ? 'આ મોડેલ લાગુ કરો' : 'Select Archetype')}</span>
                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
