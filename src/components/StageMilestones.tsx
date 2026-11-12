import React, { useState } from 'react';
import { StageMilestone, Language } from '../types/estimation';
import { CheckCircle2, Clock, Calendar, CheckSquare, Square } from 'lucide-react';

interface StageMilestonesProps {
  milestones: StageMilestone[];
  totalCost: number;
  language: Language;
}

export const StageMilestones: React.FC<StageMilestonesProps> = ({
  milestones,
  totalCost,
  language,
}) => {
  const isGu = language === 'gu';
  const [completedStages, setCompletedStages] = useState<Record<number, boolean>>({ 1: true });

  const toggleStage = (stageNum: number) => {
    setCompletedStages((prev) => ({ ...prev, [stageNum]: !prev[stageNum] }));
  };

  const totalPaid = milestones
    .filter((m) => completedStages[m.stageNumber])
    .reduce((sum, m) => sum + m.amount, 0);

  const totalPaidPct = totalCost > 0 ? Math.round((totalPaid / totalCost) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <span>{isGu ? 'તબક્કાવાર ચૂકવણીનું શિડ્યુલ (Payment Milestones)' : 'Construction Payment Schedule'}</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              {isGu
                ? 'કામની પ્રગતિ મુજબ કોન્ટ્રાક્ટરને ચૂકવવા પાત્ર રકમ અને નાણાકીય આયોજન.'
                : 'Stage-wise payment disbursements linked directly to physical site completion.'}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-neutral-50 border border-neutral-200 rounded-lg p-3 shrink-0">
            <div>
              <span className="text-[10px] font-semibold text-neutral-500 block">
                {isGu ? 'ચૂકવેલ / પ્રગતિ' : 'Disbursed / Progress'}
              </span>
              <span className="text-sm font-bold font-mono text-neutral-900 tabular-nums">
                ₹{totalPaid.toLocaleString('en-IN')}{' '}
                <span className="text-xs text-neutral-500">({totalPaidPct}%)</span>
              </span>
            </div>
            <div className="w-24 bg-neutral-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${totalPaidPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stage Cards */}
      <div className="space-y-3">
        {milestones.map((m) => {
          const isDone = !!completedStages[m.stageNumber];

          return (
            <div
              key={m.stageNumber}
              className={`border rounded-xl p-4 transition-all ${
                isDone
                  ? 'bg-white border-neutral-300 shadow-xs'
                  : 'bg-neutral-50/50 border-neutral-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Stage Number & Details */}
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleStage(m.stageNumber)}
                    className="mt-0.5 text-neutral-600 hover:text-neutral-900"
                  >
                    {isDone ? (
                      <CheckSquare className="w-5 h-5 text-amber-600" />
                    ) : (
                      <Square className="w-5 h-5 text-neutral-400" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                        {isGu ? `તબક્કો ${m.stageNumber}` : `Stage ${m.stageNumber}`}
                      </span>
                      <h3 className="text-sm font-bold text-neutral-900">
                        {m.title[language]}
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed max-w-2xl">
                      {m.description[language]}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span>~{m.durationWeeks} {isGu ? 'અઠવાડિયા' : 'Weeks'}</span>
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-neutral-700">
                        {m.percentage}% {isGu ? 'કુલ રકમના' : 'of Total'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount */}
                <div className="text-left md:text-right shrink-0 pl-8 md:pl-0">
                  <span className="text-[11px] font-semibold text-neutral-400 block">
                    {isGu ? 'ચૂકવવા પાત્ર રકમ' : 'Disbursement Amount'}
                  </span>
                  <span className="text-lg font-black font-mono text-neutral-900 tabular-nums">
                    ₹{m.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
