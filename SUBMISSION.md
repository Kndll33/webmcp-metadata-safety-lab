# MetaFence — Devpost submission copy

## Tagline

Security-first metadata triage where agents see structural risk and humans retain raw-text review and export control.

## What it does

MetaFence demonstrates a safer boundary for agent-native web applications. Eight synthetic metadata records include clear text, missing descriptions, length review cues, embedded instructions, secret requests, active markup, and external command URLs. A deterministic scanner assigns structural reason codes before any agent tool response is created.

Four WebMCP tools let an agent summarize risk, stage a bounded visible queue, ask a human to inspect one record, and stage a safe CSV. Raw descriptions are deliberately omitted from every agent-facing result. Opening raw text happens only in the visible human panel, and downloading still requires a human click. No tool can approve, rewrite, publish, transmit, or silently download anything.

## Why this is a strong fit for WebMCP

Without WebMCP, an agent has to inspect UI elements and may ingest the exact metadata that is trying to manipulate it. WebMCP lets the page declare a smaller, typed, auditable capability surface. The agent can act reliably on deterministic structural signals while the person sees every staged change in the same interface.

## Better user experience

A human can filter and inspect records manually in any modern browser. In a WebMCP-capable browser, an agent can reduce a mixed queue to the three riskiest records, visibly open one for review, and prepare an export without taking the final action. The event log makes every agent-induced UI change observable.

## What people and agents can do together

The agent handles repetitive classification and bounded queue preparation. The person evaluates untrusted text in context and confirms any download. This division is difficult to guarantee with generic click automation because the capability boundary and raw-data policy are implicit; here they are encoded in tool schemas and return values.

## WebMCP implementation

`app.mjs` registers four tools with `document.modelContext.registerTool`. Each tool has a narrow JSON schema, length/enumeration bounds, a visible UI effect where applicable, and a deliberately non-destructive result. `core.mjs` holds deterministic scanning and safe-projection logic. The app progressively degrades to a complete human UI if `document.modelContext` is unavailable.

## URLs

- Live app: https://kndll33.github.io/webmcp-metadata-safety-lab/
- Public code: https://github.com/Kndll33/webmcp-metadata-safety-lab

## Testing

The live page opens with a 60-second evaluator path that sequences all four WebMCP decisions and maps the observed boundary to the four official judging criteria. Five Node tests pass. A live Chrome/WebMCP exercise registered all four tools, returned an 8-record summary, staged three quarantine records, opened one human-only raw review, and staged four safe CSV rows with `humanConfirmationRequired: true` and `downloaded: false`.

## Built during the submission period

The repository and all project code were created during the challenge submission period. Synthetic records and copy are original. No external API, proprietary dataset, or third-party runtime dependency is used.
