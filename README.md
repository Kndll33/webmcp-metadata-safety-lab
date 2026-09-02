# MetaFence — WebMCP Metadata Safety Lab

MetaFence is a security-first WebMCP demonstration for human/agent metadata triage. Agents receive only structural signals—record IDs, lengths, risk labels, and reason codes—while raw untrusted metadata remains visible only in a human review panel.

Live app: https://kndll33.github.io/webmcp-metadata-safety-lab/

The live page opens with a 60-second evaluator path that exercises all four WebMCP boundary decisions in order: safe summary, bounded quarantine staging, human-only raw review, and human-confirmed export.

Narrated 85-second demo: available as the `metafence-webmcp-demo.mp4` asset on the latest GitHub release. Upload-ready corrected English captions are in [`demo-assets/metafence-webmcp-demo.en.srt`](demo-assets/metafence-webmcp-demo.en.srt).

## Why WebMCP

Metadata is useful input for agents, but it can also contain prompt injection, secret requests, active markup, and external command URLs. MetaFence registers four explicit browser tools instead of asking an agent to infer controls or ingest every raw string:

- `summarize_metadata_risk`: counts only; raw text excluded.
- `stage_metadata_review`: stages a bounded visible queue with structural fields.
- `request_human_metadata_review`: opens one raw value in the human UI but does not return it to the agent.
- `stage_safe_csv_export`: prepares structural rows; a human click is still required to download.

No tool can approve, rewrite, publish, transmit secrets, or silently download data. The ordinary human UI remains functional when WebMCP is unavailable.

## Run

Serve this directory over HTTP:

```bash
python3 -m http.server 8765
```

Open `http://127.0.0.1:8765/` in Chrome 149+ with `chrome://flags/#enable-webmcp-testing` enabled, or use ChatGPT's WebMCP-capable in-app browser.

Inspect registered tools in the console:

```js
await document.modelContext.getTools()
```

Chrome's current testing implementation accepts serialized input when invoking a tool directly from DevTools:

```js
const tools = await document.modelContext.getTools();
const tool = tools.find(t => t.name === 'stage_metadata_review');
await document.modelContext.executeTool(tool, JSON.stringify({risk: 'quarantine', maxRecords: 3}));
```

## Tests

```bash
node --test core.test.mjs
node --check app.mjs
node --check core.mjs
```

The focused suite verifies quarantine detection, raw-text exclusion from safe projections/CSV, bounded filters, and count reconciliation.

## Data and safety boundaries

- Eight original synthetic records only; no customer or personal data.
- No network calls, accounts, authentication, secrets, store access, purchases, or ranking claims.
- The 70–160 length range is a review cue, not a fixed Google limit or snippet promise.
- WebMCP is a progressive enhancement; the visible controls work without it.

## Judging-criteria map

- **WebMCP leverage:** four schema-bounded imperative tools are registered and exercised; agent-visible results intentionally exclude raw untrusted descriptions.
- **Execution:** polished responsive UI, progressive enhancement, visible event log, human-only review, human-confirmed export, tests, and a reproducible live verification artifact.
- **Potential impact:** metadata pipelines are a concrete place where agents encounter attacker-controlled text; MetaFence demonstrates a reusable least-authority pattern.
- **Creativity & ambition:** the app treats WebMCP as a safety boundary rather than merely a faster substitute for clicks.

## Hackathon provenance

This repository and application were created during the OpenAI WebMCP Challenge submission period, after August 25, 2026. The implementation follows the draft WebMCP API and Chrome developer documentation linked below.

- Challenge: https://webmcp.devpost.com/
- Official rules: https://webmcp.devpost.com/rules
- Chrome WebMCP docs: https://developer.chrome.com/docs/ai/webmcp
- Draft specification: https://webmachinelearning.github.io/webmcp/

MIT licensed. See `LICENSE`.
