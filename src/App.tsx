import React, { useState, useEffect, useMemo } from 'react';
import { 
  SecurityAssessment, 
  AuthorizedTarget, 
  AuditLogEntry, 
  SecurityFinding 
} from './types/cybermind';
import { 
  AUTHORIZED_TARGETS, 
  INITIAL_ASSESSMENTS, 
  INITIAL_AUDIT_LOGS 
} from './data/sampleAssessments';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FindingDetailModal } from './components/FindingDetailModal';
import { ImportFindingsModal } from './components/ImportFindingsModal';
import { RequestActionModal } from './components/RequestActionModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';

import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { AssessmentsView } from './views/AssessmentsView';
import { FindingsView } from './views/FindingsView';
import { AnalysisView } from './views/AnalysisView';
import { GraphView } from './views/GraphView';
import { RecommendationsView } from './views/RecommendationsView';
import { ApprovalCenterView } from './views/ApprovalCenterView';
import { ReportView } from './views/ReportView';
import { AuditLogView } from './views/AuditLogView';

import { Bot, MessageSquare } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [assessments, setAssessments] = useState<SecurityAssessment[]>(INITIAL_ASSESSMENTS);
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string>(INITIAL_ASSESSMENTS[0].id);
  const [targets, setTargets] = useState<AuthorizedTarget[]>(AUTHORIZED_TARGETS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Modals & Drawers state
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isRequestActionModalOpen, setIsRequestActionModalOpen] = useState(false);
  const [actionPrefillFinding, setActionPrefillFinding] = useState<SecurityFinding | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch initial state from server
  const loadServerData = async () => {
    try {
      const [resTargets, resAsmts, resLogs] = await Promise.all([
        fetch('/api/targets'),
        fetch('/api/assessments'),
        fetch('/api/audit-logs'),
      ]);

      if (resTargets.ok) {
        const data = await resTargets.json();
        if (Array.isArray(data) && data.length > 0) setTargets(data);
      }
      if (resAsmts.ok) {
        const data = await resAsmts.json();
        if (Array.isArray(data) && data.length > 0) {
          setAssessments(data);
          if (!data.some((a: SecurityAssessment) => a.id === currentAssessmentId)) {
            setCurrentAssessmentId(data[0].id);
          }
        }
      }
      if (resLogs.ok) {
        const data = await resLogs.json();
        if (Array.isArray(data)) setAuditLogs(data);
      }
    } catch (err) {
      console.log('Using local client state (server initializing or local mode)');
    }
  };

  useEffect(() => {
    loadServerData();
  }, []);

  // Current active assessment
  const currentAssessment = useMemo(() => {
    return (
      assessments.find(a => a.id === currentAssessmentId) ||
      assessments[0] ||
      INITIAL_ASSESSMENTS[0]
    );
  }, [assessments, currentAssessmentId]);

  // Current target
  const currentTarget = useMemo(() => {
    return (
      targets.find(t => t.targetCode === currentAssessment.targetCode) ||
      targets[0] ||
      AUTHORIZED_TARGETS[0]
    );
  }, [targets, currentAssessment.targetCode]);

  // Selected Finding object for Modal
  const selectedFinding = useMemo(() => {
    if (!selectedFindingId) return null;
    return currentAssessment.findings.find(f => f.id === selectedFindingId) || null;
  }, [currentAssessment, selectedFindingId]);

  // Pending approvals count
  const pendingApprovalsCount = useMemo(() => {
    return currentAssessment.actionRequests.filter(a => a.status === 'WAITING_FOR_APPROVAL').length;
  }, [currentAssessment]);

  // Handle AI Trigger
  const handleTriggerAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch(`/api/assessments/${currentAssessment.id}/analyze`, {
        method: 'POST',
      });
      if (res.ok) {
        const updatedAsmt = await res.json();
        setAssessments(prev => prev.map(a => (a.id === updatedAsmt.id ? updatedAsmt : a)));
      }
      // Refresh audit logs
      const logRes = await fetch('/api/audit-logs');
      if (logRes.ok) setAuditLogs(await logRes.json());
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Finding Import
  const handleImportFindings = async (findings: any[], source: string) => {
    try {
      const res = await fetch(`/api/assessments/${currentAssessment.id}/findings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ findings, source }),
      });
      if (res.ok) {
        const data = await res.json();
        setAssessments(prev => prev.map(a => (a.id === data.assessment.id ? data.assessment : a)));
        // Refresh audit logs
        const logRes = await fetch('/api/audit-logs');
        if (logRes.ok) setAuditLogs(await logRes.json());
      }
    } catch (err) {
      console.error('Import error:', err);
    }
  };

  // Handle Create Assessment
  const handleCreateAssessment = async (title: string, targetCode: string) => {
    try {
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, targetCode }),
      });
      if (res.ok) {
        const newAsmt = await res.json();
        setAssessments(prev => [newAsmt, ...prev]);
        setCurrentAssessmentId(newAsmt.id);
        const logRes = await fetch('/api/audit-logs');
        if (logRes.ok) setAuditLogs(await logRes.json());
      }
    } catch (err) {
      console.error('Create assessment error:', err);
    }
  };

  // Handle Submit Action Request
  const handleSubmitAction = async (actionData: {
    action: string;
    reason: string;
    targetCode: string;
    riskLevel: 'Low' | 'Medium' | 'High';
  }) => {
    const res = await fetch(`/api/assessments/${currentAssessment.id}/actions/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actionData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to request action');
    }

    const newAction = await res.json();
    setAssessments(prev =>
      prev.map(a => {
        if (a.id === currentAssessment.id) {
          return {
            ...a,
            actionRequests: [newAction, ...a.actionRequests],
          };
        }
        return a;
      })
    );

    const logRes = await fetch('/api/audit-logs');
    if (logRes.ok) setAuditLogs(await logRes.json());
  };

  // Handle Review Action (Approve / Reject)
  const handleReviewAction = async (actionId: string, approved: boolean, notes?: string) => {
    try {
      const res = await fetch(`/api/actions/${actionId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, reviewNotes: notes }),
      });

      if (res.ok) {
        const updatedAction = await res.json();
        setAssessments(prev =>
          prev.map(a => ({
            ...a,
            actionRequests: a.actionRequests.map(ar => (ar.id === updatedAction.id ? updatedAction : ar)),
          }))
        );

        const logRes = await fetch('/api/audit-logs');
        if (logRes.ok) setAuditLogs(await logRes.json());
      }
    } catch (err) {
      console.error('Review action error:', err);
    }
  };

  // Handle Reset to Hackathon Demo Mode
  const handleResetDemo = async () => {
    try {
      const res = await fetch('/api/demo/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setAssessments([data.assessment]);
        setCurrentAssessmentId(data.assessment.id);
        const logRes = await fetch('/api/audit-logs');
        if (logRes.ok) setAuditLogs(await logRes.json());
      }
    } catch (err) {
      setAssessments(JSON.parse(JSON.stringify(INITIAL_ASSESSMENTS)));
      setAuditLogs(JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS)));
      setCurrentAssessmentId(INITIAL_ASSESSMENTS[0].id);
    }
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        targets={targets}
        currentTarget={currentTarget}
        onSelectTarget={target => {
          // Switch to assessment matching this target or create view
          const matching = assessments.find(a => a.targetCode === target.targetCode);
          if (matching) {
            setCurrentAssessmentId(matching.id);
          } else {
            handleCreateAssessment(`${target.name} Evaluation`, target.targetCode);
          }
        }}
        assessment={currentAssessment}
        pendingApprovalsCount={pendingApprovalsCount}
        onResetDemo={handleResetDemo}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'landing' && (
          <LandingView
            onStartAssessment={() => setActiveTab('dashboard')}
            onTryDemo={handleResetDemo}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            assessment={currentAssessment}
            target={currentTarget}
            onNavigate={tab => setActiveTab(tab)}
            onSelectFinding={fid => setSelectedFindingId(fid)}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onTriggerAnalysis={handleTriggerAnalysis}
            isAnalyzing={isAnalyzing}
          />
        )}

        {activeTab === 'assessments' && (
          <AssessmentsView
            assessments={assessments}
            targets={targets}
            onSelectAssessment={id => {
              setCurrentAssessmentId(id);
              setActiveTab('dashboard');
            }}
            onCreateAssessment={handleCreateAssessment}
            onNavigate={tab => setActiveTab(tab)}
          />
        )}

        {activeTab === 'findings' && (
          <FindingsView
            assessment={currentAssessment}
            onSelectFinding={fid => setSelectedFindingId(fid)}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onTriggerAnalysis={handleTriggerAnalysis}
            isAnalyzing={isAnalyzing}
          />
        )}

        {activeTab === 'analysis' && (
          <AnalysisView
            assessment={currentAssessment}
            onSelectFinding={fid => setSelectedFindingId(fid)}
            onTriggerAnalysis={handleTriggerAnalysis}
            isAnalyzing={isAnalyzing}
            onNavigate={tab => setActiveTab(tab)}
          />
        )}

        {activeTab === 'graph' && (
          <GraphView
            assessment={currentAssessment}
            onSelectFinding={fid => setSelectedFindingId(fid)}
            onNavigate={tab => setActiveTab(tab)}
          />
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsView
            assessment={currentAssessment}
            onSelectFinding={fid => setSelectedFindingId(fid)}
          />
        )}

        {activeTab === 'approvals' && (
          <ApprovalCenterView
            assessment={currentAssessment}
            target={currentTarget}
            onOpenRequestModal={() => {
              setActionPrefillFinding(null);
              setIsRequestActionModalOpen(true);
            }}
            onReviewAction={handleReviewAction}
          />
        )}

        {activeTab === 'reports' && (
          <ReportView
            assessment={currentAssessment}
            target={currentTarget}
            auditLogs={auditLogs}
          />
        )}

        {activeTab === 'audit' && (
          <AuditLogView auditLogs={auditLogs} />
        )}
      </main>

      {/* Floating AI Assistant Trigger Pill */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="group flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.5)] transition cursor-pointer transform hover:scale-105"
        >
          <Bot className="w-4 h-4 animate-pulse" />
          <span>Ask CyberMind Copilot</span>
        </button>
      </div>

      {/* Finding Detail Inspection Drawer / Modal */}
      <FindingDetailModal
        finding={selectedFinding}
        onClose={() => setSelectedFindingId(null)}
        onSelectRelated={relId => setSelectedFindingId(relId)}
        onRequestAction={finding => {
          setActionPrefillFinding(finding);
          setIsRequestActionModalOpen(true);
        }}
      />

      {/* Import Findings Modal */}
      <ImportFindingsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        target={currentTarget}
        onImport={handleImportFindings}
      />

      {/* Request Security Action Modal */}
      <RequestActionModal
        isOpen={isRequestActionModalOpen}
        onClose={() => setIsRequestActionModalOpen(false)}
        target={currentTarget}
        prefillFinding={actionPrefillFinding}
        onSubmitAction={handleSubmitAction}
      />

      {/* Slide-out AI Security Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        assessment={currentAssessment}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
