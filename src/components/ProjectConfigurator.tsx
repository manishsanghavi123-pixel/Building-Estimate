import React from 'react';
import { ProjectConfig, ProjectType, QualityTier, CityPreset, Language } from '../types/estimation';
import { PROJECT_TYPE_LABELS, QUALITY_TIER_LABELS, CITY_LABELS } from '../data/translations';
import { Building, Home, Warehouse, Sliders, MapPin, ShieldCheck, ChevronDown } from 'lucide-react';

interface ProjectConfiguratorProps {
  config: ProjectConfig;
  onChange: (updated: Partial<ProjectConfig>) => void;
  onApplyTemplate: (type: ProjectType) => void;
  language: Language;
}

export const ProjectConfigurator: React.FC<ProjectConfiguratorProps> = ({
  config,
  onChange,
  onApplyTemplate,
  language,
}) => {
  const isGu = language === 'gu';

  // Quick unit conversion
  const handlePlotVaarChange = (val: number) => {
    onChange({ plotAreaVaar: val });
  };

  const handleBuiltUpChange = (val: number) => {
    onChange({ builtUpAreaSqFt: Math.max(100, val) });
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5 md:p-6 shadow-xs">
      {/* Section 1: Choose Archetype */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-600" />
              <span>{isGu ? '૧. પ્રોજેક્ટ પ્રકાર પસંદ કરો' : '1. Select Project Archetype'}</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isGu
                ? 'બંગલો, રો-હાઉસ અથવા બિલ્ડિંગ મુજબ વિગતવાર ખર્ચ આપોઆપ ગણાશે.'
                : 'Select the building structure type to automatically adjust structural and finishing models.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Bungalow Option */}
          <button
            type="button"
            onClick={() => onApplyTemplate('bungalow')}
            className={`text-left p-4 rounded-xl border transition-all relative ${
              config.type === 'bungalow'
                ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                : 'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100/70 text-neutral-800'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  config.type === 'bungalow' ? 'bg-neutral-800 text-amber-400' : 'bg-white text-neutral-700 border border-neutral-200'
                }`}
              >
                <Home className="w-5 h-5" />
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  config.type === 'bungalow' ? 'bg-neutral-800 text-neutral-300' : 'text-neutral-500'
                }`}
              >
                G+1 / G+2
              </span>
            </div>
            <div className="font-bold text-sm mb-1">{PROJECT_TYPE_LABELS.bungalow[language]}</div>
            <p
              className={`text-xs line-clamp-2 leading-relaxed ${
                config.type === 'bungalow' ? 'text-neutral-300' : 'text-neutral-500'
              }`}
            >
              {PROJECT_TYPE_LABELS.bungalow[isGu ? 'descGu' : 'descEn']}
            </p>
          </button>

          {/* Row House Option */}
          <button
            type="button"
            onClick={() => onApplyTemplate('row_house')}
            className={`text-left p-4 rounded-xl border transition-all relative ${
              config.type === 'row_house'
                ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                : 'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100/70 text-neutral-800'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  config.type === 'row_house' ? 'bg-neutral-800 text-amber-400' : 'bg-white text-neutral-700 border border-neutral-200'
                }`}
              >
                <Warehouse className="w-5 h-5" />
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  config.type === 'row_house' ? 'bg-neutral-800 text-neutral-300' : 'text-neutral-500'
                }`}
              >
                Party Wall
              </span>
            </div>
            <div className="font-bold text-sm mb-1">{PROJECT_TYPE_LABELS.row_house[language]}</div>
            <p
              className={`text-xs line-clamp-2 leading-relaxed ${
                config.type === 'row_house' ? 'text-neutral-300' : 'text-neutral-500'
              }`}
            >
              {PROJECT_TYPE_LABELS.row_house[isGu ? 'descGu' : 'descEn']}
            </p>
          </button>

          {/* Building Option */}
          <button
            type="button"
            onClick={() => onApplyTemplate('building')}
            className={`text-left p-4 rounded-xl border transition-all relative ${
              config.type === 'building'
                ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                : 'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100/70 text-neutral-800'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  config.type === 'building' ? 'bg-neutral-800 text-amber-400' : 'bg-white text-neutral-700 border border-neutral-200'
                }`}
              >
                <Building className="w-5 h-5" />
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  config.type === 'building' ? 'bg-neutral-800 text-neutral-300' : 'text-neutral-500'
                }`}
              >
                G+5 to G+14
              </span>
            </div>
            <div className="font-bold text-sm mb-1">{PROJECT_TYPE_LABELS.building[language]}</div>
            <p
              className={`text-xs line-clamp-2 leading-relaxed ${
                config.type === 'building' ? 'text-neutral-300' : 'text-neutral-500'
              }`}
            >
              {PROJECT_TYPE_LABELS.building[isGu ? 'descGu' : 'descEn']}
            </p>
          </button>
        </div>
      </div>

      {/* Section 2: Core Dimensions & Quality Spec */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Built-Up Area */}
        <div className="bg-neutral-50/70 border border-neutral-200 rounded-lg p-3.5">
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            {isGu ? 'કુલ બાંધકામ વિસ્તાર (Built-Up Area)' : 'Total Built-Up Area'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="100"
              step="50"
              value={config.builtUpAreaSqFt}
              onChange={(e) => handleBuiltUpChange(Number(e.target.value))}
              className="w-full bg-white border border-neutral-300 rounded-md px-3 py-1.5 text-sm font-bold text-neutral-900 font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <span className="text-xs font-semibold text-neutral-500 shrink-0">
              {isGu ? 'ચો.ફૂટ' : 'sq.ft'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 flex justify-between">
            <span>≈ {Math.round(config.builtUpAreaSqFt / 9)} {isGu ? 'વાર' : 'Vaar'}</span>
            <span className="text-neutral-400">1 Vaar = 9 sq.ft</span>
          </div>
        </div>

        {/* Plot Area */}
        <div className="bg-neutral-50/70 border border-neutral-200 rounded-lg p-3.5">
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            {isGu ? 'પ્લોટ સાઇઝ (ચોરસ વાર)' : 'Plot Area (Sq. Yard / Vaar)'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="20"
              step="10"
              value={config.plotAreaVaar}
              onChange={(e) => handlePlotVaarChange(Number(e.target.value))}
              className="w-full bg-white border border-neutral-300 rounded-md px-3 py-1.5 text-sm font-bold text-neutral-900 font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <span className="text-xs font-semibold text-neutral-500 shrink-0">
              {isGu ? 'વાર' : 'Vaar'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            = {config.plotAreaVaar * 9} {isGu ? 'ચોરસ ફૂટ જમીન' : 'sq.ft land'}
          </div>
        </div>

        {/* Number of Floors */}
        <div className="bg-neutral-50/70 border border-neutral-200 rounded-lg p-3.5">
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            {isGu ? 'માળની સંખ્યા (Floors Count)' : 'Number of Floors'}
          </label>
          <div className="flex items-center gap-2">
            <select
              value={config.floorsCount}
              onChange={(e) => onChange({ floorsCount: Number(e.target.value) })}
              className="w-full bg-white border border-neutral-300 rounded-md px-3 py-1.5 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="1">{isGu ? 'ગ્રાઉન્ડ ફ્લોર માત્ર (G)' : 'Ground Floor Only (G)'}</option>
              <option value="2">{isGu ? 'ગ્રાઉન્ડ + ૧ માળ (G+1)' : 'Ground + 1 Floor (G+1)'}</option>
              <option value="3">{isGu ? 'ગ્રાઉન્ડ + ૨ માળ (G+2)' : 'Ground + 2 Floors (G+2)'}</option>
              <option value="4">{isGu ? 'ગ્રાઉન્ડ + ૩ માળ (G+3)' : 'Ground + 3 Floors (G+3)'}</option>
              <option value="5">{isGu ? 'સ્ટિલ્ટ + ૪ માળ (S+4)' : 'Stilt + 4 Floors'}</option>
              <option value="6">{isGu ? 'સ્ટિલ્ટ + ૫ માળ (S+5)' : 'Stilt + 5 Floors'}</option>
              <option value="7">{isGu ? 'સ્ટિલ્ટ + ૬ માળ (S+6)' : 'Stilt + 6 Floors'}</option>
              <option value="10">{isGu ? 'હાઇરાઇઝ (૧૦ માળ)' : 'High-rise (10 Floors)'}</option>
            </select>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            {isGu ? `આશરે ${Math.round(config.builtUpAreaSqFt / config.floorsCount)} ચો.ફૂટ / માળ` : `Avg ${Math.round(config.builtUpAreaSqFt / config.floorsCount)} sq.ft/floor`}
          </div>
        </div>

        {/* Location & City Market Presets */}
        <div className="bg-neutral-50/70 border border-neutral-200 rounded-lg p-3.5">
          <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>{isGu ? 'શહેર / બજાર વિસ્તાર' : 'City / Location'}</span>
          </label>
          <div className="relative">
            <select
              value={config.city}
              onChange={(e) => onChange({ city: e.target.value as CityPreset })}
              className="w-full bg-white border border-neutral-300 rounded-md px-3 py-1.5 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-amber-500 appearance-none"
            >
              <option value="ahmedabad">{CITY_LABELS.ahmedabad[language]}</option>
              <option value="surat">{CITY_LABELS.surat[language]}</option>
              <option value="vadodara">{CITY_LABELS.vadodara[language]}</option>
              <option value="rajkot">{CITY_LABELS.rajkot[language]}</option>
              <option value="general">{CITY_LABELS.general[language]}</option>
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            {isGu ? 'સ્થાનિક સિમેન્ટ, સ્ટીલ, રેતીના ભાવ' : 'Local materials & labor pricing'}
          </div>
        </div>
      </div>

      {/* Section 3: Quality Tier Selector */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
          {isGu ? '૨. બાંધકામ ગુણવત્તા સ્તર (Quality Specification)' : '2. Construction Quality Tier'}
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {(['economy', 'standard', 'premium', 'luxury'] as QualityTier[]).map((tier) => {
            const isSelected = config.quality === tier;
            const tierInfo = QUALITY_TIER_LABELS[tier];
            return (
              <button
                key={tier}
                type="button"
                onClick={() => onChange({ quality: tier })}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-600'
                    : 'border-neutral-200 bg-white hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-neutral-900">
                    {tierInfo[language]}
                  </span>
                  {isSelected && <ShieldCheck className="w-4 h-4 text-amber-600" />}
                </div>
                <div className="text-[11px] font-mono text-neutral-600 font-semibold">
                  {tierInfo.approxRate}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 4: Secondary Parameters (Collapsible or Clean Grid) */}
      <div className="pt-4 border-t border-neutral-100 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Project & Client Name */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
            {isGu ? 'પ્રોજેક્ટ અને ગ્રાહકનું નામ' : 'Project / Client Name'}
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder={isGu ? 'ઉદા. શ્રીજી બંગલો, મનીષભાઈ' : 'e.g. Dream Villa, Client Name'}
            className="w-full bg-white border border-neutral-300 rounded-md px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Site Location Address */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
            {isGu ? 'સાઇટનું સરનામું / લોકેશન' : 'Site Location Address'}
          </label>
          <input
            type="text"
            value={config.location}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder={isGu ? 'ઉદા. શીલજ, એસ.પી. રિંગ રોડ, અમદાવાદ' : 'e.g. Shela, SG Highway'}
            className="w-full bg-white border border-neutral-300 rounded-md px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Compound Wall & Sump features */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
              {isGu ? 'કમ્પાઉન્ડ દીવાલ (RFT)' : 'Compound Wall (RFT)'}
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={config.compoundWallRft}
              onChange={(e) => onChange({ compoundWallRft: Number(e.target.value) })}
              className="w-full bg-white border border-neutral-300 rounded-md px-3 py-1.5 text-xs text-neutral-900 font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
              {isGu ? 'ટાંકી ક્ષમતા (લિટર)' : 'Water Tank (Liters)'}
            </label>
            <input
              type="number"
              min="2000"
              step="1000"
              value={config.waterSumpCapacityLtr}
              onChange={(e) => onChange({ waterSumpCapacityLtr: Number(e.target.value) })}
              className="w-full bg-white border border-neutral-300 rounded-md px-3 py-1.5 text-xs text-neutral-900 font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
