import type { HostDefinition } from "./types.js";

/**
 * Apps that run an agent harness for the user.
 * The order sets the priority when several hosts match.
 */
export const defaultHosts = [
  {
    id: "claude-cowork",
    name: "Claude Cowork",
    env: [{ name: "CLAUDE_CODE_IS_COWORK" }]
  },
  {
    id: "conductor",
    name: "Conductor",
    // Conductor sets these for Claude Code, but not for Codex.
    env: [
      { name: "CONDUCTOR_SESSION_ID" },
      { name: "CONDUCTOR_WORKSPACE_ID" },
      { name: "CONDUCTOR_WORKSPACE_PATH" },
      { name: "CONDUCTOR_ROOT_PATH" },
      { name: "CONDUCTOR_IS_LOCAL" }
    ],
    sessionEnv: ["CONDUCTOR_SESSION_ID"]
  },
  {
    id: "t3-code",
    name: "T3 Code",
    env: [
      { name: "T3CODE_THREAD_ID" },
      { name: "T3CODE_CLI_PATH" },
      { name: "T3CODE_DESKTOP_HOST_SCOPE" },
      { name: "CLAUDE_CODE_ENTRYPOINT", value: "t3-code" },
      { name: "CODEX_INTERNAL_ORIGINATOR_OVERRIDE", value: "T3 Code" }
    ],
    sessionEnv: ["T3CODE_THREAD_ID"]
  }
] satisfies readonly HostDefinition[];
