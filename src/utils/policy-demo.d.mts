export type PolicyScenario = 'read' | 'write' | 'network' | 'credential';
export type PolicyMode = 'audit' | 'enforce';
export function evaluatePolicyDemo(input: { scenario: PolicyScenario; mode: PolicyMode }): { result: 'blocked' | 'audit-only' | 'allowed'; gate: 'network' | 'credential' | 'request' | 'complete'; forwarded: boolean; credentialReleased: boolean };
