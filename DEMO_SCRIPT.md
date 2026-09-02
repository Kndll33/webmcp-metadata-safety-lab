# MetaFence demo script (target 2:20)

## 0:00–0:20 — Problem

Show the full queue. Explain that metadata can contain useful content and prompt injection. Generic UI automation may expose the agent to the raw attack text.

## 0:20–0:40 — Human-first fallback

Show the risk counts and manually filter to `Quarantine`. Point out that the app works without an agent and that all records are synthetic.

## 0:40–1:05 — Tool discovery

Open the WebMCP-capable browser's agent or console. List the four registered tools. Highlight narrow schemas and the absence of approve, publish, transmit, or direct-download tools.

## 1:05–1:30 — Safe agent staging

Ask the agent to stage at most three quarantine records. Show the table changing visibly. Inspect the tool result: IDs, lengths, risk, and reasons appear; raw descriptions do not.

## 1:30–1:55 — Human review boundary

Ask the agent to request review of `instruction-001`. Show the raw injected instruction appearing only in the visible human panel. Show the tool response: `rawTextReturnedToAgent: false` and `nextStep: Ask the human to inspect the visible panel.`

## 1:55–2:15 — Confirmed export

Ask the agent to stage a safe quarantine CSV. Show `humanConfirmationRequired: true`, `downloaded: false`, and the explicit human download button. Do not click it until explaining the boundary.

## 2:15–2:20 — Close

“MetaFence uses WebMCP to make the safe path the easy path: agents triage structure, people decide on untrusted content.”
