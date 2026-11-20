import assert from "node:assert/strict";
import test from "node:test";
import {
  createDefaultStrategies,
  defaultAgents,
  defaultHosts,
  detectAgent,
  EnvironmentDetectionStrategy
} from "../dist/index.js";

test("detects an agent from a strong environment variable", () => {
  const result = detectAgent({
    env: {
      CLAUDECODE: "1"
    }
  });

  assert.equal(result.detected, true);
  assert.equal(result.agent.id, "claude-code");
});

test("detects Claude Cowork as the host of Claude Code", () => {
  const result = detectAgent({
    env: {
      CLAUDECODE: "1",
      CLAUDE_CODE_IS_COWORK: "1",
      CLAUDE_CODE_SESSION_ID: "session-123"
    }
  });

  assert.deepEqual(result, {
    detected: true,
    agent: {
      id: "claude-code",
      name: "Claude Code",
      sessionId: "session-123"
    },
    host: {
      id: "claude-cowork",
      name: "Claude Cowork"
    }
  });
});

test("detects Claude Code from the Cowork signal alone", () => {
  const result = detectAgent({
    env: {
      CLAUDE_CODE_IS_COWORK: "1"
    }
  });

  assert.equal(result.detected, true);
  assert.equal(result.agent.id, "claude-code");
  assert.equal(result.host.id, "claude-cowork");
});

test("detects Claude Code without a host", () => {
  const result = detectAgent({
    env: {
      CLAUDECODE: "1",
      CLAUDE_CODE_SESSION_ID: "session-123"
    }
  });

  assert.deepEqual(result, {
    detected: true,
    agent: {
      id: "claude-code",
      name: "Claude Code",
      sessionId: "session-123"
    }
  });
  assert.equal("host" in result, false);
});

test("detects T3 Code as the host of Claude Code", () => {
  const result = detectAgent({
    env: {
      CLAUDECODE: "1",
      CLAUDE_CODE_ENTRYPOINT: "t3-code",
      CLAUDE_CODE_SESSION_ID: "session-123",
      T3CODE_CLI_PATH: "/Applications/T3 Code.app/Contents/Resources/bin/t3",
      T3CODE_DESKTOP_HOST_SCOPE: "scope-789",
      T3CODE_THREAD_ID: "thread-456"
    }
  });

  assert.deepEqual(result, {
    detected: true,
    agent: {
      id: "claude-code",
      name: "Claude Code",
      sessionId: "session-123"
    },
    host: {
      id: "t3-code",
      name: "T3 Code",
      sessionId: "thread-456"
    }
  });
});

test("detects T3 Code from the Claude Code entrypoint alone", () => {
  const result = detectAgent({
    env: {
      CLAUDECODE: "1",
      CLAUDE_CODE_ENTRYPOINT: "t3-code"
    }
  });

  assert.deepEqual(result.host, {
    id: "t3-code",
    name: "T3 Code"
  });
});

test("does not detect a host from other Claude Code entrypoints", () => {
  const result = detectAgent({
    env: {
      CLAUDECODE: "1",
      CLAUDE_CODE_ENTRYPOINT: "cli"
    }
  });

  assert.equal(result.agent.id, "claude-code");
  assert.equal(result.host, undefined);
});

test("detects T3 Code as the host of Codex", () => {
  const result = detectAgent({
    env: {
      // T3 Code passes its own Claude Agent SDK variable to Codex too.
      CLAUDE_AGENT_SDK_VERSION: "0.0.0",
      CODEX_CI: "1",
      CODEX_INTERNAL_ORIGINATOR_OVERRIDE: "T3 Code",
      CODEX_SESSION_ID: "codex-session-123",
      CODEX_THREAD_ID: "codex-thread-123",
      T3CODE_CLI_PATH: "/Applications/T3 Code.app/Contents/Resources/bin/t3",
      T3CODE_DESKTOP_HOST_SCOPE: "scope-789",
      T3CODE_THREAD_ID: "thread-456"
    }
  });

  assert.deepEqual(result, {
    detected: true,
    agent: {
      id: "codex",
      name: "Codex",
      sessionId: "codex-thread-123"
    },
    host: {
      id: "t3-code",
      name: "T3 Code",
      sessionId: "thread-456"
    }
  });
});

test("detects T3 Code from the Codex originator alone", () => {
  const result = detectAgent({
    env: {
      CODEX_THREAD_ID: "codex-thread-123",
      CODEX_INTERNAL_ORIGINATOR_OVERRIDE: "T3 Code"
    }
  });

  assert.equal(result.agent.id, "codex");
  assert.deepEqual(result.host, {
    id: "t3-code",
    name: "T3 Code"
  });
});

