export { defaultAgents } from "./agents.js";
export {
  createDefaultStrategies,
  detectAgent,
  isRunningFromAgent
} from "./detector.js";
export { EnvironmentDetectionStrategy } from "./strategies/environment.js";
export type {
  AgentDefinition,
  AgentId,
  AgentIdentity,
  DetectAgentOptions,
  DetectedAgent,
  DetectionContext,
  DetectionEvidence,
  DetectionResult,
  DetectionStrategy,
  DetectionStrategyName,
  EnvSignal,
  EnvValueMatcher
} from "./types.js";
