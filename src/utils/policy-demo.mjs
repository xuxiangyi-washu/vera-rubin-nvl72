// 仅解释 OpenShell 的几类授权边界，不是 NVIDIA 策略引擎或 Sentry SDK。
export function evaluatePolicyDemo({ scenario, mode }) {
  if (!['read', 'write', 'network', 'credential'].includes(scenario) || !['audit', 'enforce'].includes(mode)) throw new Error('未知教学场景');
  if (scenario === 'network') return { result: 'blocked', gate: 'network', forwarded: false, credentialReleased: false };
  if (scenario === 'credential') return { result: 'blocked', gate: 'credential', forwarded: false, credentialReleased: false };
  if (scenario === 'write' && mode === 'enforce') return { result: 'blocked', gate: 'request', forwarded: false, credentialReleased: false };
  return { result: scenario === 'write' ? 'audit-only' : 'allowed', gate: 'complete', forwarded: true, credentialReleased: true };
}
