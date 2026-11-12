import React, { useState } from 'react';
import { ProjectConfig, Language } from '../types/estimation';
import { PROJECT_TYPE_LABELS, QUALITY_TIER_LABELS } from '../data/translations';
import { X, FolderOpen, Save, Trash2, Copy, Download, Upload } from 'lucide-react';

interface SavedProjectsModalProps {
  currentConfig: ProjectConfig;
  savedEstimates: ProjectConfig[];
  onLoadEstimate: (config: ProjectConfig) => void;
  onSaveCurrentAsNew: (name: string) => void;
  onDeleteEstimate: (id: string) => void;
  onClose: () => void;
  language: Language;
}

export const SavedProjectsModal: React.FC<SavedProjectsModalProps> = ({
  currentConfig,
  savedEstimates,
  onLoadEstimate,
  onSaveCurrentAsNew,
  onDeleteEstimate,
  onClose,
  language,
}) => {
  const isGu = language === 'gu';
  const [newSaveName, setNewSaveName] = useState(currentConfig.name || '');

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSaveName.trim()) return;
    onSaveCurrentAsNew(newSaveName.trim());
    setNewSaveName('');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedEstimates, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `NirmanCost_All_Estimates_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-neutral-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-amber-600" />
              <span>{isGu ? 'સેવ કરેલા બાંધકામ અંદાજો (Saved Estimates)' : 'Saved Projects & Estimates'}</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isGu
                ? 'તમારા અગાઉના અંદાજો લોડ કરો અથવા વર્તમાન અંદાજને સેવ કરો.'
                : 'Load past estimates or save the active project state.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Save Current Estimate Form */}
        <div className="p-4 bg-neutral-100/60 border-b border-neutral-200">
          <form onSubmit={handleSaveSubmit} className="flex gap-2">
            <input
              type="text"
              required
              value={newSaveName}
              onChange={(e) => setNewSaveName(e.target.value)}
              placeholder={isGu ? 'આ અંદાજનું નામ આપો (ઉદા. શીલજ બંગલો - મનીષભાઈ)' : 'Name this estimate (e.g. Shela Villa)'}
              className="flex-1 bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isGu ? 'અંદાજ સેવ કરો' : 'Save Active'}</span>
            </button>
          </form>
        </div>

        {/* Saved List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {savedEstimates.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-xs">
              {isGu ? 'હજુ કોઈ સેવ કરેલા અંદાજ નથી.' : 'No saved estimates yet.'}
            </div>
          ) : (
            savedEstimates.map((est) => (
              <div
                key={est.id}
                className="p-4 border border-neutral-200 rounded-xl bg-white hover:border-neutral-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs text-neutral-900">{est.name}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                      {PROJECT_TYPE_LABELS[est.type][language]}
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-3">
                    <span>{QUALITY_TIER_LABELS[est.quality][language]}</span>
                    <span>·</span>
                    <span className="font-mono">{est.builtUpAreaSqFt} sq.ft</span>
                    <span>·</span>
                    <span>{est.location || 'Gujarat'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadEstimate(est);
                      onClose();
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
                  >
                    {isGu ? 'ખોલો (Load)' : 'Load'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteEstimate(est.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-100"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with JSON backup */}
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isGu ? 'બધા અંદાજ JSON માં બેકઅપ લો' : 'Export JSON Backup'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-200/60 rounded-lg transition-colors"
          >
            {isGu ? 'બંધ કરો' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
