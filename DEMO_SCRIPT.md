# MetaFence demo script (published cut: 1:20)

The published cut removes the title-only opening after the organizer’s final evaluator guidance asked entrants to show the project working in the first 10–15 seconds. It begins with the concrete metadata risk and reaches the working classified-record table at 00:11.8.

Official guidance: https://webmcp.devpost.com/updates/46161-2-days-left-and-what-judges-actually-look-for

## 0:00–0:12 — Risk and boundary

Explain that metadata can contain prompt injection, secret requests, or executable markup. State that MetaFence keeps raw content behind a visible human review boundary.

## 0:12–0:23 — Working human interface

Show eight synthetic records already classified as clear, review, or quarantine. The complete ordinary interface works without an agent.

## 0:23–0:44 — WebMCP staging

Show four registered tools. Invoke `stage_metadata_review` with a quarantine filter and a maximum of three records. The visible queue changes while the tool result returns IDs, lengths, risk labels, and reason codes, never raw descriptions.

## 0:44–1:02 — Human-only raw review

Request review of `instruction-001`. The raw injected instruction appears only in the visible human panel. The tool result says `rawTextReturnedToAgent: false`. There is no approve, rewrite, or publish tool.

## 1:02–1:16 — Human-confirmed export

Stage a safe quarantine CSV. Show four structural rows, `humanConfirmationRequired: true`, `downloaded: false`, and the explicit human download control.

## 1:16–1:20 — Close

“MetaFence makes agents useful without making untrusted content authoritative.”
