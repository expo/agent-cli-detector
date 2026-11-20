# agent-cli-detector

Detect whether a JavaScript CLI is running inside a coding agent, and which
app runs that agent.

Please [open an issue](https://github.com/expo/agent-cli-detector/issues/new)
if your coding agent isn't properly detected :)

[![npm](https://img.shields.io/npm/v/agent-cli-detector.svg)](https://www.npmjs.com/package/agent-cli-detector)
[![Tests](https://github.com/expo/agent-cli-detector/actions/workflows/test.yml/badge.svg)](https://github.com/expo/agent-cli-detector/actions)

## Installation

```bash
npm install agent-cli-detector
```

## Usage

```js
import { detectAgent } from "agent-cli-detector";

const result = detectAgent();

if (result.detected) {
  console.log("The name of the coding agent is:", result.agent.name);
} else {
  console.log("This program is not running inside a coding agent");
}

if (result.host) {
  console.log("The agent runs inside:", result.host.name);
}
```

## Agents and hosts

The result has two parts:

- **Agent**: the harness that runs the model loop and executes commands,
  for example Claude Code or Codex.
- **Host**: the app that the user works in, which runs the agent,
  for example T3 Code. One host can run different agents.

When an agent runs directly in a terminal, there is no host.

## Supported agents

Officially supported coding agents:

| Name                                                              | ID            | Session ID |
| ----------------------------------------------------------------- | ------------- | ---------- |
| [Antigravity](https://antigravity.google/)                        | `antigravity` | ✅         |
| [Bolt](https://bolt.new/)                                          | `bolt`        | 🚫         |
| [Claude Code](https://claude.com/claude-code)                     | `claude-code` | ✅         |
| [Cline](https://cline.bot/)                                       | `cline`       | 🚫         |
| [Codex](https://developers.openai.com/codex/)                     | `codex`       | ✅         |
| [Cursor](https://cursor.com/)                                     | `cursor`      | ✅         |
| [Devin](https://devin.ai/)                                        | `devin`       | 🚫         |
| [Factory Droid](https://docs.factory.ai/droid-cli/overview)       | `droid`       | 🚫         |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli)         | `gemini`      | 🚫         |
| [GitHub Copilot CLI](https://github.com/github/copilot-cli)       | `copilot`     | ✅         |
| [Grok](https://x.ai/build)                                        | `grok`        | ✅         |
| [Grok Bot](https://x.ai/bot)                                      | `grok-bot`    | ✅         |
| [Kilo Code](https://kilocode.ai/)                                 | `kilocode`    | ✅         |
| [Kiro](https://kiro.dev/)                                         | `kiro`        | ✅         |
| [Muse](https://muse.ai/)                                          | `muse-agent`  | ✅         |
| [Muse Code][muse-code]                                            | `muse`        | 🚫         |
| [OpenCode](https://opencode.ai/)                                  | `opencode`    | 🚫         |
| [Pi](https://github.com/badlogic/pi-mono)                         | `pi`          | 🚫         |
| [Replit](https://replit.com/)                                      | `replit`      | ✅         |
| [Rork](https://rork.com/)                                          | `rork`        | 🚫         |

[muse-code]: https://developer.meta.com/ai/products/muse-code/

## Supported hosts

| Name                                               | ID              | Session ID |
| -------------------------------------------------- | --------------- | ---------- |
| [Claude Cowork](https://claude.com/product/cowork) | `claude-cowork` | 🚫         |
| [Conductor](https://www.conductor.build/)          | `conductor`     | ✅         |
| [T3 Code](https://t3.codes/)                       | `t3-code`       | ✅         |

Conductor gives its `CONDUCTOR_*` variables to Claude Code, but not to
Codex. So Conductor is not detected when it runs Codex.

Detection is data-driven: the exact environment variables live in
[`src/agents.ts`](src/agents.ts) for agents and in
[`src/hosts.ts`](src/hosts.ts) for hosts.

OpenCode is detected from version 1.0.19.

## API

### `detectAgent([options])`

Runs detection and returns a `DetectionResult`:

```js
{
  detected: true,
  agent: {
    id: "claude-code",
    name: "Claude Code",
    sessionId: "d9e9cd60-2e1c-487c-9bc7-fceee5e9c3a2"
  },
  host: {
    id: "t3-code",
    name: "T3 Code",
    sessionId: "a1b2c3d4-0000-4000-8000-000000000000"
  }
}
```

`host` is omitted when no host is detected.

### `result.detected`

A boolean. Will be `true` if the code is running inside a coding agent,
otherwise `false`.

### `result.agent.id`

A stable identifier for the detected agent (see the ID column in the
support table above). Prefer comparing against this instead of
`result.agent.name`.

### `result.agent.name`

A string containing the display name of the detected coding agent.

Don't depend on the value of this string not to change for a specific
agent. If you find yourself writing `result.agent.name === "Claude Code"`,
you most likely want to use `result.agent.id === "claude-code"` instead.

### `result.agent.sessionId`

A string containing the agent's session identifier, normalized from
agent-specific environment variables such as `CODEX_THREAD_ID`,
`CURSOR_CONVERSATION_ID`, `CLAUDE_CODE_SESSION_ID`,
`ANTIGRAVITY_TRAJECTORY_ID`, `KIRO_SESSION_ID`, `KILO_RUN_ID`, and
`COPILOT_AGENT_SESSION_ID`, `REPLIT_SESSION`, `GROK_SESSION_ID`, and
`JARVIS_SESSION_ID`.
Omitted when the agent doesn't expose one
(see the Session ID column in the support table above).

### `result.host`

The app that runs the agent, or `undefined` when no host is detected.
`result.host` does not change `result.detected`. A host signal alone does
not prove that an agent started the process, so `result.host` can be
present when `result.detected` is `false`.

### `result.host.id`

A stable identifier for the detected host (see the ID column in the
hosts table above). Prefer comparing against this instead of
`result.host.name`.

### `result.host.name`

A string containing the display name of the detected host.

### `result.host.sessionId`

A string containing the host's own session or thread identifier, for
example `T3CODE_THREAD_ID` or `CONDUCTOR_SESSION_ID`. It is different from
`result.agent.sessionId`.
Omitted when the host doesn't expose one.

### `isRunningFromAgent([options])`

A convenience shortcut that returns `result.detected` as a boolean:

```js
import { isRunningFromAgent } from "agent-cli-detector";

if (isRunningFromAgent()) {
  // Adjust CLI behavior for agent-driven execution.
}
```

## CLI

The package also ships a CLI:

```bash
npx agent-cli-detector
# detected: Claude Code (host: T3 Code)

npx agent-cli-detector --json
```

Exit codes:

- `0`: a coding agent was detected
- `1`: no coding agent was detected

## Custom agents

Add an agent by supplying an `AgentDefinition`:

```js
import { detectAgent, defaultAgents } from "agent-cli-detector";

const result = detectAgent({
  agents: [
    ...defaultAgents,
    {
      id: "my-agent",
      name: "My Agent",
      env: [{ name: "MY_AGENT", value: "1" }]
    }
  ]
});
```

## Custom hosts

Add a host by supplying a `HostDefinition`. It has the same fields as an
`AgentDefinition`:

```js
import { detectAgent, defaultHosts } from "agent-cli-detector";

const result = detectAgent({
  hosts: [
    ...defaultHosts,
    {
      id: "my-app",
      name: "My App",
      env: [{ name: "MY_APP_THREAD_ID" }],
      sessionEnv: ["MY_APP_THREAD_ID"]
    }
  ]
});
```

## Custom strategies

Add a detection strategy by implementing `DetectionStrategy`:

```ts
import type { DetectionStrategy } from "agent-cli-detector";

const strategy: DetectionStrategy = {
  name: "my-strategy",
  detect(context) {
    // Return { agent: { id, name }, strategy, signal } for agent evidence,
    // or { host: { id, name }, strategy, signal } for host evidence.
    return [];
  }
};
```

## License

[MIT](LICENSE)
