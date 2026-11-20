import { defaultAgents } from "./agents.js";
import { defaultHosts } from "./hosts.js";
import { EnvironmentDetectionStrategy } from "./strategies/environment.js";
import type {
  AgentDefinition,
  DetectAgentOptions,
  DetectedAgent,
  DetectedHost,
  DetectionContext,
  DetectionEvidence,
  DetectionResult,
  DetectionStrategy,
  HostDefinition
} from "./types.js";

export function detectAgent(options: DetectAgentOptions = {}): DetectionResult {
  const agents = options.agents ?? defaultAgents;
  const hosts = options.hosts ?? defaultHosts;
  const strategies = options.strategies ?? createDefaultStrategies();
  const context: DetectionContext = {
    env: options.env ?? process.env,
    agents,
    hosts
  };

  const matches = strategies.flatMap((strategy) => strategy.detect(context));
  const agent = selectBest(agents, agentIds(matches), context.env);
  const host = selectBest(hosts, hostIds(matches), context.env);

  return {
    detected: agent !== undefined,
    ...(agent === undefined ? {} : { agent }),
    ...(host === undefined ? {} : { host })
  };
}

export function isRunningFromAgent(options: DetectAgentOptions = {}): boolean {
  return detectAgent(options).detected;
}

export function createDefaultStrategies(): readonly DetectionStrategy[] {
  return [new EnvironmentDetectionStrategy()];
}

function agentIds(matches: readonly DetectionEvidence[]): ReadonlySet<string> {
  return new Set(matches.flatMap((match) => (match.agent === undefined ? [] : [match.agent.id])));
}

function hostIds(matches: readonly DetectionEvidence[]): ReadonlySet<string> {
  return new Set(matches.flatMap((match) => (match.host === undefined ? [] : [match.host.id])));
}

/**
 * Returns the first definition in list order that has evidence.
 * The list order sets the priority between definitions.
 */
function selectBest(
  definitions: readonly (AgentDefinition | HostDefinition)[],
  matchedIds: ReadonlySet<string>,
  env: NodeJS.ProcessEnv
): DetectedAgent | DetectedHost | undefined {
  const definition = definitions.find((candidate) => matchedIds.has(candidate.id));

  if (definition === undefined) {
    return undefined;
  }

  return {
    id: definition.id,
    name: definition.name,
    ...sessionIdProperties(definition.sessionEnv, env)
  };
}

function sessionIdProperties(
  sessionEnv: readonly string[] | undefined,
  env: NodeJS.ProcessEnv
): { readonly sessionId?: string } {
  for (const envName of sessionEnv ?? []) {
    const value = env[envName];

    if (value !== undefined && value.length > 0) {
      return { sessionId: value };
    }
  }

  return {};
}
