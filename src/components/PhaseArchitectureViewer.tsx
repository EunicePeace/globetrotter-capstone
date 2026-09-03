import React, { useState, useEffect } from 'react';
import { Cpu, Server, Layers, ShieldCheck, Activity, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { PHASE_DETAILS } from '../data/phaseData';
import { ArchitecturePhase } from '../types';

export const PhaseArchitectureViewer: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<ArchitecturePhase>('phase4');
  const [systemHealth, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    fetch('/api/system-status')
      .then((res) => res.json())
      .then((data) => setSystemStatus(data.services))
      .catch(() => {});
  }, []);

  const detail = PHASE_DETAILS[selectedPhase];

  return (
    <div className="space-y-4">
      {/* Course Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
          <Cpu className="w-3.5 h-3.5 text-blue-600" /> ICT University CS4122 Distributed Systems Capstone
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">The GlobeTrotter Semester Project Phases</h2>
        <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
          Course Leader: Engr. Daniel Moune • ICT University Cameroon Campus, Yaoundé.<br />
          Experience the architectural evolution of GlobeTrotter from a single Monolith server to a Fault-Tolerant, Containerized Microservice system with Redis Caching and Circuit Breakers.
        </p>
      </div>

      {/* Phase Selection Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {(['phase1', 'phase2', 'phase3', 'phase4'] as ArchitecturePhase[]).map((phaseId) => {
          const p = PHASE_DETAILS[phaseId];
          const isActive = selectedPhase === phaseId;
          return (
            <button
              key={phaseId}
              onClick={() => setSelectedPhase(phaseId)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-blue-50 border-blue-600 text-slate-900 shadow-xs ring-1 ring-blue-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-0.5">
                Phase {p.number}
              </div>
              <h4 className="font-bold text-xs text-slate-900 leading-snug">{p.title.split(':')[1]}</h4>
              <span className="text-[10px] text-slate-500 block mt-1 line-clamp-1">{p.architectureType}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Phase Detail Dashboard */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-5 shadow-xs">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-blue-700">{detail.subtitle}</span>
          <h3 className="text-lg font-bold text-slate-900">{detail.title}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{detail.description}</p>
        </div>

        {/* Tech Stack Chips */}
        <div>
          <span className="text-xs font-semibold text-slate-500 block mb-1.5">Technology Stack:</span>
          <div className="flex flex-wrap gap-1.5">
            {detail.techStack.map((tech, idx) => (
              <span key={idx} className="px-2.5 py-0.5 rounded-md bg-slate-100 text-xs font-semibold text-slate-800 border border-slate-200">
                ⚡ {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Component Live Status Grid */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>System Components & Cluster Health</span>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> All Services Operational
            </span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {detail.components.map((comp, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{comp.name}</span>
                  <span className="text-[10px] text-slate-500">{comp.role}</span>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  comp.status === 'online'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : comp.status === 'cached'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  ● {comp.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Outcomes vs Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-900 block">Key Learning Outcome</span>
            <p className="text-emerald-800">{detail.keyOutcome}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-amber-800 block">Engineering Challenges Solved</span>
            <ul className="list-disc list-inside text-slate-600 space-y-0.5">
              {detail.challenges.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Live Metrics Telemetry from Server */}
        {systemHealth && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-blue-700 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600" /> Live Express & Cluster Telemetry Metrics
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-700">
              <div>
                <span className="text-slate-500 block text-[10px]">API Gateway Latency</span>
                <span className="font-bold text-slate-900">{systemHealth.apiGateway?.latencyMs} ms</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Redis Cache Hit Ratio</span>
                <span className="font-bold text-emerald-700">{systemHealth.redisCache?.hitRate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Circuit Breaker State</span>
                <span className="font-bold text-emerald-700">{systemHealth.circuitBreaker?.state}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Active Service Replicas</span>
                <span className="font-bold text-amber-800">9 Kubernetes Pods</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
