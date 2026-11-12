import React, { useState, useMemo } from 'react';
import { BOQItem, BOQCategory, Language, ProjectConfig } from '../types/estimation';
import { CATEGORY_LABELS } from '../data/translations';
import {
  Search,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Download,
  RotateCcw,
  CheckSquare,
  Square,
  FileSpreadsheet,
} from 'lucide-react';

interface DetailedBOQProps {
  items: BOQItem[];
  config: ProjectConfig;
  onUpdateItem: (id: string, updates: Partial<BOQItem>) => void;
  onAddItem: (newItem: Omit<BOQItem, 'id'>) => void;
  onDeleteItem: (id: string) => void;
  onResetItems: () => void;
  onUpdateConfig: (updates: Partial<ProjectConfig>) => void;
  language: Language;
}

export const DetailedBOQ: React.FC<DetailedBOQProps> = ({
  items,
  config,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  onResetItems,
  onUpdateConfig,
  language,
}) => {
  const isGu = language === 'gu';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New item modal state
  const [newItemName, setNewItemName] = useState('');
  const [newItemSpec, setNewItemSpec] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<BOQCategory>('special_amenities');
  const [newItemUnit, setNewItemUnit] = useState('sq.ft');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemRate, setNewItemRate] = useState(100);

  // Toggle collapse state for a category
  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Filter items by category & search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.en.toLowerCase().includes(q) ||
        item.name.gu.toLowerCase().includes(q) ||
        item.specification.en.toLowerCase().includes(q) ||
        item.specification.gu.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchTerm]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Partial<Record<BOQCategory, BOQItem[]>> = {};
    for (const item of filteredItems) {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category]!.push(item);
    }
    return groups;
  }, [filteredItems]);

  // Calculations
  const activeItems = items.filter((i) => i.isEnabled);
  const subtotal = activeItems.reduce((sum, item) => sum + item.amount, 0);
  const contractorMargin = Math.round((subtotal * config.contractorMarginPct) / 100);
  const contingency = Math.round((subtotal * config.contingencyPct) / 100);
  const taxableBase = subtotal + contractorMargin + contingency;
  const gstAmount = Math.round((taxableBase * config.gstPct) / 100);
  const grandTotal = taxableBase + gstAmount;
  const costPerSqFt = Math.round(grandTotal / Math.max(1, config.builtUpAreaSqFt));

  // Export BOQ as CSV file
  const handleExportCSV = () => {
    const headers = ['Category', 'Item Name (EN)', 'Item Name (GU)', 'Quantity', 'Unit', 'Rate (INR)', 'Amount (INR)', 'Included'];
    const rows = items.map((i) => [
      `"${CATEGORY_LABELS[i.category].en}"`,
      `"${i.name.en.replace(/"/g, '""')}"`,
      `"${i.name.gu.replace(/"/g, '""')}"`,
      i.quantity,
      `"${i.unit}"`,
      i.rate,
      i.amount,
      i.isEnabled ? 'Yes' : 'No',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NirmanCost_BOQ_${config.type}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddItem({
      category: newItemCategory,
      name: { en: newItemName, gu: newItemName },
      specification: { en: newItemSpec || 'Custom specification', gu: newItemSpec || 'કસ્ટમ વિગત' },
      unit: newItemUnit,
      quantity: Number(newItemQty) || 1,
      rate: Number(newItemRate) || 0,
      amount: Math.round((Number(newItemQty) || 1) * (Number(newItemRate) || 0)),
      isEnabled: true,
      isOptional: true,
    });

    setNewItemName('');
    setNewItemSpec('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Controls Bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isGu ? 'ખર્ચ, આઇટમ અથવા મટીરીયલ શોધો...' : 'Search items, specifications, materials...'}
              className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full lg:w-72">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">{isGu ? 'તમામ કેટેગરી (All Categories)' : 'All Categories'}</option>
              {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => (
                <option key={catKey} value={catKey}>
                  {label[language]}
                </option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isGu ? 'નવો ખર્ચ ઉમેરો' : 'Add Item'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200 whitespace-nowrap"
              title="Download CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>

            <button
              onClick={onResetItems}
              className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200"
              title={isGu ? 'મૂળ સેટિંગ્સ પુનઃસ્થાપિત કરો' : 'Reset BOQ'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Itemized Table Groups */}
      <div className="space-y-4">
        {(Object.keys(CATEGORY_LABELS) as BOQCategory[]).map((catKey) => {
          const categoryItems = groupedItems[catKey] || [];
          if (categoryItems.length === 0) return null;

          const categorySubtotal = categoryItems
            .filter((i) => i.isEnabled)
            .reduce((sum, i) => sum + i.amount, 0);
          const isCollapsed = collapsedCategories[catKey];

          return (
            <div
              key={catKey}
              className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs"
            >
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(catKey)}
                className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50/80 hover:bg-neutral-100/70 border-b border-neutral-200 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                  <div>
                    <h3 className="text-xs font-bold text-neutral-900">
                      {CATEGORY_LABELS[catKey][language]}
                    </h3>
                    <span className="text-[11px] text-neutral-500">
                      {categoryItems.length} {isGu ? 'આઇટમ્સ' : 'items'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-neutral-900 tabular-nums">
                    ₹{categorySubtotal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-neutral-500 block">
                    {subtotal > 0 ? ((categorySubtotal / subtotal) * 100).toFixed(1) : 0}% of subtotal
                  </span>
                </div>
              </button>

              {/* Category Table */}
              {!isCollapsed && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-100 text-[11px] font-semibold text-neutral-500 bg-neutral-50/30">
                        <th className="py-2 px-3 w-10 text-center">Inc</th>
                        <th className="py-2 px-3">{isGu ? 'વિગત અને સ્પેસિફિકેશન' : 'Item & Specifications'}</th>
                        <th className="py-2 px-3 w-28 text-right">{isGu ? 'જથ્થો (Qty)' : 'Quantity'}</th>
                        <th className="py-2 px-3 w-24 text-left">{isGu ? 'એકમ (Unit)' : 'Unit'}</th>
                        <th className="py-2 px-3 w-32 text-right">{isGu ? 'દર (Rate ₹)' : 'Rate (₹)'}</th>
                        <th className="py-2 px-4 w-36 text-right">{isGu ? 'રકમ (Amount ₹)' : 'Amount (₹)'}</th>
                        <th className="py-2 px-2 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-xs">
                      {categoryItems.map((item) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-neutral-50/60 transition-colors ${
                            !item.isEnabled ? 'opacity-40 bg-neutral-50/30' : ''
                          }`}
                        >
                          {/* Enable Checkbox */}
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => onUpdateItem(item.id, { isEnabled: !item.isEnabled })}
                              className="text-neutral-600 hover:text-neutral-900"
                            >
                              {item.isEnabled ? (
                                <CheckSquare className="w-4 h-4 text-amber-600" />
                              ) : (
                                <Square className="w-4 h-4 text-neutral-400" />
                              )}
                            </button>
                          </td>

                          {/* Item Title & Specs */}
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-neutral-900 leading-snug">
                              {item.name[language]}
                            </div>
                            <div className="text-[11px] text-neutral-500 mt-0.5 leading-tight">
                              {item.specification[language]}
                            </div>
                          </td>

                          {/* Quantity Input */}
                          <td className="py-2.5 px-3 text-right">
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQty = parseFloat(e.target.value) || 0;
                                onUpdateItem(item.id, {
                                  quantity: newQty,
                                  amount: Math.round(newQty * item.rate),
                                });
                              }}
                              className="w-20 px-2 py-1 text-right bg-white border border-neutral-300 rounded text-xs font-mono tabular-nums font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </td>

                          {/* Unit */}
                          <td className="py-2.5 px-3 text-left">
                            <span className="text-[11px] font-medium text-neutral-600 font-mono">
                              {item.unit}
                            </span>
                          </td>

                          {/* Unit Rate Input */}
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-[11px] text-neutral-400">₹</span>
                              <input
                                type="number"
                                min="0"
                                step="any"
                                value={item.rate}
                                onChange={(e) => {
                                  const newRate = parseFloat(e.target.value) || 0;
                                  onUpdateItem(item.id, {
                                    rate: newRate,
                                    amount: Math.round(item.quantity * newRate),
                                  });
                                }}
                                className="w-24 px-2 py-1 text-right bg-white border border-neutral-300 rounded text-xs font-mono tabular-nums font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                              />
                            </div>
                          </td>

                          {/* Total Amount */}
                          <td className="py-2.5 px-4 text-right">
                            <span className="font-bold font-mono text-neutral-900 tabular-nums">
                              ₹{item.amount.toLocaleString('en-IN')}
                            </span>
                          </td>

                          {/* Delete Item */}
                          <td className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => onDeleteItem(item.id)}
                              className="text-neutral-400 hover:text-red-600 p-1 rounded"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Financial Summary & Taxes Panel */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
          {isGu ? 'નાણાકીય ગણતરી અને કરવેરા સમરી' : 'Financial Summary & Contractor Margins'}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Adjustable Parameters */}
          <div className="space-y-4">
            {/* Contractor Margin */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-neutral-700">
                  {isGu ? 'કોન્ટ્રાક્ટર સુપરવિઝન / માર્જિન:' : 'Contractor Supervision / Margin:'}
                </span>
                <span className="font-bold font-mono text-neutral-900">
                  {config.contractorMarginPct}% (+₹{contractorMargin.toLocaleString('en-IN')})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={config.contractorMarginPct}
                onChange={(e) => onUpdateConfig({ contractorMarginPct: Number(e.target.value) })}
                className="w-full accent-amber-600"
              />
            </div>

            {/* Contingency Buffer */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-neutral-700">
                  {isGu ? 'આકસ્મિક ખર્ચ બફર (Contingency):' : 'Unforeseen Contingency Buffer:'}
                </span>
                <span className="font-bold font-mono text-neutral-900">
                  {config.contingencyPct}% (+₹{contingency.toLocaleString('en-IN')})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={config.contingencyPct}
                onChange={(e) => onUpdateConfig({ contingencyPct: Number(e.target.value) })}
                className="w-full accent-neutral-600"
              />
            </div>

            {/* GST Rate */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-neutral-700">
                  {isGu ? 'GST ટેક્સ ટકાવારી:' : 'Applicable GST Rate:'}
                </span>
                <span className="font-bold font-mono text-neutral-900">
                  {config.gstPct}% (+₹{gstAmount.toLocaleString('en-IN')})
                </span>
              </div>
              <div className="flex gap-2">
                {[0, 5, 12, 18].map((gstVal) => (
                  <button
                    key={gstVal}
                    type="button"
                    onClick={() => onUpdateConfig({ gstPct: gstVal })}
                    className={`flex-1 py-1 text-xs font-semibold rounded border transition-colors ${
                      config.gstPct === gstVal
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {gstVal}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Subtotals & Grand Total Card */}
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 flex flex-col justify-between">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>{isGu ? 'સામગ્રી અને મજૂરી ખર્ચ (Subtotal):' : 'Direct Works Subtotal:'}</span>
                <span className="font-mono font-semibold tabular-nums text-neutral-900">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>{isGu ? `કોન્ટ્રાક્ટર ફી (${config.contractorMarginPct}%):` : `Contractor Margin (${config.contractorMarginPct}%):`}</span>
                <span className="font-mono font-semibold tabular-nums text-neutral-900">
                  +₹{contractorMargin.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>{isGu ? `આકસ્મિક બફર (${config.contingencyPct}%):` : `Contingency Buffer (${config.contingencyPct}%):`}</span>
                <span className="font-mono font-semibold tabular-nums text-neutral-900">
                  +₹{contingency.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>{isGu ? `GST (${config.gstPct}%):` : `GST Tax (${config.gstPct}%):`}</span>
                <span className="font-mono font-semibold tabular-nums text-neutral-900">
                  +₹{gstAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-neutral-900 uppercase tracking-wide block">
                  {isGu ? 'કુલ ગ્રાન્ડ ટોટલ' : 'Grand Total Cost'}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {isGu ? 'દર ચોરસ ફૂટ:' : 'Rate per sq.ft:'}{' '}
                  <strong className="text-neutral-800 font-mono">₹{costPerSqFt}/sq.ft</strong>
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-neutral-900 tabular-nums">
                ₹{grandTotal.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 border border-neutral-200">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">
              {isGu ? 'નવો કસ્ટમ ખર્ચ ઉમેરો' : 'Add Custom Line Item'}
            </h3>

            <form onSubmit={handleCreateCustomItem} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {isGu ? 'કેટેગરી પસંદ કરો' : 'Category'}
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as BOQCategory)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-md px-3 py-1.5 text-xs text-neutral-900"
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label[language]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {isGu ? 'કામ / આઇટમનું નામ' : 'Item Name'}
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={isGu ? 'ઉદા. સોલાર પેનલ સિસ્ટમ / ગાર્ડન લોન' : 'e.g. Solar System, Landscape'}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-md px-3 py-1.5 text-xs text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {isGu ? 'સ્પેસિફિકેશન / વિગત' : 'Specification / Details'}
                </label>
                <input
                  type="text"
                  value={newItemSpec}
                  onChange={(e) => setNewItemSpec(e.target.value)}
                  placeholder={isGu ? 'કંપનીનું નામ, સાઇઝ અથવા ગ્રેડ' : 'Make, specification or brand'}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-md px-3 py-1.5 text-xs text-neutral-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {isGu ? 'જથ્થો' : 'Qty'}
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    required
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-md px-2 py-1.5 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {isGu ? 'એકમ' : 'Unit'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    placeholder="sq.ft, nos, brass"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-md px-2 py-1.5 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {isGu ? 'દર (₹)' : 'Rate (₹)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={newItemRate}
                    onChange={(e) => setNewItemRate(Number(e.target.value))}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-md px-2 py-1.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-md"
                >
                  {isGu ? 'રદ કરો' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-md shadow-xs"
                >
                  {isGu ? 'ઉમેરો' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
