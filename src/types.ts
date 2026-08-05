export type AgentId =
  | "antigravity"
  | "augment-cli"
  | "bolt"
  | "claude-code"
  | "cline"
  | "codex"
  | "copilot"
  | "cowork"
  | "cursor"
  | "devin"
  | "gemini"
  | "kiro"
  | "kilocode"
  | "opencode"
  | "pi"
  | "replit"
  | "rork"
  | "v0";

export type DetectionStrategyName = "environment" | "filesystem" | "process-tree";

export type EnvValueMatcher =
  | string
  | RegExp
  | ((value: string) => boolean);

export interface EnvSignal {
  readonly name: string;
  readonly value?: EnvValueMatcher;
  readonly condition?: (env: NodeJS.ProcessEnv) => boolean;
  readonly description?: string;
}

export interface FileSystemSignal {
  readonly path: string;
  readonly description?: string;
}

export interface ProcessSignal {
  readonly pattern: RegExp;
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
  readonly aliases?: readonly string[];
  readonly env?: readonly EnvSignal[];
  readonly filesystem?: readonly FileSystemSignal[];
  readonly process?: readonly ProcessSignal[];
  readonly sessionEnv?: readonly string[];
}

export interface ProcessInfo {
  readonly pid: number;
  readonly ppid?: number;
  readonly command: string;
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
  readonly pid: number;
  readonly agents: readonly AgentDefinition[];
  readonly maxProcessDepth: number;
}

export interface DetectionStrategy {
  readonly name: DetectionStrategyName | string;
  detect(context: DetectionContext): readonly DetectionEvidence[];
}

export interface DetectAgentOptions {
  readonly env?: NodeJS.ProcessEnv;
  readonly pid?: number;
  readonly agents?: readonly AgentDefinition[];
  readonly strategies?: readonly DetectionStrategy[];
  readonly experimentalProcessTree?: boolean;
  readonly maxProcessDepth?: number;
}
