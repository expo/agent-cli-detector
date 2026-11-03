# Crush detection evidence

Reviewed 2026-11-03: the [current producer documentation](https://github.com/charmbracelet/crush/blob/3b1f8604f0027cf5fa47f29a27655ef1aeed8d8f/docs/hooks/README.md) describes CRUSH as an execution sentinel in hook and bash-tool child environments. This supersedes the older no-marker conclusion for the documented paths; it does not imply that older versions or every interface inject it. Non-empty matching remains this detector's heuristic.

Investigated while maintaining [Detect Agent](https://github.com/ai-shifu/detect-agent), a community specification with shared synthetic cases. [Pinned rule and evidence record](https://github.com/ai-shifu/detect-agent/blob/c06e732d17d02f74fd9b452f20c4fa17a9f95a03/detect-agent.md).

Adopted signal: non-empty `CRUSH`.

The rule was first investigated through detector registries; the pinned producer documentation above now supplies a direct public reference for hook/bash paths.

Ordinary markers require a non-empty string without trimming or boolean parsing; exact comparisons and conjunctions are preserved. The entry order preserves more specific compatibility markers and places inherited host markers after native coding-agent markers.

The test inputs are synthetic. No fresh live vendor session was run for this contribution. Reported or static observations do not establish every build, interface or operating system. Markers can be inherited or set manually and do not authenticate the immediate caller. The normal detection result adds no marker values, credentials, user paths or session identifiers. Existing diagnostic APIs retain their upstream behavior. There is no runtime dependency on Detect Agent or new process-tree probe.
