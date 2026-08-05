export { defaultAgents } from "./agents.js";
export {
  createDefaultStrategies,
  detectAgent,
  isRunningFromAgent
} from "./detector.js";
export { EnvironmentDetectionStrategy } from "./strategies/environment.js";
export {
  FileSystemDetectionStrategy,
  NodeFileSystemReader,
  type FileSystemReader
} from "./strategies/filesystem.js";
export {
  ProcessTreeDetectionStrategy,
  PsProcessReader,
  type ProcessReader
} from "./strategies/process-tree.js";
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
  EnvValueMatcher,
  FileSystemSignal,
  ProcessInfo,
  ProcessSignal
} from "./types.js";
