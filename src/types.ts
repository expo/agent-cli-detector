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
  | "claude-cowork"
  | "muse"
  | "muse-agent"
  | "opencode"
  | "pi"
  | "replit"
  | "rork";

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

export interface DetectionEvidence {
  readonly agent: AgentIdentity;
  readonly strategy: DetectionStrategyName | string;
  readonly signal: string;
  readonly value?: string;
}

export interface DetectionResult {
  readonly detected: boolean;
  readonly agent?: DetectedAgent;
}

export interface DetectionContext {
  readonly env: NodeJS.ProcessEnv;
  readonly agents: readonly AgentDefinition[];
}

export interface DetectionStrategy {
  readonly name: DetectionStrategyName | string;
  detect(context: DetectionContext): readonly DetectionEvidence[];
}

export interface DetectAgentOptions {
  readonly env?: NodeJS.ProcessEnv;
  readonly agents?: readonly AgentDefinition[];
  readonly strategies?: readonly DetectionStrategy[];
}
