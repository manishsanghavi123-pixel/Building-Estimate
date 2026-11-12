import React, { useState } from 'react';
import { MarketRates, CityPreset, Language } from '../types/estimation';
import { CITY_MARKET_RATES } from '../data/defaultData';
import { CITY_LABELS } from '../data/translations';
import { X, RotateCcw, Check, MapPin } from 'lucide-react';

interface MarketRatesEditorProps {
  rates: MarketRates;
  city: CityPreset;
  onSaveRates: (newRates: MarketRates, selectedCity: CityPreset) => void;
  onClose: () => void;
  language: Language;
}

export const MarketRatesEditor: React.FC<MarketRatesEditorProps> = ({
  rates,
  city,
  onSaveRates,
  onClose,
  language,
}) => {
  const isGu = language === 'gu';
  const [localRates, setLocalRates] = useState<MarketRates>({ ...rates });
  const [selectedCity, setSelectedCity] = useState<CityPreset>(city);

  const handleCityPresetClick = (targetCity: CityPreset) => {
    setSelectedCity(targetCity);
    setLocalRates({ ...CITY_MARKET_RATES[targetCity] });
  };

  const handleRateChange = (field: keyof MarketRates, val: number) => {
    setLocalRates((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = () => {
    onSaveRates(localRates, selectedCity);
    onClose();
  };

  const handleReset = () => {
    setLocalRates({ ...CITY_MARKET_RATES[selectedCity] });
  };

  const fields: { key: keyof MarketRates; labelEn: string; labelGu: string; unit: string }[] = [
    { key: 'cementBag', labelEn: 'Cement Bag (50kg)', labelGu: 'સિમેન્ટ થેલી (૫૦ કિલો)', unit: '₹ / bag' },
    { key: 'steelKg', labelEn: 'TMT Steel Rebar', labelGu: 'સ્ટીલ Fe550D સળિયા', unit: '₹ / kg' },
    { key: 'riverSandBrass', labelEn: 'River Sand (100 cu.ft)', labelGu: 'નદીની રેતી (બ્રાસ)', unit: '₹ / brass' },
    { key: 'kapchiBrass', labelEn: 'Kapchi Aggregate', labelGu: 'કપચી / મેટલ (બ્રાસ)', unit: '₹ / brass' },
    { key: 'redBricksPiece', labelEn: 'Red Clay Bricks', labelGu: 'ભઠ્ઠાની લાલ ઈંટો', unit: '₹ / piece' },
    { key: 'aacBlockPiece', labelEn: 'AAC Lightweight Block', labelGu: 'AAC લાઇટવેઇટ બ્લોક', unit: '₹ / block' },
    { key: 'laborSqFt', labelEn: 'Civil Labor Only Rate', labelGu: 'સિવિલ લેબર મજૂરી દર', unit: '₹ / sq.ft' },
    { key: 'plasterLaborSqFt', labelEn: 'Plaster Labor Rate', labelGu: 'પ્લાસ્ટર મજૂરી દર', unit: '₹ / sq.ft' },
    { key: 'tileLayingSqFt', labelEn: 'Tile Fixing Labor', labelGu: 'ટાઇલ્સ ફિટિંગ મજૂરી', unit: '₹ / sq.ft' },
    { key: 'electricalPointRate', labelEn: 'Electrical Point Wiring', labelGu: 'ઇલેક્ટ્રિકલ પોઇન્ટ વાયરિંગ', unit: '₹ / point' },
    { key: 'paintLaborMaterialSqFt', labelEn: 'Putty + Paint (L&M)', labelGu: 'પુટ્ટી + કલર (મટીરીયલ & મજૂરી)', unit: '₹ / sq.ft' },
    { key: 'graniteSqFt', labelEn: 'Black Granite Material', labelGu: 'જેટ બ્લેક ગ્રેનાઇટ', unit: '₹ / sq.ft' },
    { key: 'vitrifiedTileSqFt', labelEn: 'Vitrified Tiles Material', labelGu: 'વિટ્રિફાઇડ ટાઇલ્સ', unit: '₹ / sq.ft' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">
              {isGu ? 'સ્થાનિક બજાર ભાવ સંપાદિત કરો (Market Rates)' : 'Edit Local Market Rates'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isGu
                ? 'તમારા શહેર મુજબ સિમેન્ટ, સ્ટીલ, રેતી અને મજૂરીના વાસ્તવિક ભાવ બદલો.'
                : 'Configure material and labor unit rates based on your specific city vendors.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* City Presets Bar */}
        <div className="px-6 py-3 bg-neutral-100/60 border-b border-neutral-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-neutral-600 flex items-center gap-1 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>{isGu ? 'શહેર પ્રીસેટ:' : 'Presets:'}</span>
          </span>
          {(['ahmedabad', 'surat', 'vadodara', 'rajkot', 'general'] as CityPreset[]).map((cKey) => (
            <button
              key={cKey}
              type="button"
              onClick={() => handleCityPresetClick(cKey)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedCity === cKey
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {CITY_LABELS[cKey][language]}
            </button>
          ))}
        </div>

        {/* Scrollable Fields Grid */}
        <div className="p-6 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div
                key={f.key}
                className="p-3 bg-neutral-50/60 border border-neutral-200 rounded-lg flex items-center justify-between gap-3"
              >
                <div>
                  <label className="block text-xs font-bold text-neutral-800">
                    {isGu ? f.labelGu : f.labelEn}
                  </label>
                  <span className="text-[11px] text-neutral-400 font-mono">{f.unit}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-neutral-400 font-mono">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={localRates[f.key]}
                    onChange={(e) => handleRateChange(f.key, parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-1 bg-white border border-neutral-300 rounded text-xs font-mono font-bold text-neutral-900 text-right focus:outline-none focus:ring-1 focus:ring-amber-500 tabular-nums"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-neutral-50/80 border-t border-neutral-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isGu ? 'પ્રીસેટ રિસેટ કરો' : 'Reset to Preset'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-200/60 rounded-lg transition-colors"
            >
              {isGu ? 'રદ કરો' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>{isGu ? 'ભાવ સેવ કરો અને ગણતરી કરો' : 'Apply & Recalculate'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
