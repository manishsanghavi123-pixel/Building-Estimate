import React from 'react';
import { ProjectConfig, BOQItem, StageMilestone, MaterialRequirement, Language } from '../types/estimation';
import { CATEGORY_LABELS, PROJECT_TYPE_LABELS, QUALITY_TIER_LABELS } from '../data/translations';
import { Printer, Download, ArrowLeft } from 'lucide-react';

interface PrintQuotationProps {
  config: ProjectConfig;
  items: BOQItem[];
  milestones: StageMilestone[];
  materials: MaterialRequirement[];
  totalCost: number;
  subtotal: number;
  contractorMarginAmount: number;
  contingencyAmount: number;
  gstAmount: number;
  language: Language;
  onBackToApp: () => void;
}

export const PrintQuotation: React.FC<PrintQuotationProps> = ({
  config,
  items,
  milestones,
  materials,
  totalCost,
  subtotal,
  contractorMarginAmount,
  contingencyAmount,
  gstAmount,
  language,
  onBackToApp,
}) => {
  const isGu = language === 'gu';
  const currentDate = new Date().toLocaleDateString(isGu ? 'gu-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const quoteNo = `NC-${config.type.substring(0, 3).toUpperCase()}-${config.id.substring(0, 6).toUpperCase() || '2026'}`;
  const costPerSqFt = Math.round(totalCost / Math.max(1, config.builtUpAreaSqFt));

  // Category summary for clean printable table
  const activeItems = items.filter((i) => i.isEnabled);
  const categorySummary = (Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[])
    .filter((cat) => cat !== 'contractor_overhead')
    .map((cat) => {
      const catItems = activeItems.filter((i) => i.category === cat);
      const amount = catItems.reduce((sum, i) => sum + i.amount, 0);
      return {
        key: cat,
        label: CATEGORY_LABELS[cat][language],
        count: catItems.length,
        amount,
        pct: subtotal > 0 ? ((amount / subtotal) * 100).toFixed(1) : '0',
      };
    })
    .filter((c) => c.amount > 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden in Print) */}
      <div className="no-print bg-white border border-neutral-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <button
          onClick={onBackToApp}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isGu ? 'પાછા જાઓ' : 'Back to Dashboard'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>{isGu ? 'પ્રિન્ટ કરો / PDF તરીકે સેવ કરો' : 'Print / Save as PDF'}</span>
          </button>
        </div>
      </div>

      {/* Formal A4 Document Sheet */}
      <div className="bg-white border border-neutral-300 rounded-2xl p-8 md:p-12 shadow-sm max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0 text-neutral-900">
        {/* Letterhead */}
        <div className="border-b-2 border-neutral-900 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-700 font-mono">
                {isGu ? 'સિવિલ એન્જિનિયરિંગ અને બાંધકામ અંદાજ' : 'Civil Engineering & Estimation'}
              </span>
              <h1 className="text-2xl font-black tracking-tight text-neutral-900 mt-0.5">
                NIRMAN COST & ESTIMATES
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Gujarat Standard Construction Cost Estimation & BOQ Management
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-xs">
              <div>
                <span className="text-neutral-500">Ref: </span>
                <strong className="text-neutral-900">{quoteNo}</strong>
              </div>
              <div>
                <span className="text-neutral-500">Date: </span>
                <span>{currentDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Client & Project Profile Box */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              {isGu ? 'ગ્રાહક અને સાઇટ વિગત' : 'Client & Site Details'}
            </span>
            <div className="text-sm font-bold text-neutral-900 mt-1">
              {config.name || (isGu ? 'શ્રીમાન ગ્રાહક' : 'Valued Client')}
            </div>
            <div className="text-neutral-600 mt-0.5">
              {config.location || (isGu ? 'અમદાવાદ, ગુજરાત' : 'Gujarat, India')}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-right">
            <div>
              <span className="text-[11px] text-neutral-500 block">{isGu ? 'પ્રોજેક્ટ પ્રકાર:' : 'Archetype:'}</span>
              <span className="font-bold text-neutral-900">{PROJECT_TYPE_LABELS[config.type][language]}</span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 block">{isGu ? 'ગુણવત્તા:' : 'Quality:'}</span>
              <span className="font-bold text-neutral-900">{QUALITY_TIER_LABELS[config.quality][language]}</span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 block">{isGu ? 'બાંધકામ એરિયા:' : 'Built-Up Area:'}</span>
              <span className="font-bold font-mono text-neutral-900">{config.builtUpAreaSqFt} sq.ft</span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 block">{isGu ? 'પ્લોટ સાઇઝ:' : 'Plot Size:'}</span>
              <span className="font-bold font-mono text-neutral-900">{config.plotAreaVaar} {isGu ? 'વાર' : 'Vaar'}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Phase Summary */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 border-b border-neutral-200 pb-1">
            {isGu ? '૧. તબક્કાવાર ખર્ચ પત્રક (Category-wise BOQ Summary)' : '1. Category-wise Cost Summary'}
          </h2>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-300 font-bold text-neutral-600">
                <th className="py-2 pr-2 w-8">#</th>
                <th className="py-2 px-2">{isGu ? 'કામનો તબક્કો / વર્ણન' : 'Phase / Work Scope'}</th>
                <th className="py-2 px-2 text-right w-24">{isGu ? 'આઇટમ્સ' : 'Items'}</th>
                <th className="py-2 px-2 text-right w-20">%</th>
                <th className="py-2 pl-2 text-right w-36">{isGu ? 'રકમ (₹)' : 'Amount (₹)'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {categorySummary.map((cat, idx) => (
                <tr key={cat.key}>
                  <td className="py-2 pr-2 text-neutral-400 font-mono">{idx + 1}</td>
                  <td className="py-2 px-2 font-medium text-neutral-800">{cat.label}</td>
                  <td className="py-2 px-2 text-right text-neutral-500 font-mono">{cat.count}</td>
                  <td className="py-2 px-2 text-right text-neutral-500 font-mono">{cat.pct}%</td>
                  <td className="py-2 pl-2 text-right font-bold font-mono text-neutral-900 tabular-nums">
                    ₹{cat.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Subtotal and Grand Total Breakdown */}
          <div className="mt-4 border-t-2 border-neutral-800 pt-3 text-xs space-y-1.5">
            <div className="flex justify-between text-neutral-600">
              <span>{isGu ? 'સામગ્રી અને મજૂરી ખર્ચ સબટોટલ (Works Subtotal):' : 'Works Subtotal:'}</span>
              <span className="font-mono font-bold text-neutral-900 tabular-nums">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>{isGu ? `કોન્ટ્રાક્ટર સુપરવિઝન માર્જિન (${config.contractorMarginPct}%):` : `Contractor Margin (${config.contractorMarginPct}%):`}</span>
              <span className="font-mono font-semibold text-neutral-900 tabular-nums">
                +₹{contractorMarginAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>{isGu ? `આકસ્મિક ખર્ચ બફર (${config.contingencyPct}%):` : `Contingency Buffer (${config.contingencyPct}%):`}</span>
              <span className="font-mono font-semibold text-neutral-900 tabular-nums">
                +₹{contingencyAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>{isGu ? `GST કરવેરા (${config.gstPct}%):` : `GST Taxes (${config.gstPct}%):`}</span>
              <span className="font-mono font-semibold text-neutral-900 tabular-nums">
                +₹{gstAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-neutral-300 font-bold text-sm text-neutral-900">
              <span>{isGu ? 'કુલ ગ્રાન્ડ ટોટલ અંદાજ (Final Total):' : 'Grand Total Estimated Cost:'}</span>
              <span className="font-black font-mono text-base tabular-nums">
                ₹{totalCost.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right text-[11px] text-neutral-500 font-mono">
              (₹{costPerSqFt} / sq.ft with material)
            </div>
          </div>
        </div>

        {/* Section 2: Key Materials Estimated */}
        <div className="mb-6 print-break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 border-b border-neutral-200 pb-1">
            {isGu ? '૨. મુખ્ય મટીરીયલ જથ્થાની ગણતરી (Material Estimation)' : '2. Key Material Quantities'}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {materials.slice(0, 4).map((m) => (
              <div key={m.id} className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                <span className="text-[10px] text-neutral-500 block truncate">{m.name[language]}</span>
                <span className="text-sm font-bold font-mono text-neutral-900 block mt-0.5 tabular-nums">
                  {typeof m.quantity === 'number' ? m.quantity.toLocaleString('en-IN') : m.quantity}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">{m.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Payment Milestones */}
        <div className="mb-6 print-break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 border-b border-neutral-200 pb-1">
            {isGu ? '૩. તબક્કાવાર ચૂકવણીનું શિડ્યુલ (Stage-wise Payment Schedule)' : '3. Payment Schedule'}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {milestones.map((ms) => (
              <div key={ms.stageNumber} className="p-2 bg-neutral-50 border border-neutral-200 rounded-lg">
                <div className="flex justify-between font-bold text-neutral-800">
                  <span>Stage {ms.stageNumber}</span>
                  <span className="font-mono">{ms.percentage}%</span>
                </div>
                <div className="text-[11px] text-neutral-600 truncate mt-0.5">{ms.title[language]}</div>
                <div className="text-xs font-bold font-mono text-neutral-900 mt-1 tabular-nums">
                  ₹{ms.amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Standard Terms & Signatures */}
        <div className="print-break-inside-avoid border-t border-neutral-300 pt-4">
          <div className="text-[10px] text-neutral-500 space-y-1 mb-8">
            <p>
              * {isGu ? 'સાઇટ પર પાણી અને વીજળીની વ્યવસ્થા ક્લાયન્ટ દ્વારા ઉપલબ્ધ કરાવવાની રહેશે.' : 'Construction water and electricity connection will be provided at site by the client.'}
            </p>
            <p>
              * {isGu ? 'આ અંદાજ પત્રક વર્તમાન બજાર ભાવ પર આધારિત છે. સામગ્રીના અસામાન્ય ભાવ વધારા માટે એસ્કેલેશન ક્લોઝ લાગુ થશે.' : 'Estimate is calculated based on current market rates. Unforeseen material escalation clause applies.'}
            </p>
          </div>

          <div className="flex justify-between items-end pt-8">
            <div className="text-center">
              <div className="w-40 border-b border-neutral-400 mb-1" />
              <span className="text-[11px] text-neutral-600 font-semibold">
                {isGu ? 'ક્લાયન્ટ સહી' : 'Client Signature'}
              </span>
            </div>

            <div className="text-center">
              <div className="w-40 border-b border-neutral-400 mb-1" />
              <span className="text-[11px] text-neutral-600 font-semibold">
                {isGu ? 'અધિકૃત કોન્ટ્રાક્ટર / એન્જિનિયર' : 'Authorized Signatory'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
