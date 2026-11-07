import { AuthorizedTarget, SecurityAssessment, AuditLogEntry } from '../types/cybermind';

export const AUTHORIZED_TARGETS: AuthorizedTarget[] = [
  {
    id: 'target-1',
    name: 'E-Commerce Sandbox Cluster',
    targetCode: 'LAB-WEB-01',
    environment: 'Isolated Sandbox',
    authorizedBy: 'SecOps Lead / DataOps Hackathon 2026 Admin',
    authorizationExpiry: '2026-12-31T23:59:59Z',
    ipRange: '10.240.10.0/24',
    status: 'AUTHORIZED',
    description: 'Isolated test environment hosting public web tier, authentication proxy, and catalog database.',
    assetsCount: 4
  },
  {
    id: 'target-2',
    name: 'Active Directory Identity Lab',
    targetCode: 'LAB-CORP-AD',
    environment: 'Controlled Lab',
    authorizedBy: 'Enterprise SecOps Director',
    authorizationExpiry: '2026-11-30T18:00:00Z',
    ipRange: '172.16.50.0/24',
    status: 'AUTHORIZED',
    description: 'Synthetic identity domain controller and workstation ring for Kerberos/SMB privilege path verification.',
    assetsCount: 6
  },
  {
    id: 'target-3',
    name: 'Kubernetes Microservices Staging',
    targetCode: 'LAB-CLOUD-K8S',
    environment: 'Virtual Staging',
    authorizedBy: 'Cloud Security Architect',
    authorizationExpiry: '2026-12-15T00:00:00Z',
    ipRange: '192.168.99.0/24',
    status: 'AUTHORIZED',
    description: 'Sandboxed k8s cluster with multi-tenant pod deployments and internal cloud object storage simulator.',
    assetsCount: 8
  }
];

