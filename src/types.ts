export type AgentId =
  | "antigravity"
  | "bolt"
  | "cline"
  | "codex"
  | "copilot"
  | "cursor"
  | "devin"
  | "droid"
  | "gemini"
  | "grok"
  | "grok-bot"
  | "kiro"
  | "kilocode"
  | "claude-code"
  | "muse"
  | "muse-agent"
  | "opencode"
  | "pi"
  | "replit"
  | "rork";

export type HostId = "claude-cowork" | "conductor" | "t3-code";

export type DetectionStrategyName = "environment";

export type EnvValueMatcher =
  | string
  | RegExp
  | ((value: string) => boolean);

export interface EnvSignal {
  readonly name: string;
  readonly value?: EnvValueMatcher;
  readonly description?: string;
}

export interface AgentIdentity {
  readonly id: AgentId | string;
  readonly name: string;
}

export interface DetectedAgent extends AgentIdentity {
  readonly sessionId?: string;
}

export interface AgentDefinition extends AgentIdentity {
  readonly env?: readonly EnvSignal[];
  readonly sessionEnv?: readonly string[];
}

/**
 * The app the user works in, which runs the agent harness.
 * For example, T3 Code or Conductor running Claude Code or Codex.
 */
export interface HostIdentity {
  readonly id: HostId | string;
  readonly name: string;
}

export interface DetectedHost extends HostIdentity {
  readonly sessionId?: string;
}

export interface HostDefinition extends HostIdentity {
  readonly env?: readonly EnvSignal[];
  readonly sessionEnv?: readonly string[];
}

interface DetectionEvidenceBase {
  readonly strategy: DetectionStrategyName | string;
  readonly signal: string;
  readonly value?: string;
}

export interface AgentEvidence extends DetectionEvidenceBase {
  readonly agent: AgentIdentity;
  readonly host?: never;
}

export interface HostEvidence extends DetectionEvidenceBase {
  readonly host: HostIdentity;
  readonly agent?: never;
}

export type DetectionEvidence = AgentEvidence | HostEvidence;

export interface DetectionResult {
  readonly detected: boolean;
  readonly agent?: DetectedAgent;
  readonly host?: DetectedHost;
}

export interface DetectionContext {
  readonly env: NodeJS.ProcessEnv;
  readonly agents: readonly AgentDefinition[];
  readonly hosts: readonly HostDefinition[];
}

export interface DetectionStrategy {
  readonly name: DetectionStrategyName | string;
  detect(context: DetectionContext): readonly DetectionEvidence[];
}

export interface DetectAgentOptions {
  readonly env?: NodeJS.ProcessEnv;
  readonly agents?: readonly AgentDefinition[];
  readonly hosts?: readonly HostDefinition[];
  readonly strategies?: readonly DetectionStrategy[];
}
