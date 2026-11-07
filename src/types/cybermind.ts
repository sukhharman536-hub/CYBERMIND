export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type FindingStatus = 
  | 'OBSERVED' 
  | 'REPORTED' 
  | 'AI_ANALYZED' 
  | 'CORRELATED' 
  | 'VERIFIED';

export type ActionStatus = 
  | 'WAITING_FOR_APPROVAL' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'EXECUTING' 
  | 'COMPLETED';

export interface AuthorizedTarget {
  id: string;
  name: string;
  targetCode: string;
  environment: 'Isolated Sandbox' | 'Controlled Lab' | 'Virtual Staging';
  authorizedBy: string;
  authorizationExpiry: string;
  ipRange: string;
  status: 'AUTHORIZED' | 'PENDING' | 'REVOKED';
  description: string;
  assetsCount: number;
}

export interface SecurityFinding {
  id: string;
  assessmentId: string;
  target: string;
  asset: string;
  service: string;
  port: number | string;
  version?: string;
  finding: string;
  technicalSeverity: Severity;
  status: FindingStatus;
  description: string;
  observedDate: string;
  source: 'manual' | 'nmap_import' | 'burp_export' | 'zap_json' | 'nessus_csv' | 'cloud_audit';
  aiAnalysis?: {
    technicalExplanation: string;
    potentialImpact: string;
    exposure: 'External' | 'Internal' | 'Restricted' | 'Airgapped';
    exploitability: 'Trivial' | 'Moderate' | 'High Effort' | 'Theoretical';
    assetImportance: 'Mission Critical' | 'High' | 'Medium' | 'Low';
    correlationFactor: 'High' | 'Medium' | 'Low';
    confidence: number; // e.g. 0.94
    finalContextualRisk: Severity;
    priority: number; // 1, 2, 3...
    contextualReasoning: string;
    plainEnglishSummary: string;
    evidence: string[];
    relatedFindingIds: string[];
    mitreAttackTactics?: string[];
    recommendedRemediation: string;
    remediationEffort: 'Quick Fix (< 1h)' | 'Moderate (1-4h)' | 'Architectural (> 1d)';
  };
}

export interface RiskGraphNode {
  id: string;
  label: string;
  type: 'asset' | 'service' | 'finding' | 'vulnerability' | 'risk' | 'business_impact';
  severity?: Severity;
  category?: string;
  details: string;
  confidence?: number;
  x: number;
  y: number;
}

export interface RiskGraphEdge {
  id: string;
  source: string;
  target: string;
  label: 'affects' | 'exposes' | 'depends on' | 'increases risk' | 'related to' | 'leads to';
  riskWeight: number; // 1-5
}

export interface CorrelatedAttackChain {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  findingIds: string[];
  chainSteps: string[];
  businessImpact: string;
  recommendedIntervention: string;
}

export interface SecurityActionRequest {
  id: string;
  assessmentId: string;
  action: string;
  reason: string;
  target: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  status: ActionStatus;
  requestedAt: string;
  requestedBy: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  safetyChecks: {
    authorizedLabTargetOnly: boolean;
    noInternetScanning: boolean;
    noCredentialAttacks: boolean;
    noDestructiveActions: boolean;
    noMalwareOrPersistence: boolean;
  };
  executionOutput?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: 
    | 'ASSESSMENT_CREATED' 
    | 'FINDINGS_IMPORTED' 
    | 'AI_ANALYSIS_STARTED' 
    | 'CORRELATION_COMPLETED' 
    | 'ACTION_REQUESTED' 
    | 'ACTION_APPROVED' 
    | 'ACTION_REJECTED' 
    | 'ACTION_EXECUTED' 
    | 'REPORT_GENERATED' 
    | 'POLICY_VIOLATION_BLOCKED';
  actor: string;
  details: string;
  target: string;
  status: 'SUCCESS' | 'WARNING' | 'BLOCKED' | 'INFO';
}

export interface RemediationRecommendation {
  id: string;
  priority: number;
  title: string;
  impact: string;
  rationale: string;
  targetAsset: string;
  steps: string[];
  codeSnippet?: string;
  rollback: string;
  effort: 'Quick Fix (< 1h)' | 'Moderate (1-4h)' | 'Architectural (> 1d)';
  relatedFindingIds: string[];
}

export interface SecurityAssessment {
  id: string;
  title: string;
  targetId: string;
  targetCode: string;
  environment: string;
  createdAt: string;
  updatedAt: string;
  status: 'DRAFT' | 'ANALYZING' | 'ANALYSIS_COMPLETE' | 'REVIEWED' | 'REPORT_READY';
  securityScore: number; // 0-100
  stats: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
    assetsCount: number;
  };
  aiRiskSummary: string;
  findings: SecurityFinding[];
  correlatedChains: CorrelatedAttackChain[];
  actionRequests: SecurityActionRequest[];
  recommendations: RemediationRecommendation[];
  executiveSummary?: string;
  methodology?: string;
  limitations?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citedFindingIds?: string[];
}
