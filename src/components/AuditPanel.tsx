import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Play, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Sparkles,
  Lock,
  Database,
  HardDrive
} from 'lucide-react';
import { api, SystemStatus, AuditResult } from '../api.js';

interface AuditPanelProps {
  status: SystemStatus | null;
  onRefreshStatus: () => void;
}

export const AuditPanel: React.FC<AuditPanelProps> = ({ status, onRefreshStatus }) => {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await api.runAudit();
      setAuditResult(res);
      onRefreshStatus();
    } catch (err: any) {
      setError(err.message || 'Failed to run security audit test suite.');
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    runAudit();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EFF4F0] text-[#354D43] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-[#252B3A]">System Diagnostics & Security Audit</h2>
          </div>
          <p className="text-xs text-[#737B89] mt-1">
            Automated verification of multi-tenant authorization, PDF stream isolation, and configuration status.
          </p>
        </div>

        <button
          onClick={runAudit}
          disabled={running}
          className="px-4 py-2 bg-[#354D43] hover:bg-[#2A3E36] disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          {running ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{running ? 'Running Security Tests...' : 'Run Real-Time Audit'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Configuration Status Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gemini AI Status */}
        <div className="p-5 bg-white rounded-2xl border border-[#E8E6E0] shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#252B3A] flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#EFF4F0] flex items-center justify-center text-[#354D43]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>AI Engine</span>
            </span>
            {status?.geminiConfigured ? (
              <span className="text-[10px] font-semibold bg-[#EFF4F0] text-[#354D43] px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live
              </span>
            ) : (
              <span className="text-[10px] font-semibold bg-[#F8F7F3] text-[#737B89] px-2 py-0.5 rounded-md border border-[#E8E6E0]">
                Local Heuristic
              </span>
            )}
          </div>
          <p className="text-xs text-[#737B89] leading-relaxed">
            {status?.geminiConfigured
              ? 'GEMINI_API_KEY detected in environment. Gemini 2.5 Flash active for deep reasoning and document Q&A.'
              : 'GEMINI_API_KEY is not set. Operating in Local Academic Grounding mode with deterministic synthesis.'}
          </p>
          <div className="text-[11px] font-mono text-[#737B89] pt-2 border-t border-[#E8E6E0]/60">
            {status?.geminiConfigured ? 'Google GenAI Grounding' : 'Graceful Local Fallback'}
          </div>
        </div>

        {/* Database Persistence */}
        <div className="p-5 bg-white rounded-2xl border border-[#E8E6E0] shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#252B3A] flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#F4F1F9] flex items-center justify-center text-[#786EA0]">
                <Database className="w-3.5 h-3.5" />
              </div>
              <span>Database Store</span>
            </span>
            <span className="text-[10px] font-semibold bg-[#EFF4F0] text-[#354D43] px-2 py-0.5 rounded-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Active
            </span>
          </div>
          <p className="text-xs text-[#737B89] leading-relaxed">
            Records are persisted to atomic transactional storage with multi-tenant row isolation.
          </p>
          <div className="text-[11px] font-mono text-[#252B3A] pt-2 border-t border-[#E8E6E0]/60 tabular-nums">
            {status?.database.papersCount ?? 0} papers · {status?.database.projectsCount ?? 0} projects · {status?.database.profilesCount ?? 0} users
          </div>
        </div>

        {/* Private Storage */}
        <div className="p-5 bg-white rounded-2xl border border-[#E8E6E0] shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#252B3A] flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#EDF4F9] flex items-center justify-center text-[#4F738E]">
                <HardDrive className="w-3.5 h-3.5" />
              </div>
              <span>Private File Storage</span>
            </span>
            <span className="text-[10px] font-semibold bg-[#EFF4F0] text-[#354D43] px-2 py-0.5 rounded-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Secured
            </span>
          </div>
          <p className="text-xs text-[#737B89] leading-relaxed">
            Tenant-isolated directories with magic byte (%PDF-) header verification and path traversal barriers.
          </p>
          <div className="text-[11px] font-mono text-[#737B89] pt-2 border-t border-[#E8E6E0]/60 truncate">
            HMAC token signed retrieval
          </div>
        </div>
      </div>

      {/* Security Test Suite Results */}
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E8E6E0] bg-[#F8F7F3] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#354D43]" />
              <h3 className="text-sm font-bold text-[#252B3A]">Multi-Tenant Isolation Test Suite</h3>
            </div>
            <p className="text-xs text-[#737B89] mt-0.5">
              Simulates concurrent User A and User B transactions to verify authorization barriers.
            </p>
          </div>

          {auditResult && (
            <span className={`text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 ${
              auditResult.allPassed 
                ? 'bg-[#EFF4F0] text-[#354D43] border border-[#8FA998]/40' 
                : 'bg-rose-100 text-rose-800 border border-rose-200'
            }`}>
              {auditResult.allPassed ? <CheckCircle2 className="w-4 h-4 text-[#354D43]" /> : <XCircle className="w-4 h-4" />}
              <span>{auditResult.allPassed ? 'All Security Checks Passing (5/5)' : 'Vulnerabilities Flagged'}</span>
            </span>
          )}
        </div>

        {/* Tests List */}
        <div className="divide-y divide-[#E8E6E0]/60">
          {auditResult?.results.map((test) => (
            <div key={test.testId} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-[#F8F7F3]/60 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-[#737B89] bg-[#F8F7F3] px-2 py-0.5 rounded-md border border-[#E8E6E0]">
                    {test.testId}
                  </span>
                  <h4 className="text-xs font-bold text-[#252B3A]">{test.title}</h4>
                </div>
                <p className="text-xs text-[#737B89] leading-relaxed max-w-3xl">{test.details}</p>
              </div>

              <div className="shrink-0 pt-0.5">
                {test.passed ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#EFF4F0] text-[#354D43] border border-[#8FA998]/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    <XCircle className="w-3.5 h-3.5" /> FAIL
                  </span>
                )}
              </div>
            </div>
          ))}

          {!auditResult && !running && (
            <div className="p-8 text-center text-xs text-[#737B89]">
              Click "Run Real-Time Audit" to execute the test suite.
            </div>
          )}

          {running && (
            <div className="p-8 text-center text-xs text-[#737B89] flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#354D43]" />
              <span>Simulating multi-tenant authorization attack vectors...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
