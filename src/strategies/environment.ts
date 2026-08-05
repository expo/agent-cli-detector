import type {
  AgentDefinition,
  DetectionContext,
  DetectionEvidence,
  DetectionStrategy,
  EnvSignal,
  EnvValueMatcher
} from "../types.js";

export class EnvironmentDetectionStrategy implements DetectionStrategy {
  readonly name = "environment";

  detect(context: DetectionContext): readonly DetectionEvidence[] {
    const matches: DetectionEvidence[] = [];
    const explicitMatch = matchExplicitAgent(context);

    if (explicitMatch !== undefined) {
      matches.push(explicitMatch);
    }

    for (const agent of context.agents) {
      for (const signal of agent.env ?? []) {
        const value = context.env[signal.name];

        if (
          value === undefined ||
          !matchesEnvValue(value, signal.value) ||
          (signal.condition !== undefined && !signal.condition(context.env))
        ) {
          continue;
        }

        matches.push(toEvidence(agent, signal, value));
      }
    }

    return matches;
  }
}

function matchExplicitAgent(context: DetectionContext): DetectionEvidence | undefined {
  const name = context.env.AI_AGENT?.trim();

  if (!name) {
    return undefined;
  }

  const knownAgent = context.agents.find(
    (agent) => agent.id === name || agent.aliases?.includes(name)
  );

  return {
    agent:
      knownAgent === undefined
        ? { id: name, name }
        : { id: knownAgent.id, name: knownAgent.name },
    strategy: "environment",
    signal: "AI_AGENT",
    value: name
  };
}

function matchesEnvValue(value: string, matcher: EnvValueMatcher | undefined): boolean {
  if (matcher === undefined) {
    return value.length > 0;
  }

  if (typeof matcher === "string") {
    return value === matcher;
  }

  if (matcher instanceof RegExp) {
    return matcher.test(value);
  }

  return matcher(value);
}

function toEvidence(agent: AgentDefinition, signal: EnvSignal, value: string): DetectionEvidence {
  return {
    agent: {
      id: agent.id,
      name: agent.name
    },
    strategy: "environment",
    signal: signal.name,
    value
  };
}