test("detects Conductor as the host of Claude Code", () => {
  const result = detectAgent({
    env: {
      CLAUDECODE: "1",
      CLAUDE_CODE_SESSION_ID: "session-123",
      CONDUCTOR_DEFAULT_BRANCH: "main",
      CONDUCTOR_IS_LOCAL: "1",
      CONDUCTOR_ROOT_PATH: "/Users/me/repo",
      CONDUCTOR_SESSION_ID: "conductor-session-123",
      CONDUCTOR_WORKSPACE_ID: "workspace-123",
      CONDUCTOR_WORKSPACE_NAME: "lisbon",
      CONDUCTOR_WORKSPACE_PATH: "/Users/me/conductor/workspaces/repo/lisbon"
    }
  });

  assert.deepEqual(result, {
    detected: true,
    agent: {
      id: "claude-code",
      name: "Claude Code",
      sessionId: "session-123"
    },
    host: {
      id: "conductor",
      name: "Conductor",
      sessionId: "conductor-session-123"
    }
  });
});

test("does not detect Conductor when it runs Codex", () => {
  // Conductor starts Codex without its CONDUCTOR_* variables.
  const result = detectAgent({
    env: {
      CODEX_CI: "1",
      CODEX_SESSION_ID: "codex-session-123",
      CODEX_THREAD_ID: "codex-thread-123"
    }
  });

  assert.deepEqual(result, {
    detected: true,
    agent: {
      id: "codex",
      name: "Codex",
      sessionId: "codex-thread-123"
    }
  });
});

test("reports a host without an agent", () => {
  const result = detectAgent({
    env: {
      T3CODE_THREAD_ID: "thread-456"
    }
  });

  assert.deepEqual(result, {
    detected: false,
    host: {
      id: "t3-code",
      name: "T3 Code",
      sessionId: "thread-456"
    }
  });
});

test("normalizes session ids across agent-specific environment variables", () => {
  const result = detectAgent({
    env: {
      CURSOR_AGENT: "1",
      CURSOR_CONVERSATION_ID: "conversation-123"
    }
  });

  assert.equal(result.detected, true);
  assert.deepEqual(result.agent, {
    id: "cursor",
    name: "Cursor",
    sessionId: "conversation-123"
  });
});

test("detects kiro and normalizes its session id", () => {
  const result = detectAgent({
    env: {
      KIRO_SESSION_ID: "a537a99b-b87d-450b-ace9-74231e3f4fe8"
    }
  });

  assert.equal(result.detected, true);
  assert.deepEqual(result.agent, {
    id: "kiro",
    name: "Kiro",
    sessionId: "a537a99b-b87d-450b-ace9-74231e3f4fe8"
  });
});

test("detects replit and normalizes its session id", () => {
  const result = detectAgent({
    env: {
      REPLIT_SESSION: "session-123"
    }
  });

  assert.equal(result.detected, true);
  assert.deepEqual(result.agent, {
    id: "replit",
    name: "Replit",
    sessionId: "session-123"
  });
});

test("detects grok and normalizes its session id", () => {
  const result = detectAgent({
    env: {
      GROK_AGENT: "1",
      GROK_SESSION_ID: "01a035a8-166c-7771-8e5e-f67e0dd98c83"
    }
  });

  assert.equal(result.detected, true);
  assert.deepEqual(result.agent, {
    id: "grok",
    name: "Grok",
    sessionId: "01a035a8-166c-7771-8e5e-f67e0dd98c83"
  });
});

test("detects Grok Bot from SAND_BOX_BOOT_ID and normalizes the conversation id", () => {
  const result = detectAgent({
    env: {
      CURSOR_AGENT: "1",
      CURSOR_CONVERSATION_ID: "conversation-123",
      SAND_BOX_BOOT_ID: "boot-456"
    }
  });

  assert.equal(result.detected, true);
  assert.deepEqual(result.agent, {
    id: "grok-bot",
    name: "Grok Bot",
    sessionId: "conversation-123"
  });
});

test("detects cursor from CURSOR_AGENT without Grok Bot signals", () => {
  const result = detectAgent({
    env: {
      CURSOR_AGENT: "1",
      CURSOR_CONVERSATION_ID: "conversation-123"
    }
  });

  assert.equal(result.detected, true);
  assert.deepEqual(result.agent, {
    id: "cursor",
    name: "Cursor",
    sessionId: "conversation-123"
  });
});

test("detects Grok Bot from SAND_BOX_STORE_ID alone", () => {
  const result = detectAgent({
    env: {
      SAND_BOX_STORE_ID: "store-789"
    }
  });

  assert.equal(result.detected, true);
  assert.deepEqual(result.agent, {
    id: "grok-bot",
    name: "Grok Bot"
  });
});

test("detects Devin from any known environment variable", () => {
  for (const env of [{ DEVIN_DIR: "/opt/.devin" }, { DEVIN_DISABLE_HISTEXPAND: "1" }]) {
    const result = detectAgent({ env });

    assert.equal(result.detected, true);
    assert.deepEqual(result.agent, {
      id: "devin",
      name: "Devin"
    });
  }
});

