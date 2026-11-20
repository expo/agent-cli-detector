export { defaultAgents } from "./agents.js";
export { defaultHosts } from "./hosts.js";
export {
  createDefaultStrategies,
  detectAgent,
  isRunningFromAgent
} from "./detector.js";
export { EnvironmentDetectionStrategy } from "./strategies/environment.js";
export type {
  AgentDefinition,
  AgentEvidence,
  AgentId,
  AgentIdentity,
  DetectAgentOptions,
  DetectedAgent,
  DetectedHost,
  DetectionContext,
  DetectionEvidence,
  DetectionResult,
  DetectionStrategy,
  DetectionStrategyName,
  EnvSignal,
  EnvValueMatcher,
  HostDefinition,
  HostEvidence,
  HostId,
  HostIdentity
} from "./types.js";
