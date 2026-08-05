import { existsSync } from "node:fs";
import type {
  AgentDefinition,
  DetectionContext,
  DetectionEvidence,
  DetectionStrategy,
  FileSystemSignal
} from "../types.js";

export interface FileSystemReader {
  exists(path: string): boolean;
}

export class NodeFileSystemReader implements FileSystemReader {
  exists(path: string): boolean {
    return existsSync(path);
  }
}

export class FileSystemDetectionStrategy implements DetectionStrategy {
  readonly name = "filesystem";

  constructor(private readonly reader: FileSystemReader = new NodeFileSystemReader()) {}

  detect(context: DetectionContext): readonly DetectionEvidence[] {
    const matches: DetectionEvidence[] = [];

    for (const agent of context.agents) {
      for (const signal of agent.filesystem ?? []) {
        if (!this.pathExists(signal.path)) {
          continue;
        }

        matches.push(toEvidence(agent, signal));
      }
    }

    return matches;
  }

  private pathExists(path: string): boolean {
    try {
      return this.reader.exists(path);
    } catch {
      return false;
    }
  }
}

function toEvidence(agent: AgentDefinition, signal: FileSystemSignal): DetectionEvidence {
  return {
    agent: {
      id: agent.id,
      name: agent.name
    },
    strategy: "filesystem",
    signal: signal.path,
    value: signal.path
  };
}
