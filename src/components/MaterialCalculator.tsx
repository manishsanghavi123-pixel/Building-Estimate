import React from 'react';
import { MaterialRequirement, Language, MarketRates } from '../types/estimation';
import { Package, Truck, Info, CheckCircle } from 'lucide-react';

interface MaterialCalculatorProps {
  materials: MaterialRequirement[];
  rates: MarketRates;
  builtUpAreaSqFt: number;
  language: Language;
}

export const MaterialCalculator: React.FC<MaterialCalculatorProps> = ({
  materials,
  rates,
  builtUpAreaSqFt,
  language,
}) => {
  const isGu = language === 'gu';
  const totalMaterialCost = materials.reduce((sum, m) => sum + m.estimatedCost, 0);

  const getIconColor = (type: string) => {
    switch (type) {
      case 'cement':
        return 'bg-neutral-800 text-amber-400';
      case 'steel':
        return 'bg-blue-900 text-blue-200';
      case 'sand':
        return 'bg-amber-800 text-amber-200';
      case 'aggregate':
        return 'bg-stone-700 text-stone-200';
      case 'bricks':
        return 'bg-red-800 text-red-200';
      case 'tiles':
        return 'bg-emerald-800 text-emerald-200';
      case 'paint':
        return 'bg-purple-800 text-purple-200';
      default:
        return 'bg-neutral-800 text-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-600" />
              <span>{isGu ? 'કાચા માલસામાનનો જથ્થો (Raw Materials Volume)' : 'Raw Material Quantities & Cost'}</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              {isGu
                ? `${builtUpAreaSqFt.toLocaleString('en-IN')} ચોરસ ફૂટ બાંધકામ માટે જરૂરી સિમેન્ટની થેલીઓ, સ્ટીલ સળિયા, રેતી-કપચી અને ઈંટોની સચોટ ગણતરી.`
                : `Engineered thumb-rule calculations for ${builtUpAreaSqFt.toLocaleString('en-IN')} sq.ft built-up area.`}
            </p>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-right shrink-0">
            <span className="text-[11px] font-semibold text-neutral-500 block">
              {isGu ? 'કુલ અંદાજિત મટીરીયલ ખર્ચ' : 'Total Material Cost'}
            </span>
            <span className="text-lg font-bold font-mono text-neutral-900 tabular-nums">
              ₹{totalMaterialCost.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Materials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((mat) => {
          const costSharePct = totalMaterialCost > 0 ? ((mat.estimatedCost / totalMaterialCost) * 100).toFixed(1) : '0';

          return (
            <div
              key={mat.id}
              className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs hover:border-neutral-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${getIconColor(mat.iconType)}`}>
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-neutral-400 font-mono">
                      {mat.rateDisplay}
                    </span>
                    <span className="text-[10px] text-neutral-400 block font-mono">
                      {costSharePct}% of materials
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-xs text-neutral-900 leading-snug">
                  {mat.name[language]}
                </h3>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black font-mono text-neutral-900 tabular-nums">
                    {typeof mat.quantity === 'number' ? mat.quantity.toLocaleString('en-IN') : mat.quantity}
                  </span>
                  <span className="text-xs font-semibold text-neutral-500 font-mono">
                    {mat.unit}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500">{isGu ? 'અંદાજિત રકમ:' : 'Est. Amount:'}</span>
                <span className="font-bold font-mono text-neutral-900 tabular-nums">
                  ₹{mat.estimatedCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Material Quality Checks in Gujarat (Civil Engineer's Field Guide) */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4 text-amber-600" />
          <span>{isGu ? 'સાઇટ પર મટીરીયલ ચકાસણીની માર્ગદર્શિકા (Quality Check Guide)' : 'On-Site Material Quality Checks'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isGu ? 'સિમેન્ટ (Cement Quality)' : 'Cement Inspection'}</span>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              {isGu
                ? 'થેલી પર ઉત્પાદન તારીખ (MFG Week) ચેક કરવી. ૩ મહિનાથી જૂનો સિમેન્ટ ન વાપરવો. હાથમાં લેતાં મુલાયમ લાગવો જોઈએ અને ગઠ્ઠા ન હોવા જોઈએ.'
                : 'Check manufacturing week code. Cement older than 90 days loses 20-30% strength. Ensure no lumps exist.'}
            </p>
          </div>

          <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isGu ? 'સ્ટીલ સળિયા (TMT Rebar)' : 'Steel TMT Inspection'}</span>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              {isGu
                ? 'દરેક સળિયા પર કંપનીનું નામ (Tata / Jindal / Electrotherm), ગ્રેડ (Fe550D) અને ISI માર્કો ઉપસેલો હોવો જરૂરી છે. કાટ ન લાગેલો હોવો જોઈએ.'
                : 'Confirm embossed brand name, Fe550D grade, and BIS standard number. Ensure ribbed surface has no flaking rust.'}
            </p>
          </div>

          <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isGu ? 'નદીની રેતી / કપચી (Sand & Kapchi)' : 'Sand & Aggregate Inspection'}</span>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              {isGu
                ? 'રેતીમાં માટીનો ભાગ (સિલ્ટ) ૬% થી ઓછો હોવો જોઈએ. કપચી કાળા પથ્થરની ત્રિકોણીય એન્ગ્યુલર હોવી જોઈએ, ચપટા પાતળા પથ્થર ન હોવા જોઈએ.'
                : 'Silt content in river sand must be under 6%. Aggregates must be angular crushed basalt free from fine stone dust.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
