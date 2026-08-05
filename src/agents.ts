import type { AgentDefinition } from "./types.js";

export const defaultAgents = [
  {
    id: "codex",
    name: "Codex",
    env: [
      { name: "CODEX_CI", value: "1" },
      { name: "CODEX_SANDBOX" },
      { name: "CODEX_SHELL", value: "1" },
      { name: "CODEX_THREAD_ID" }
    ],
    process: [{ pattern: /^codex$/i }],
    sessionEnv: ["CODEX_THREAD_ID"]
  },
  {
    id: "cursor",
    name: "Cursor",
    aliases: ["cursor-cli"],
    env: [
      { name: "CURSOR_AGENT", value: "1" },
      { name: "CURSOR_CONVERSATION_ID" },
      { name: "CURSOR_EXTENSION_HOST_ROLE", value: "agent-exec" },
      { name: "CURSOR_TRACE_ID" }
    ],
    process: [{ pattern: /^cursor$/i }],
    sessionEnv: ["CURSOR_CONVERSATION_ID"]
  },
  {
    id: "cowork",
    name: "Claude Cowork",
    env: [
      {
        name: "CLAUDE_CODE_IS_COWORK",
        condition: (env) => Boolean(env.CLAUDECODE || env.CLAUDE_CODE)
      }
    ],
    sessionEnv: ["CLAUDE_CODE_SESSION_ID"]
  },
  {
    id: "claude-code",
    name: "Claude Code",
    aliases: ["claude"],
    env: [
      { name: "CLAUDECODE", value: "1" },
      { name: "CLAUDE_CODE" },
      { name: "CLAUDE_CODE_SESSION_ID" }
    ],
    process: [{ pattern: /^claude$/i }],
    sessionEnv: ["CLAUDE_CODE_SESSION_ID"]
  },
  {
    id: "opencode",
    name: "OpenCode",
    env: [
      { name: "OPENCODE", value: "1" },
      { name: "OPENCODE_CLIENT" },
      { name: "OPENCODE_PID" }
    ],
    process: [{ pattern: /^opencode$/i }]
  },
  {
    id: "devin",
    name: "Devin",
    filesystem: [{ path: "/opt/.devin" }],
    process: [{ pattern: /devin/i }]
  },
  {
    id: "gemini",
    name: "Gemini CLI",
    env: [{ name: "GEMINI_CLI", value: "1" }],
    process: [{ pattern: /^gemini$/i }]
  },
  {
    id: "antigravity",
    name: "Antigravity",
    env: [
      { name: "ANTIGRAVITY_AGENT", value: "1" },
      { name: "ANTIGRAVITY_TRAJECTORY_ID" }
    ],
    process: [{ pattern: /^antigravity$/i }],
    sessionEnv: ["ANTIGRAVITY_TRAJECTORY_ID"]
  },
  {
    id: "augment-cli",
    name: "Augment CLI",
    env: [{ name: "AUGMENT_AGENT" }]
  },
  {
    id: "bolt",
    name: "Bolt",
    env: [
      { name: "BOLT_ENV" },
      { name: "BOLT_ORIGIN" },
      { name: "BOLT_SERVER_URL" }
    ]
  },
  {
    id: "pi",
    name: "Pi",
    env: [{ name: "PI_CODING_AGENT", value: "true" }]
  },
  {
    id: "replit",
    name: "Replit",
    env: [{ name: "REPLIT_SESSION" }],
    sessionEnv: ["REPLIT_SESSION"]
  },
  {
    id: "rork",
    name: "Rork",
    env: [{ name: "RORK_API_URL" }]
  },
  {
    id: "kiro",
    name: "Kiro",
    env: [{ name: "KIRO_SESSION_ID" }],
    process: [{ pattern: /kiro/i }],
    sessionEnv: ["KIRO_SESSION_ID"]
  },
  {
    id: "cline",
    name: "Cline",
    env: [{ name: "CLINE_WRAPPER_PATH" }],
    process: [{ pattern: /^cline$/i }]
  },
  {
    id: "kilocode",
    name: "Kilo Code",
    env: [
      { name: "KILO", value: "1" },
      { name: "KILOCODE_VERSION" },
      { name: "KILO_RUN_ID" }
    ],
    process: [{ pattern: /^(kilo|kilocode)$/i }],
    sessionEnv: ["KILO_RUN_ID"]
  },
  {
    id: "copilot",
    name: "GitHub Copilot CLI",
    aliases: ["github-copilot", "github-copilot-cli"],
    env: [
      { name: "COPILOT_CLI", value: "1" },
      { name: "COPILOT_AGENT_SESSION_ID" },
      { name: "COPILOT_RUN_APP", value: "1" },
      { name: "COPILOT_MODEL" },
      { name: "COPILOT_ALLOW_ALL", value: "true" },
      { name: "COPILOT_GITHUB_TOKEN" }
    ],
    process: [{ pattern: /^(github-copilot-cli|copilot)$/i }],
    sessionEnv: ["COPILOT_AGENT_SESSION_ID"]
  },
  {
    id: "v0",
    name: "v0"
  }
] satisfies readonly AgentDefinition[];
