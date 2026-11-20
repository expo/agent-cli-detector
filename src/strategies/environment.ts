import type {
  AgentDefinition,
  DetectionContext,
  DetectionEvidence,
  DetectionStrategy,
  EnvSignal,
  EnvValueMatcher,
  HostDefinition
} from "../types.js";

export class EnvironmentDetectionStrategy implements DetectionStrategy {
  readonly name = "environment";

  detect(context: DetectionContext): readonly DetectionEvidence[] {
    const matches: DetectionEvidence[] = [];

    for (const agent of context.agents) {
      for (const { signal, value } of matchEnv(agent, context.env)) {
        matches.push({ agent: { id: agent.id, name: agent.name }, ...toEvidence(signal, value) });
      }
    }

    for (const host of context.hosts ?? []) {
      for (const { signal, value } of matchEnv(host, context.env)) {
        matches.push({ host: { id: host.id, name: host.name }, ...toEvidence(signal, value) });
      }
    }

    return matches;
  }
}

function matchEnv(
  definition: AgentDefinition | HostDefinition,
  env: NodeJS.ProcessEnv
): readonly { readonly signal: EnvSignal; readonly value: string }[] {
  const matches: { signal: EnvSignal; value: string }[] = [];

  for (const signal of definition.env ?? []) {
    const value = env[signal.name];

    if (value !== undefined && matchesEnvValue(value, signal.value)) {
      matches.push({ signal, value });
    }
  }

  return matches;
}

function matchesEnvValue(value: string, matcher: EnvValueMatcher | undefined): boolean {
  if (matcher === undefined) {
    return true;
  }

  if (typeof matcher === "string") {
    return value === matcher;
  }

  if (matcher instanceof RegExp) {
    return matcher.test(value);
  }

  return matcher(value);
}

function toEvidence(signal: EnvSignal, value: string) {
  return {
    strategy: "environment",
    signal: signal.name,
    value
  };
}
