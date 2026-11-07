import { SecurityAssessment, RiskGraphNode, RiskGraphEdge, SecurityFinding, Severity } from '../types/cybermind';

export function buildRiskGraphFromAssessment(assessment: SecurityAssessment): { nodes: RiskGraphNode[]; edges: RiskGraphEdge[] } {
  const nodes: RiskGraphNode[] = [];
  const edges: RiskGraphEdge[] = [];
  const addedNodeIds = new Set<string>();

  function addNode(node: RiskGraphNode) {
    if (!addedNodeIds.has(node.id)) {
      addedNodeIds.add(node.id);
      nodes.push(node);
    }
  }

  function addEdge(edge: RiskGraphEdge) {
    // Only add if both endpoints exist
    if (addedNodeIds.has(edge.source) && addedNodeIds.has(edge.target)) {
      // prevent duplicate edge
      if (!edges.some(e => e.source === edge.source && e.target === edge.target && e.label === edge.label)) {
        edges.push(edge);
      }
    }
  }

  // 1. Group findings by asset
  const assetMap = new Map<string, SecurityFinding[]>();
  assessment.findings.forEach(f => {
    const list = assetMap.get(f.asset) || [];
    list.push(f);
    assetMap.set(f.asset, list);
  });

  // Layout coordinates layout columns:
  // Column 1: Assets (x: 80)
  // Column 2: Services / Endpoints (x: 280)
  // Column 3: Findings / Vulnerabilities (x: 520)
  // Column 4: Correlated Risks (x: 780)
  // Column 5: Business Impact (x: 1020)

  let assetY = 100;
  const serviceAdded = new Set<string>();

  assetMap.forEach((findings, assetName) => {
    const assetNodeId = `asset-${assetName.replace(/\s+/g, '-').toLowerCase()}`;
    addNode({
      id: assetNodeId,
      label: assetName,
      type: 'asset',
      category: 'Target Asset',
      details: `Asset in ${assessment.targetCode} hosting ${findings.length} findings.`,
      x: 80,
      y: assetY
    });

    let findingYOffset = assetY - (findings.length * 40) / 2;

    findings.forEach((finding, idx) => {
      // Service node
      const serviceKey = `${finding.asset}-${finding.service}-${finding.port}`;
      const serviceNodeId = `service-${serviceKey.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
      
      if (!serviceAdded.has(serviceKey)) {
        serviceAdded.add(serviceKey);
        addNode({
          id: serviceNodeId,
          label: `${finding.service} :${finding.port}`,
          type: 'service',
          category: 'Service / Port',
          details: `Port ${finding.port} running on ${finding.asset} (${finding.version || 'Version detected'})`,
          x: 280,
          y: assetY + (idx - 1) * 70
        });

        addEdge({
          id: `edge-${assetNodeId}-${serviceNodeId}`,
          source: assetNodeId,
          target: serviceNodeId,
          label: 'exposes',
          riskWeight: 2
        });
      }

      // Finding node
      const findingNodeId = `finding-${finding.id}`;
      const sev = finding.aiAnalysis?.finalContextualRisk || finding.technicalSeverity;
      addNode({
        id: findingNodeId,
        label: finding.finding.length > 36 ? finding.finding.substring(0, 36) + '...' : finding.finding,
        type: 'finding',
        severity: sev,
        category: 'Security Finding',
        details: finding.aiAnalysis?.plainEnglishSummary || finding.description,
        confidence: finding.aiAnalysis?.confidence,
        x: 520,
        y: findingYOffset + idx * 85
      });

      // Edge from service to finding
      addEdge({
        id: `edge-${serviceNodeId}-${findingNodeId}`,
        source: serviceNodeId,
        target: findingNodeId,
        label: 'affects',
        riskWeight: sev === 'CRITICAL' ? 5 : sev === 'HIGH' ? 4 : 3
      });

      // Related finding links
      if (finding.aiAnalysis?.relatedFindingIds) {
        finding.aiAnalysis.relatedFindingIds.forEach(relId => {
          const relNodeId = `finding-${relId}`;
          // Link will be added after all nodes are registered
          setTimeout(() => {
            addEdge({
              id: `edge-rel-${finding.id}-${relId}`,
              source: findingNodeId,
              target: relNodeId,
              label: 'related to',
              riskWeight: 4
            });
          }, 0);
        });
      }
    });

    assetY += Math.max(findings.length * 90, 160);
  });

  // 2. Correlated attack chain risks & business impact nodes
  if (assessment.correlatedChains && assessment.correlatedChains.length > 0) {
    assessment.correlatedChains.forEach((chain, idx) => {
      const riskNodeId = `risk-${chain.id}`;
      const riskY = 140 + idx * 220;

      addNode({
        id: riskNodeId,
        label: chain.title.replace('Critical Attack Path: ', '').replace('Secondary Path: ', ''),
        type: 'risk',
        severity: chain.severity,
        category: 'Correlated Threat',
        details: chain.description,
        x: 780,
        y: riskY
      });

      // Link constituent findings to this risk
      chain.findingIds.forEach(fid => {
        const findingNodeId = `finding-${fid}`;
        addEdge({
          id: `edge-${findingNodeId}-${riskNodeId}`,
          source: findingNodeId,
          target: riskNodeId,
          label: 'increases risk',
          riskWeight: 5
        });
      });

      // Business Impact Node
      const impactNodeId = `impact-${chain.id}`;
      addNode({
        id: impactNodeId,
        label: chain.businessImpact.length > 40 ? chain.businessImpact.substring(0, 38) + '...' : chain.businessImpact,
        type: 'business_impact',
        severity: chain.severity,
        category: 'Business Impact',
        details: chain.businessImpact,
        x: 1040,
        y: riskY
      });

      addEdge({
        id: `edge-${riskNodeId}-${impactNodeId}`,
        source: riskNodeId,
        target: impactNodeId,
        label: 'leads to',
        riskWeight: 5
      });
    });
  }

  // Double check all edges are valid
  const validEdges = edges.filter(e => addedNodeIds.has(e.source) && addedNodeIds.has(e.target));

  return { nodes, edges: validEdges };
}
