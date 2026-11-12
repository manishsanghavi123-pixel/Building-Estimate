import React, { useState, useEffect, useMemo } from 'react';
import { ProjectConfig, ProjectType, QualityTier, Language, MarketRates, BOQItem, CityPreset } from './types/estimation';
import {
  CITY_MARKET_RATES,
  DEFAULT_PROJECT_TEMPLATES,
  generateBOQItems,
  calculateMaterialRequirements,
  getStageMilestones,
} from './data/defaultData';
import { Header } from './components/Header';
import { ProjectConfigurator } from './components/ProjectConfigurator';
import { QuickEstimator } from './components/QuickEstimator';
import { DetailedBOQ } from './components/DetailedBOQ';
import { MaterialCalculator } from './components/MaterialCalculator';
import { StageMilestones } from './components/StageMilestones';
import { MarketRatesEditor } from './components/MarketRatesEditor';
import { ProjectComparison } from './components/ProjectComparison';
import { PrintQuotation } from './components/PrintQuotation';
import { SavedProjectsModal } from './components/SavedProjectsModal';

const INITIAL_PROJECT_CONFIG: ProjectConfig = {
  id: 'proj_default_1',
  name: 'શ્રીજી લક્ષ્મી વિલા (Dream Bungalow)',
  clientName: 'મનીષભાઈ સંઘવી (Manishbhai)',
  clientPhone: '+91 98980 00000',
  location: 'શીલજ, એસ.પી. રિંગ રોડ, અમદાવાદ',
  city: 'ahmedabad',
  type: 'bungalow',
  quality: 'standard',
  plotAreaVaar: 200,
  builtUpAreaSqFt: 2400,
  floorsCount: 2,
  unitsCount: 1,
  hasBasement: false,
  basementAreaSqFt: 0,
  hasElevator: false,
  elevatorFloors: 0,
  compoundWallRft: 180,
  waterSumpCapacityLtr: 10000,
  contractorMarginPct: 10,
  contingencyPct: 4,
  gstPct: 18,
  notes: 'G+1 Independent Luxury Bungalow with parking, private terrace, and water sump.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function App() {
  // Default to Gujarati as the user requested in Gujarati ("mare aevi application bannavavi che...")
  const [language, setLanguage] = useState<Language>('gu');
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Market rates & Project config
  const [config, setConfig] = useState<ProjectConfig>(() => {
    const saved = localStorage.getItem('nirmancost_active_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_PROJECT_CONFIG;
  });

  const [marketRates, setMarketRates] = useState<MarketRates>(() => {
    const saved = localStorage.getItem('nirmancost_market_rates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return CITY_MARKET_RATES.ahmedabad;
  });

  // BOQ items (live editable)
  const [boqItems, setBoqItems] = useState<BOQItem[]>(() => {
    return generateBOQItems(INITIAL_PROJECT_CONFIG, CITY_MARKET_RATES.ahmedabad);
  });

  // Saved estimates in localStorage
  const [savedEstimates, setSavedEstimates] = useState<ProjectConfig[]>(() => {
    const saved = localStorage.getItem('nirmancost_saved_estimates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      INITIAL_PROJECT_CONFIG,
      {
        ...INITIAL_PROJECT_CONFIG,
        id: 'proj_sample_rowhouse',
        name: 'સુરત ગ્રીનવિલા રો-હાઉસ (Row House)',
        type: 'row_house',
        quality: 'economy',
        plotAreaVaar: 110,
        builtUpAreaSqFt: 1550,
        floorsCount: 2,
        city: 'surat',
        location: 'વેસુ, સુરત',
      },
      {
        ...INITIAL_PROJECT_CONFIG,
        id: 'proj_sample_building',
        name: 'વડોદરા એલિગન્સ એપાર્ટમેન્ટ (10 Flats)',
        type: 'building',
        quality: 'premium',
        plotAreaVaar: 550,
        builtUpAreaSqFt: 13500,
        floorsCount: 6,
        unitsCount: 10,
        hasElevator: true,
        elevatorFloors: 6,
        city: 'vadodara',
        location: 'વાસણા રોડ, વડોદરા',
      },
    ];
  });

  // Modals state
  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Sync active config to localStorage
  useEffect(() => {
    localStorage.setItem('nirmancost_active_config', JSON.stringify(config));
  }, [config]);

  // Sync market rates to localStorage
  useEffect(() => {
    localStorage.setItem('nirmancost_market_rates', JSON.stringify(marketRates));
  }, [marketRates]);

  // Sync saved estimates to localStorage
  useEffect(() => {
    localStorage.setItem('nirmancost_saved_estimates', JSON.stringify(savedEstimates));
  }, [savedEstimates]);

  // Handle Project Type Template application
  const handleApplyTemplate = (type: ProjectType) => {
    const template = DEFAULT_PROJECT_TEMPLATES[type];
    const newConfig: ProjectConfig = {
      ...config,
      ...template,
      type,
      updatedAt: new Date().toISOString(),
    };
    setConfig(newConfig);
    const newItems = generateBOQItems(newConfig, marketRates);
    setBoqItems(newItems);
  };

  // Handle Config changes (area, quality, floors, etc.)
  const handleConfigChange = (updates: Partial<ProjectConfig>) => {
    const updated = { ...config, ...updates, updatedAt: new Date().toISOString() };

    // If city changed, update market rates automatically if user hasn't heavily customized
    if (updates.city && updates.city !== config.city) {
      setMarketRates(CITY_MARKET_RATES[updates.city]);
    }

    setConfig(updated);

    // If area, quality, floors, or elevator changed, regenerate the baseline quantities
    if (
      updates.builtUpAreaSqFt !== undefined ||
      updates.quality !== undefined ||
      updates.type !== undefined ||
      updates.floorsCount !== undefined ||
      updates.hasElevator !== undefined ||
      updates.compoundWallRft !== undefined ||
      updates.waterSumpCapacityLtr !== undefined
    ) {
      const regenerated = generateBOQItems(updated, marketRates);
      setBoqItems(regenerated);
    }
  };

  // Update a single BOQ item (e.g. rate, quantity, enabled)
  const handleUpdateBOQItem = (id: string, updates: Partial<BOQItem>) => {
    setBoqItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Add a custom BOQ item
  const handleAddBOQItem = (newItem: Omit<BOQItem, 'id'>) => {
    const itemWithId: BOQItem = {
      ...newItem,
      id: `custom_${Date.now()}`,
    };
    setBoqItems((prev) => [...prev, itemWithId]);
  };

  // Delete a BOQ item
  const handleDeleteBOQItem = (id: string) => {
    setBoqItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Reset BOQ items to template
  const handleResetBOQ = () => {
    const fresh = generateBOQItems(config, marketRates);
    setBoqItems(fresh);
  };

  // Market Rates Save
  const handleSaveMarketRates = (newRates: MarketRates, selectedCity: CityPreset) => {
    setMarketRates(newRates);
    setConfig((prev) => ({ ...prev, city: selectedCity }));
    // Re-apply new rates to all items
    const regenerated = generateBOQItems({ ...config, city: selectedCity }, newRates);
    setBoqItems(regenerated);
  };

  // Saved Estimates Handlers
  const handleSaveCurrentAsNew = (name: string) => {
    const newEntry: ProjectConfig = {
      ...config,
      id: `proj_${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSavedEstimates((prev) => [newEntry, ...prev]);
  };

  const handleLoadEstimate = (loaded: ProjectConfig) => {
    setConfig(loaded);
    if (loaded.city && CITY_MARKET_RATES[loaded.city]) {
      setMarketRates(CITY_MARKET_RATES[loaded.city]);
    }
    const regenerated = generateBOQItems(loaded, marketRates);
    setBoqItems(regenerated);
  };

  const handleDeleteEstimate = (id: string) => {
    setSavedEstimates((prev) => prev.filter((e) => e.id !== id));
  };

  // Financial Grand Total calculations
  const activeItems = useMemo(() => boqItems.filter((i) => i.isEnabled), [boqItems]);
  const subtotal = useMemo(() => activeItems.reduce((sum, i) => sum + i.amount, 0), [activeItems]);
  const contractorMarginAmount = Math.round((subtotal * config.contractorMarginPct) / 100);
  const contingencyAmount = Math.round((subtotal * config.contingencyPct) / 100);
  const taxableBase = subtotal + contractorMarginAmount + contingencyAmount;
  const gstAmount = Math.round((taxableBase * config.gstPct) / 100);
  const totalCost = taxableBase + gstAmount;

  // Material Requirements
  const materialRequirements = useMemo(() => {
    return calculateMaterialRequirements(config.builtUpAreaSqFt, config.quality, marketRates, config.type);
  }, [config.builtUpAreaSqFt, config.quality, marketRates, config.type]);

  // Stage Milestones
  const stageMilestones = useMemo(() => {
    return getStageMilestones(totalCost);
  }, [totalCost]);

  return (
    <div className="min-h-screen bg-neutral-100/70 text-neutral-900 flex flex-col">
      {/* Top Navigation */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenRates={() => setIsRatesModalOpen(true)}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onPrint={() => setActiveTab('quotation')}
        totalCost={totalCost}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Printable Quotation View */}
        {activeTab === 'quotation' ? (
          <PrintQuotation
            config={config}
            items={boqItems}
            milestones={stageMilestones}
            materials={materialRequirements}
            totalCost={totalCost}
            subtotal={subtotal}
            contractorMarginAmount={contractorMarginAmount}
            contingencyAmount={contingencyAmount}
            gstAmount={gstAmount}
            language={language}
            onBackToApp={() => setActiveTab('overview')}
          />
        ) : (
          <>
            {/* Always visible interactive project configurator (collapsed/expanded gracefully) */}
            <ProjectConfigurator
              config={config}
              onChange={handleConfigChange}
              onApplyTemplate={handleApplyTemplate}
              language={language}
            />

            {/* Tab 1: Overview & Cost Summary */}
            {activeTab === 'overview' && (
              <QuickEstimator
                config={config}
                items={boqItems}
                totalCost={totalCost}
                subtotal={subtotal}
                contractorMarginAmount={contractorMarginAmount}
                contingencyAmount={contingencyAmount}
                gstAmount={gstAmount}
                language={language}
                onNavigateToBOQ={() => setActiveTab('detailed')}
                onNavigateToMaterials={() => setActiveTab('materials')}
              />
            )}

            {/* Tab 2: A to Z Detailed BOQ */}
            {activeTab === 'detailed' && (
              <DetailedBOQ
                items={boqItems}
                config={config}
                onUpdateItem={handleUpdateBOQItem}
                onAddItem={handleAddBOQItem}
                onDeleteItem={handleDeleteBOQItem}
                onResetItems={handleResetBOQ}
                onUpdateConfig={handleConfigChange}
                language={language}
              />
            )}

            {/* Tab 3: Material Volume Quantities */}
            {activeTab === 'materials' && (
              <MaterialCalculator
                materials={materialRequirements}
                rates={marketRates}
                builtUpAreaSqFt={config.builtUpAreaSqFt}
                language={language}
              />
            )}

            {/* Tab 4: Payment Milestones */}
            {activeTab === 'milestones' && (
              <StageMilestones
                milestones={stageMilestones}
                totalCost={totalCost}
                language={language}
              />
            )}

            {/* Tab 5: Compare Plans */}
            {activeTab === 'compare' && (
              <ProjectComparison
                currentConfig={config}
                rates={marketRates}
                onApplyConfig={handleConfigChange}
                language={language}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-neutral-200 bg-white py-4 text-xs text-neutral-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {language === 'gu'
              ? 'નિર્માણ કોસ્ટ © ૨૦૨૬ · બંગલો, રો-હાઉસ અને એપાર્ટમેન્ટ બાંધકામ ખર્ચ કેલ્ક્યુલેટર'
              : 'NirmanCost © 2026 · Indian Construction Cost & BOQ Estimator'}
          </span>
          <div className="flex items-center gap-4 text-neutral-600">
            <span>{config.city.toUpperCase()} MARKET</span>
            <span>·</span>
            <span>{config.quality.toUpperCase()} SPEC</span>
          </div>
        </div>
      </footer>

      {/* Market Rates Modal */}
      {isRatesModalOpen && (
        <MarketRatesEditor
          rates={marketRates}
          city={config.city}
          onSaveRates={handleSaveMarketRates}
          onClose={() => setIsRatesModalOpen(false)}
          language={language}
        />
      )}

      {/* Saved Projects Modal */}
      {isSavedModalOpen && (
        <SavedProjectsModal
          currentConfig={config}
          savedEstimates={savedEstimates}
          onLoadEstimate={handleLoadEstimate}
          onSaveCurrentAsNew={handleSaveCurrentAsNew}
          onDeleteEstimate={handleDeleteEstimate}
          onClose={() => setIsSavedModalOpen(false)}
          language={language}
        />
      )}
    </div>
  );
}