test("detects Factory Droid from FACTORY_ENV", () => {
  const result = detectAgent({
    env: {
      FACTORY_ENV: "production"
    }
  });

  assert.equal(result.detected, true);
  assert.deepEqual(result.agent, {
    id: "droid",
    name: "Factory Droid"
  });
});

test("detects rork from RORK_API_URL", () => {
  const result = detectAgent({
    env: {
      RORK_API_URL: "https://api.rork.com"
    }
  });

  assert.equal(result.detected, true);
  assert.deepEqual(result.agent, {
    id: "rork",
    name: "Rork"
  });
});

test("detects Muse Code from MUSE_RELEASE_INFO", () => {
  const result = detectAgent({
    env: {
      MUSE_RELEASE_INFO: JSON.stringify({
        channel: "muse-stable",
        version: "0.1.0-R708.1"
      })
    }
  });

  assert.equal(result.detected, true);
  assert.deepEqual(result.agent, {
    id: "muse",
    name: "Muse Code"
  });
});

test("detects Muse from JARVIS_HATCHLING_ID and normalizes its session id", () => {
  const result = detectAgent({
    env: {
      JARVIS_HATCHLING_ID: "hatchling-123",
      JARVIS_SESSION_ID: "session-456"
    }
  });

  assert.equal(result.detected, true);
  assert.deepEqual(result.agent, {
    id: "muse-agent",
    name: "Muse",
    sessionId: "session-456"
  });
});

test("detects Muse from HATCH_API_SOCKET alone", () => {
  const result = detectAgent({
    env: {
      HATCH_API_SOCKET: "/run/hatch/daemon/http-api.sock"
    }
  });

  assert.equal(result.detected, true);
  assert.deepEqual(result.agent, {
    id: "muse-agent",
    name: "Muse"
  });
});

test("detects bolt from any known environment variable", () => {
  for (const envName of ["BOLT_ENV", "BOLT_ORIGIN", "BOLT_SERVER_URL"]) {
    const result = detectAgent({
      env: {
        [envName]: "1"
      }
    });

    assert.equal(result.detected, true);
    assert.deepEqual(result.agent, {
      id: "bolt",
      name: "Bolt"
    });
  }
});

test("detects opencode from any known environment variable", () => {
  for (const env of [{ OPENCODE: "1" }, { OPENCODE_PID: "12345" }]) {
    const result = detectAgent({ env });

    assert.equal(result.detected, true);
    assert.deepEqual(result.agent, {
      id: "opencode",
      name: "OpenCode"
    });
  }
});

test("default strategies only use environment variables", () => {
  assert.deepEqual(
    createDefaultStrategies().map((strategy) => strategy.name),
    ["environment"]
  );
});

test("does not detect unrelated environment variables", () => {
  const result = detectAgent({
    env: {
      PATH: "/usr/bin"
    }
  });

  assert.deepEqual(result, { detected: false });
});

test("custom agents can be added without custom detector code", () => {
  const result = detectAgent({
    agents: [
      {
        id: "example-agent",
        name: "Example Agent",
        env: [{ name: "EXAMPLE_AGENT", value: "yes" }]
      }
    ],
    env: {
      EXAMPLE_AGENT: "yes"
    },
    strategies: [new EnvironmentDetectionStrategy()]
  });

  assert.equal(result.detected, true);
  assert.equal(result.agent.id, "example-agent");
});

test("custom hosts can be added without custom detector code", () => {
  const result = detectAgent({
    hosts: [
      ...defaultHosts,
      {
        id: "example-host",
        name: "Example Host",
        env: [{ name: "EXAMPLE_HOST_THREAD_ID" }],
        sessionEnv: ["EXAMPLE_HOST_THREAD_ID"]
      }
    ],
    env: {
      CODEX_CI: "1",
      EXAMPLE_HOST_THREAD_ID: "thread-123"
    }
  });

  assert.equal(result.agent.id, "codex");
  assert.deepEqual(result.host, {
    id: "example-host",
    name: "Example Host",
    sessionId: "thread-123"
  });
});

test("custom strategies can report hosts", () => {
  const result = detectAgent({
    env: {},
    strategies: [
      {
        name: "custom",
        detect() {
          return [
            { agent: { id: "codex", name: "Codex" }, strategy: "custom", signal: "test" },
            { host: { id: "t3-code", name: "T3 Code" }, strategy: "custom", signal: "test" }
          ];
        }
      }
    ]
  });

  assert.equal(result.agent.id, "codex");
  assert.equal(result.host.id, "t3-code");
});

test("no agent definition uses the id of a host", () => {
  const hostIds = new Set(defaultHosts.map((host) => host.id));

  for (const agent of defaultAgents) {
    assert.equal(hostIds.has(agent.id), false, `${agent.id} is both an agent and a host`);
  }
});
