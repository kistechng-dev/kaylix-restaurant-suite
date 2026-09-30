import React from 'react';
import { X, Cpu, HardDrive, Monitor, Wifi, ShieldCheck, CheckCircle2, Download } from 'lucide-react';
import { StationApp } from '../types';

interface SystemRequirementsModalProps {
  app: StationApp | null;
  onClose: () => void;
  onDownload: (app: StationApp) => void;
}

export const SystemRequirementsModal: React.FC<SystemRequirementsModalProps> = ({
  app,
  onClose,
  onDownload,
}) => {
  if (!app) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.accentColor} flex items-center justify-center text-white shadow-lg`}>
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">{app.name}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {app.version}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{app.tagline}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Release & Build specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Release Channel</div>
              <div className="text-sm font-semibold text-emerald-400 mt-1">Production Stable</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Build Stamp</div>
              <div className="text-sm font-semibold text-slate-200 mt-1">{app.buildNumber}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Package Size</div>
              <div className="text-sm font-semibold text-slate-200 mt-1">{app.fileSize}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Updated Date</div>
              <div className="text-sm font-semibold text-slate-200 mt-1">{app.releaseDate}</div>
            </div>
          </div>

          {/* Detailed Hardware Spec */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              Minimum & Recommended Hardware Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="font-semibold text-slate-300 flex items-center gap-2">
                  <Monitor className="w-3.5 h-3.5 text-indigo-400" /> Operating System
                </div>
                <div className="text-slate-400 mt-1.5 leading-relaxed">{app.systemRequirements.os}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="font-semibold text-slate-300 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" /> CPU Processor
                </div>
                <div className="text-slate-400 mt-1.5 leading-relaxed">{app.systemRequirements.processor}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="font-semibold text-slate-300 flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-teal-400" /> Memory (RAM) & Storage
                </div>
                <div className="text-slate-400 mt-1.5 leading-relaxed">
                  RAM: {app.systemRequirements.ram} <br />
                  Disk: {app.systemRequirements.storage}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="font-semibold text-slate-300 flex items-center gap-2">
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" /> Network & Topology
                </div>
                <div className="text-slate-400 mt-1.5 leading-relaxed">{app.systemRequirements.network}</div>
              </div>
            </div>

            <div className="mt-3.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <div className="font-semibold text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" /> Supported Peripherals & POS Hardware
              </div>
              <div className="text-slate-400 mt-1.5 leading-relaxed">{app.systemRequirements.peripherals}</div>
            </div>
          </div>

          {/* Key Feature highlights */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-2.5">
              Included Production Modules
            </h4>
            <div className="space-y-2">
              {app.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Target Package: <span className="font-mono text-slate-200">{app.fileName}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onDownload(app);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-orange-950/40"
            >
              <Download className="w-3.5 h-3.5" /> Download Installer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