export const INITIAL_ASSESSMENTS: SecurityAssessment[] = [
  {
    id: 'asmt-lab-web-01',
    title: 'E-Commerce Web Portal Security Assessment',
    targetId: 'target-1',
    targetCode: 'LAB-WEB-01',
    environment: 'Isolated Sandbox',
    createdAt: '2026-11-06T14:20:00Z',
    updatedAt: '2026-11-07T05:45:00Z',
    status: 'ANALYSIS_COMPLETE',
    securityScore: 68,
    stats: {
      critical: 2,
      high: 3,
      medium: 2,
      low: 1,
      total: 8,
      assetsCount: 4
    },
    aiRiskSummary: '3 findings appear to be connected and form an exploitable high-risk security path: Exposed Administrative Interface + Weak Authentication + Outdated Web Service creates a direct administrative compromise vector.',
    findings: [
      {
        id: 'f-1',
        assessmentId: 'asmt-lab-web-01',
        target: 'LAB-WEB-01',
        asset: 'Admin Portal',
        service: 'HTTP / Admin Console',
        port: 443,
        version: 'v2.1.0-internal',
        finding: 'Exposed administrative interface accessible without network perimeter restriction',
        technicalSeverity: 'HIGH',
        status: 'CORRELATED',
        description: 'The administrative control panel is directly reachable on public-facing ingress routes without IP whitelisting, VPN requirement, or zero-trust gating.',
        observedDate: '2026-11-06T14:25:00Z',
        source: 'zap_json',
        aiAnalysis: {
          technicalExplanation: 'The management console endpoint at /admin and /system-control is exposed directly on port 443. This bypasses the bastion perimeter, allowing unauthenticated attackers on public routing tables to reach internal configuration endpoints.',
          potentialImpact: 'Provides an attack surface for credential stuffing, privilege escalation, and full management console takeover.',
          exposure: 'External',
          exploitability: 'Trivial',
          assetImportance: 'Mission Critical',
          correlationFactor: 'High',
          confidence: 0.94,
          finalContextualRisk: 'CRITICAL',
          priority: 1,
          contextualReasoning: 'This finding was elevated from High to CRITICAL because the administrative interface is exposed externally and directly couples with Finding f-2 (Weak Authentication without brute-force lockout). This creates an immediate path to full administrative compromise.',
          plainEnglishSummary: 'The admin dashboard is open to the internet with no firewall barrier, making it easy for attackers to target the login page.',
          evidence: [
            'Direct HTTP 200 on https://app.lab-web-01.sandbox/admin',
            'No mTLS or IP access-list enforced in reverse proxy logs',
            'Contains sensitive administrative database export widgets'
          ],
          relatedFindingIds: ['f-2', 'f-3'],
          mitreAttackTactics: ['Initial Access (T1190)', 'Discovery (T1595.002)'],
          recommendedRemediation: 'Immediately restrict access to /admin via reverse proxy firewall rules, mandate internal VPN / Bastion ingress, and enforce Web Application Firewall (WAF) zero-trust mTLS.',
          remediationEffort: 'Quick Fix (< 1h)'
        }
      },
      {
        id: 'f-2',
        assessmentId: 'asmt-lab-web-01',
        target: 'LAB-WEB-01',
        asset: 'Authentication Service',
        service: 'OAuth2 / Internal Auth',
        port: 443,
        version: 'AuthEngine 1.4',
        finding: 'Weak authentication and lack of brute-force lockout controls on admin portal',
        technicalSeverity: 'HIGH',
        status: 'CORRELATED',
        description: 'Authentication endpoints fail to enforce account lockout thresholds, progressive rate limits, or adaptive multi-factor authentication for privileged accounts.',
        observedDate: '2026-11-06T14:30:00Z',
        source: 'burp_export',
        aiAnalysis: {
          technicalExplanation: 'POST requests to /api/auth/login do not implement token bucket rate limiting or IP-based velocity throttling. Repeated failed attempts return distinct error codes revealing valid username enumerations.',
          potentialImpact: 'Allows rapid automated password spray and dictionary attacks without triggering defensive locks or SOC alerting.',
          exposure: 'External',
          exploitability: 'Trivial',
          assetImportance: 'Mission Critical',
          correlationFactor: 'High',
          confidence: 0.92,
          finalContextualRisk: 'CRITICAL',
          priority: 2,
          contextualReasoning: 'Raised to CRITICAL context because the exposed admin portal (f-1) acts as an open runway. Without lockout or MFA, automated credential spray requires negligible effort.',
          plainEnglishSummary: 'Attackers can guess passwords thousands of times without getting locked out or blocked, allowing automated break-in.',
          evidence: [
            'Tested 500 consecutive rapid POST /api/auth/login with 0 rate limit responses (HTTP 429)',
            'Timing disparity between invalid usernames vs valid usernames (180ms vs 45ms)',
            'No MFA challenge presented for SuperAdmin role'
          ],
          relatedFindingIds: ['f-1', 'f-4'],
          mitreAttackTactics: ['Credential Access (T1110.001)', 'Initial Access (T1078)'],
          recommendedRemediation: 'Implement Redis-backed sliding window rate limiting (5 attempts/min), enforce mandatory TOTP MFA for all administrative roles, and apply constant-time user validation.',
          remediationEffort: 'Moderate (1-4h)'
        }
      },
      {
        id: 'f-3',
        assessmentId: 'asmt-lab-web-01',
        target: 'LAB-WEB-01',
        asset: 'Web Server',
        service: 'HTTP / Reverse Proxy',
        port: 80,
        version: 'Apache 2.4.29-Ubuntu',
        finding: 'Outdated web server version with unpatched proxy module vulnerabilities',
        technicalSeverity: 'HIGH',
        status: 'CORRELATED',
        description: 'The deployed Apache HTTP Server 2.4.29 contains multiple unpatched CVEs including request smuggling (CVE-2021-40438) and memory corruption.',
        observedDate: '2026-11-06T14:22:00Z',
        source: 'nmap_import',
        aiAnalysis: {
          technicalExplanation: 'The Server banner explicitly advertises Apache/2.4.29 (Ubuntu). mod_proxy in this build is vulnerable to SSRF via crafted uri-paths, enabling attackers to route requests into internal localhost services.',
          potentialImpact: 'Can be chained with the exposed admin portal to forge requests to backend microservices.',
          exposure: 'External',
          exploitability: 'Moderate',
          assetImportance: 'High',
          correlationFactor: 'High',
          confidence: 0.89,
          finalContextualRisk: 'HIGH',
          priority: 3,
          contextualReasoning: 'Maintained at HIGH priority because although exploitability requires specific crafted proxy payloads, it directly shields the backend and exposes backend internal ports.',
          plainEnglishSummary: 'The web server software is several years out of date and has known security flaws that could let hackers bypass security checks.',
          evidence: [
            'Server header: Apache/2.4.29 (Ubuntu) OpenSSL/1.1.1',
            'Banner confirmed via HTTP OPTIONS scan',
            'Known CVE-2021-40438 mod_proxy SSRF vulnerability matches active build'
          ],
          relatedFindingIds: ['f-1', 'f-5'],
          mitreAttackTactics: ['Exploit Public-Facing Application (T1190)'],
          recommendedRemediation: 'Upgrade Apache to latest LTS (2.4.58+) or migrate front-line reverse proxy to Nginx/Envoy, and disable ServerTokens signature.',
          remediationEffort: 'Moderate (1-4h)'
        }
      },
      {
        id: 'f-4',
        assessmentId: 'asmt-lab-web-01',
        target: 'LAB-WEB-01',
        asset: 'Web Server',
        service: 'HTTP / API Gateway',
        port: 80,
        version: 'Node.js Express / Internal',
        finding: 'Excessive service exposure via unauthenticated debug metrics endpoint',
        technicalSeverity: 'MEDIUM',
        status: 'AI_ANALYZED',
        description: 'Endpoint `/api/v1/metrics/env` is exposed without session tokens, leaking environment variables, internal hostnames, and runtime node metrics.',
        observedDate: '2026-11-06T14:32:00Z',
        source: 'zap_json',
        aiAnalysis: {
          technicalExplanation: 'Development metrics endpoints were inadvertently left mapped in production route controllers. Returns JSON containing database hostnames (db-internal.sandbox.local) and partial masked token structures.',
          potentialImpact: 'Provides reconnaissance data that accelerates credential attacks and network pivot mapping.',
          exposure: 'External',
          exploitability: 'Trivial',
          assetImportance: 'Medium',
          correlationFactor: 'Medium',
          confidence: 0.95,
          finalContextualRisk: 'HIGH',
          priority: 4,
          contextualReasoning: 'Elevated from Medium to HIGH because leaking the internal DB hostname and auth schema significantly eases the attacker’s progression along the attack chain.',
          plainEnglishSummary: 'A test page left on the server accidentally leaks technical details about the company network and database.',
          evidence: [
            'GET /api/v1/metrics/env returns 200 OK with internal host parameters',
            'Exposed DB_PORT=5432 and REDIS_CLUSTER_URL'
          ],
          relatedFindingIds: ['f-1', 'f-2'],
          mitreAttackTactics: ['Reconnaissance (T1592)'],
          recommendedRemediation: 'Remove debug endpoints from production builds and bind Prometheus metrics strictly to a localhost management socket (127.0.0.1:9090).',
          remediationEffort: 'Quick Fix (< 1h)'
        }
      },
      {
        id: 'f-5',
        assessmentId: 'asmt-lab-web-01',
        target: 'LAB-WEB-01',
        asset: 'Admin Portal',
        service: 'HTTP',
        port: 443,
        finding: 'Missing HTTP security headers (HSTS, Content-Security-Policy, X-Frame-Options)',
        technicalSeverity: 'LOW',
        status: 'AI_ANALYZED',
        description: 'The application web responses do not send Strict-Transport-Security, CSP, or Anti-Clickjacking headers.',
        observedDate: '2026-11-06T14:35:00Z',
        source: 'manual',
        aiAnalysis: {
          technicalExplanation: 'Absence of X-Frame-Options allows the admin portal to be embedded in an attacker iframe. Absence of CSP leaves user sessions susceptible to inline script injections.',
          potentialImpact: 'Clickjacking attacks on admin action buttons; potential session token hijacking if XSS is discovered.',
          exposure: 'External',
          exploitability: 'High Effort',
          assetImportance: 'Medium',
          correlationFactor: 'Low',
          confidence: 0.88,
          finalContextualRisk: 'LOW',
          priority: 7,
          contextualReasoning: 'Remains LOW because while good hygiene, exploiting missing headers alone requires complex victim interaction without existing XSS primitives.',
          plainEnglishSummary: 'The web application is missing modern browser defense headers that protect users from being tricked into clicking hidden buttons.',
          evidence: [
            'Header check: Strict-Transport-Security: NOT_PRESENT',
            'Header check: Content-Security-Policy: NOT_PRESENT',
            'Header check: X-Frame-Options: NOT_PRESENT'
          ],
          relatedFindingIds: ['f-1'],
          mitreAttackTactics: ['Execution (T1204)'],
          recommendedRemediation: 'Configure reverse proxy to append standard hardened security headers on all responses.',
          remediationEffort: 'Quick Fix (< 1h)'
        }
      },
      {
        id: 'f-6',
        assessmentId: 'asmt-lab-web-01',
        target: 'LAB-WEB-01',
        asset: 'Database',
        service: 'PostgreSQL',
        port: 5432,
        version: 'PostgreSQL 14.2',
        finding: 'Database listening on all network interfaces with default credentials fallback',
        technicalSeverity: 'HIGH',
        status: 'CORRELATED',
        description: 'PostgreSQL is bound to 0.0.0.0:5432 rather than 127.0.0.1, with pg_hba.conf configured with md5 password auth across all sandbox subnets.',
        observedDate: '2026-11-06T14:40:00Z',
        source: 'nmap_import',
        aiAnalysis: {
          technicalExplanation: 'The database server is directly accessible from any sandbox container. Coupled with information leaked from the debug endpoint (f-4), an attacker on the web node can connect directly to the primary data tier.',
          potentialImpact: 'Direct exfiltration of transactional customer data, password hashes, and business records.',
          exposure: 'Internal',
          exploitability: 'Moderate',
          assetImportance: 'Mission Critical',
          correlationFactor: 'High',
          confidence: 0.93,
          finalContextualRisk: 'CRITICAL',
          priority: 5,
          contextualReasoning: 'Elevated to CRITICAL because database contains crown jewel data and is reachable if the web server or admin portal is breached.',
          plainEnglishSummary: 'The database is open to network connections from other servers without strict isolation rules.',
          evidence: [
            'Nmap scan confirms open port 5432/tcp open postgresql on 0.0.0.0',
            'pg_hba.conf shows permissive host-all rules'
          ],
          relatedFindingIds: ['f-4'],
          mitreAttackTactics: ['Lateral Movement (T1021)', 'Collection (T1005)'],
          recommendedRemediation: 'Reconfigure postgresql.conf listen_addresses = \'localhost\', mandate TLS client certificates, and enforce security group micro-segmentation.',
          remediationEffort: 'Moderate (1-4h)'
        }
      },
      {
        id: 'f-7',
        assessmentId: 'asmt-lab-web-01',
        target: 'LAB-WEB-01',
        asset: 'Web Server',
        service: 'HTTP / API',
        port: 443,
        finding: 'Overly permissive Cross-Origin Resource Sharing (CORS) with Allow-Credentials',
        technicalSeverity: 'MEDIUM',
        status: 'AI_ANALYZED',
        description: 'CORS header dynamically reflects arbitrary Origin headers with Access-Control-Allow-Credentials: true.',
        observedDate: '2026-11-06T14:45:00Z',
        source: 'zap_json',
        aiAnalysis: {
          technicalExplanation: 'The backend echoes whatever Origin header is sent by a client and attaches Allow-Credentials: true, bypassing the Same-Origin Policy in modern browsers.',
          potentialImpact: 'Malicious third-party websites visited by authenticated admin users can silently read private API responses.',
          exposure: 'External',
          exploitability: 'Moderate',
          assetImportance: 'High',
          correlationFactor: 'Medium',
          confidence: 0.90,
          finalContextualRisk: 'MEDIUM',
          priority: 6,
          contextualReasoning: 'Remains at MEDIUM because it requires an active authenticated session and user to visit an untrusted third-party site.',
          plainEnglishSummary: 'Web browsers can be tricked into sharing private logged-in data with unauthorized outside websites.',
          evidence: [
            'Tested Origin: https://evil.attacker.example -> Access-Control-Allow-Origin: https://evil.attacker.example',
            'Access-Control-Allow-Credentials: true present'
          ],
          relatedFindingIds: ['f-2'],
          mitreAttackTactics: ['Defense Evasion (T1557)'],
          recommendedRemediation: 'Replace dynamic reflection with an explicit strict whitelist of authorized frontend domains.',
          remediationEffort: 'Quick Fix (< 1h)'
        }
      },
      {
        id: 'f-8',
        assessmentId: 'asmt-lab-web-01',
        target: 'LAB-WEB-01',
        asset: 'Web Server',
        service: 'HTTP',
        port: 80,
        finding: 'Cleartext HTTP traffic allowed without automatic HTTPS redirection',
        technicalSeverity: 'LOW',
        status: 'OBSERVED',
        description: 'Port 80 serves content without returning a 301 Permanent Redirect to HTTPS.',
        observedDate: '2026-11-06T14:48:00Z',
        source: 'manual',
        aiAnalysis: {
          technicalExplanation: 'Plain HTTP 80 allows network eavesdropping and man-in-the-middle packet modification on unencrypted public channels.',
          potentialImpact: 'Session token sniffing on shared Wi-Fi networks.',
          exposure: 'External',
          exploitability: 'Moderate',
          assetImportance: 'Medium',
          correlationFactor: 'Low',
          confidence: 0.85,
          finalContextualRisk: 'LOW',
          priority: 8,
          contextualReasoning: 'Low risk in isolated lab environment but mandatory baseline standard for production compliance.',
          plainEnglishSummary: 'Unencrypted web connections are permitted, which could allow eavesdroppers to see sensitive data in transit.',
          evidence: [
            'GET http://app.lab-web-01.sandbox/ returns HTTP 200 instead of HTTP 301/308 Redirect'
          ],
          relatedFindingIds: ['f-5'],
          mitreAttackTactics: ['Adversary-in-the-Middle (T1557)'],
          recommendedRemediation: 'Add HTTP 301 redirect rule in web server configuration to force HTTPS on all incoming traffic.',
          remediationEffort: 'Quick Fix (< 1h)'
        }
      }
    ],
    correlatedChains: [
      {
        id: 'chain-1',
        title: 'Critical Attack Path: Public Ingress to Administrative Takeover',
        description: 'Chaining the exposed administrative portal, lack of brute force controls, and leaked environment configuration exposes the entire database layer.',
        severity: 'CRITICAL',
        findingIds: ['f-1', 'f-2', 'f-4', 'f-6'],
        chainSteps: [
          'Step 1: Public Reconnaissance discovers unauthenticated /api/v1/metrics/env and /admin portal.',
          'Step 2: Attacker extracts database endpoint and user naming conventions from environment dump.',
          'Step 3: Attacker runs rapid automated credential spray against /api/auth/login with 0 lockout penalty.',
          'Step 4: Gained SuperAdmin session allows direct database query execution and crown jewel exfiltration.'
        ],
        businessImpact: 'Complete compromise of customer PII, payment order logs, and regulatory compliance fines under GDPR/PCI-DSS.',
        recommendedIntervention: 'Apply immediate network isolation on /admin and enforce MFA on authentication services.'
      },
      {
        id: 'chain-2',
        title: 'Secondary Path: Server Side Request Forgery via Outdated Web Tier',
        description: 'The unpatched Apache mod_proxy version allows SSRF to bypass perimeter controls and query internal database services.',
        severity: 'HIGH',
        findingIds: ['f-3', 'f-4', 'f-6'],
        chainSteps: [
          'Step 1: Crafted URI to Apache mod_proxy exploits CVE-2021-40438.',
          'Step 2: Request is proxied internally to Postgres port 5432 or internal management sockets.',
          'Step 3: Bypasses external perimeter firewall without needing valid admin credentials.'
        ],
        businessImpact: 'Internal network reconnaissance and unauthorized internal service triggering.',
        recommendedIntervention: 'Patch Apache server to 2.4.58+ and close port 5432 to external subnet interfaces.'
      }
    ],
    actionRequests: [
      {
        id: 'act-1',
        assessmentId: 'asmt-lab-web-01',
        action: 'Execute Non-Destructive Active Verification on /admin Ingress ACL',
        reason: 'Validate whether newly configured reverse proxy CIDR whitelist successfully blocks external IP simulator while permitting SecOps bastion.',
        target: 'LAB-WEB-01',
        riskLevel: 'Medium',
        status: 'WAITING_FOR_APPROVAL',
        requestedAt: '2026-11-07T05:20:00Z',
        requestedBy: 'AI Security Analyst (Autonomous Suggestion)',
        safetyChecks: {
          authorizedLabTargetOnly: true,
          noInternetScanning: true,
          noCredentialAttacks: true,
          noDestructiveActions: true,
          noMalwareOrPersistence: true
        }
      },
      {
        id: 'act-2',
        assessmentId: 'asmt-lab-web-01',
        action: 'Probe /api/v1/metrics/env Endpoint with Safe Synthetic Token',
        reason: 'Verify if the leaked environment endpoint has been safely decommissioned or gated behind Bearer authentication in current build.',
        target: 'LAB-WEB-01',
        riskLevel: 'Low',
        status: 'APPROVED',
        requestedAt: '2026-11-07T04:45:00Z',
        requestedBy: 'Junior Security Engineer',
        reviewedAt: '2026-11-07T04:50:00Z',
        reviewedBy: 'SecOps Lead (Approval Officer)',
        reviewNotes: 'Authorized for 10.240.10.12 sandbox container only. Rate limited to 1 req/sec.',
        safetyChecks: {
          authorizedLabTargetOnly: true,
          noInternetScanning: true,
          noCredentialAttacks: true,
          noDestructiveActions: true,
          noMalwareOrPersistence: true
        },
        executionOutput: '[LAB-VERIFICATION] Target: 10.240.10.12:80 -> Status: HTTP 403 Forbidden (ACL Gated). Endpoint successfully shielded from unauthorized query.'
      },
      {
        id: 'act-3',
        assessmentId: 'asmt-lab-web-01',
        action: 'Active Brute-Force Password Dictionary Validation against Admin Users',
        reason: 'Attempt heavy wordlist spray against live target authentication gateway.',
        target: 'LAB-WEB-01',
        riskLevel: 'High',
        status: 'REJECTED',
        requestedAt: '2026-11-06T16:00:00Z',
        requestedBy: 'Automated Script Probe',
        reviewedAt: '2026-11-06T16:05:00Z',
        reviewedBy: 'Safety Guard Policy Engine',
        reviewNotes: 'BLOCKED BY SAFETY SYSTEM: Active credential attacks, automated fuzzing, and heavy dictionary sprays violate CyberMind AI safety guidelines.',
        safetyChecks: {
          authorizedLabTargetOnly: true,
          noInternetScanning: true,
          noCredentialAttacks: false,
          noDestructiveActions: true,
          noMalwareOrPersistence: true
        }
      }
    ],
    recommendations: [
      {
        id: 'rec-1',
        priority: 1,
        title: 'Restrict Administrative Interface Exposure & Implement Zero-Trust Perimeter',
        impact: 'Breaks the primary entry point for external attackers, neutralizing 70% of current risk surface.',
        rationale: 'Finding f-1 (Exposed Admin) is the prerequisite for the entire Critical Attack Chain. Closing public ingress immediately protects the weak authentication engine behind it.',
        targetAsset: 'Admin Portal',
        steps: [
          'Modify Nginx / Apache reverse proxy config to reject requests to /admin from non-whitelisted IPs.',
          'Route administrative console traffic exclusively through an internal WireGuard or Tailscale VPN tunnel.',
          'Require mutual TLS (mTLS) client certificates for all admin web client interactions.'
        ],
        codeSnippet: `# Nginx Perimeter Rule
location /admin {
    allow 10.240.10.50/32; # SecOps Bastion
    allow 127.0.0.1;
    deny all;
    auth_request /validate-mfa-session;
}`,
        rollback: 'Revert Nginx configuration block and reload service via systemctl reload nginx.',
        effort: 'Quick Fix (< 1h)',
        relatedFindingIds: ['f-1', 'f-2']
      },
      {
        id: 'rec-2',
        priority: 2,
        title: 'Enforce Sliding-Window Rate Limiting & Mandatory Multi-Factor Authentication',
        impact: 'Completely eliminates automated credential stuffing and password spray attacks against privileged users.',
        rationale: 'Finding f-2 allowed unchecked login velocity. Without rate limits, low-complexity passwords can be cracked in minutes.',
        targetAsset: 'Authentication Service',
        steps: [
          'Deploy Redis-based sliding window rate limiter at 5 failed attempts per 15 minutes per IP/User.',
          'Enable mandatory TOTP (RFC 6238) or FIDO2 WebAuthn security keys for any user with Admin privileges.',
          'Normalize response timing on /api/auth/login to prevent username enumeration timing attacks.'
        ],
        codeSnippet: `// Express / Node Rate Limiter
import rateLimit from 'express-rate-limit';
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Locked for 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});`,
        rollback: 'Disable loginLimiter middleware in Express auth router and restart service.',
        effort: 'Moderate (1-4h)',
        relatedFindingIds: ['f-2']
      },
      {
        id: 'rec-3',
        priority: 3,
        title: 'Update Apache Web Server to Version 2.4.58+ and Disable Server Signatures',
        impact: 'Removes SSRF vulnerability (CVE-2021-40438) and hides technology fingerprint from automated scanners.',
        rationale: 'Finding f-3 provides an alternative path for attackers to query backend services even if perimeter filters are partially in place.',
        targetAsset: 'Web Server',
        steps: [
          'Execute apt-get update && apt-get install --only-upgrade apache2 on the Ubuntu host.',
          'Configure ServerTokens Prod and ServerSignature Off in /etc/apache2/conf-available/security.conf.',
          'Verify mod_proxy proxy balance rules do not permit unix-socket or unvalidated internal scheme forwarding.'
        ],
        codeSnippet: `# /etc/apache2/conf-available/security.conf
ServerTokens Prod
ServerSignature Off
TraceEnable Off`,
        rollback: 'Roll back apt package version using apt-get install apache2=2.4.29-1ubuntu4.14 if regressions occur.',
        effort: 'Moderate (1-4h)',
        relatedFindingIds: ['f-3']
      },
      {
        id: 'rec-4',
        priority: 4,
        title: 'Decommission Unauthenticated Debug Endpoints and Bind Metrics to Localhost',
        impact: 'Prevents internal architectural reconnaissance and leaks of database connection parameters.',
        rationale: 'Finding f-4 provided critical reconnaissance intelligence that enabled the database compromise in Chain-1.',
        targetAsset: 'Web Server',
        steps: [
          'Remove or comment out /api/v1/metrics/env route in production code builds.',
          'Bind internal telemetry endpoints strictly to 127.0.0.1 on a dedicated non-routable port (e.g. 9100).',
          'Add CI/CD security linter check to flag any endpoint containing /metrics or /env before staging release.'
        ],
        rollback: 'Re-enable debug flag in development environment file if troubleshooting is required.',
        effort: 'Quick Fix (< 1h)',
        relatedFindingIds: ['f-4', 'f-6']
      }
    ],
    executiveSummary: 'CyberMind AI performed an automated contextual cybersecurity assessment across the authorized sandbox target LAB-WEB-01. Although individual findings were initially scored with moderate technical severities, our AI Finding Correlation Engine identified a critical interdependent attack path connecting public ingress (/admin) with unmitigated authentication spray and backend database exposure. Immediate remediation of the administrative perimeter and authentication controls will remediate 85% of total organizational risk.',
    methodology: 'DataOps Automated Security Assessment Methodology combining passive service banner analysis, structured vulnerability ingest, contextual graph correlation, and human-in-the-loop validation.',
    limitations: 'All assessments were restricted strictly to authorized sandbox environments (10.240.10.0/24). Active intrusive exploitation, denial-of-service, and persistent implant deployment were strictly disabled by system safety policy.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-11-06T14:20:00Z',
    eventType: 'ASSESSMENT_CREATED',
    actor: 'Security Analyst (Demo User)',
    details: 'Created assessment "E-Commerce Web Portal Security Assessment" targeting LAB-WEB-01.',
    target: 'LAB-WEB-01',
    status: 'SUCCESS'
  },
  {
    id: 'log-2',
    timestamp: '2026-11-06T14:21:00Z',
    eventType: 'FINDINGS_IMPORTED',
    actor: 'ZAP / Nmap Ingest Pipeline',
    details: 'Imported 8 raw vulnerability observations from sandbox scan report.',
    target: 'LAB-WEB-01',
    status: 'SUCCESS'
  },
  {
    id: 'log-3',
    timestamp: '2026-11-06T14:25:30Z',
    eventType: 'AI_ANALYSIS_STARTED',
    actor: 'CyberMind AI Engine (Gemini 3.8 Flash)',
    details: 'Triggered deep contextual risk analysis and multi-vector correlation.',
    target: 'LAB-WEB-01',
    status: 'INFO'
  },
  {
    id: 'log-4',
    timestamp: '2026-11-06T14:26:15Z',
    eventType: 'CORRELATION_COMPLETED',
    actor: 'CyberMind AI Engine',
    details: 'Correlated 3 findings (f-1, f-2, f-3) into Critical Attack Chain #1. Elevated contextual risk from High to CRITICAL.',
    target: 'LAB-WEB-01',
    status: 'WARNING'
  },
  {
    id: 'log-5',
    timestamp: '2026-11-06T16:00:00Z',
    eventType: 'ACTION_REQUESTED',
    actor: 'Automated Script Probe',
    details: 'Requested active wordlist dictionary attack against /api/auth/login.',
    target: 'LAB-WEB-01',
    status: 'INFO'
  },
  {
    id: 'log-6',
    timestamp: '2026-11-06T16:05:00Z',
    eventType: 'POLICY_VIOLATION_BLOCKED',
    actor: 'Safety Policy Gatekeeper',
    details: 'Action Request BLOCKED: Credential attacks and brute force are prohibited under CyberMind AI safety rules.',
    target: 'LAB-WEB-01',
    status: 'BLOCKED'
  },
  {
    id: 'log-7',
    timestamp: '2026-11-07T04:45:00Z',
    eventType: 'ACTION_REQUESTED',
    actor: 'Junior Security Engineer',
    details: 'Requested safe passive verification of /api/v1/metrics/env endpoint.',
    target: 'LAB-WEB-01',
    status: 'INFO'
  },
  {
    id: 'log-8',
    timestamp: '2026-11-07T04:50:00Z',
    eventType: 'ACTION_APPROVED',
    actor: 'SecOps Lead (Approval Officer)',
    details: 'Approved passive verification request for target 10.240.10.12 sandbox container.',
    target: 'LAB-WEB-01',
    status: 'SUCCESS'
  },
  {
    id: 'log-9',
    timestamp: '2026-11-07T04:52:00Z',
    eventType: 'ACTION_EXECUTED',
    actor: 'CyberMind Sandbox Runner',
    details: 'Executed dry-run curl test: Returned HTTP 403 Forbidden. Safe verification confirmed remediation.',
    target: 'LAB-WEB-01',
    status: 'SUCCESS'
  }
];
