import assert from "node:assert/strict";
import test from "node:test";
import {
  createDefaultStrategies,
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

test("detects Claude Cowork before Claude Code and normalizes its session id", () => {
  const result = detectAgent({
    env: {
      CLAUDECODE: "1",
      CLAUDE_CODE_IS_COWORK: "1",
      CLAUDE_CODE_SESSION_ID: "session-123"
    }
  });

  assert.equal(result.detected, true);
  assert.deepEqual(result.agent, {
    id: "claude-cowork",
    name: "Claude Cowork",
    sessionId: "session-123"
  });
});

test("detects Claude Code without Cowork signals", () => {
  const result = detectAgent({
    env: {
      CLAUDECODE: "1",
      CLAUDE_CODE_SESSION_ID: "session-123"
    }
  });

  assert.equal(result.detected, true);
  assert.deepEqual(result.agent, {
    id: "claude-code",
    name: "Claude Code",
    sessionId: "session-123"
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

  assert.equal(result.detected, false);
  assert.equal(result.agent, undefined);
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
