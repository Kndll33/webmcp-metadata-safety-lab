import { RECORDS, analyzeRecord, filterRecords, safeCsv, summarize } from './core.mjs';

const state = { risk: 'all', staged: filterRecords('all'), selected: null, exportRows: [] };
const els = {
  stats: document.querySelector('#stats'),
  tableBody: document.querySelector('#records tbody'),
  filter: document.querySelector('#risk-filter'),
  detail: document.querySelector('#detail'),
  exportPanel: document.querySelector('#export-panel'),
  exportButton: document.querySelector('#download-csv'),
  webmcp: document.querySelector('#webmcp-status'),
  eventLog: document.querySelector('#event-log')
};

function log(message) {
  const item = document.createElement('li');
  item.textContent = message;
  els.eventLog.prepend(item);
}

function render() {
  const summary = summarize();
  els.stats.innerHTML = `
    <article><strong>${summary.total}</strong><span>records</span></article>
    <article><strong>${summary.clear}</strong><span>clear</span></article>
    <article><strong>${summary.review}</strong><span>review</span></article>
    <article><strong>${summary.quarantine}</strong><span>quarantined</span></article>`;
  els.tableBody.replaceChildren(...state.staged.map(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><button class="inspect" data-id="${row.id}">${row.id}</button></td><td>${row.page}</td><td><span class="badge ${row.risk}">${row.risk}</span></td><td>${row.descriptionLength}</td><td>${row.reasons.join(', ') || 'none'}</td>`;
    return tr;
  }));
  document.querySelectorAll('.inspect').forEach(button => button.addEventListener('click', () => revealForHuman(button.dataset.id)));
}

function revealForHuman(id) {
  const record = RECORDS.find(x => x.id === id);
  if (!record) return false;
  const result = analyzeRecord(record);
  state.selected = id;
  els.detail.hidden = false;
  els.detail.querySelector('h3').textContent = `${record.page} — human review`;
  els.detail.querySelector('[data-field="url"]').textContent = record.url;
  els.detail.querySelector('[data-field="title"]').textContent = record.title;
  els.detail.querySelector('[data-field="description"]').textContent = result.rawDescription || '[missing]';
  els.detail.querySelector('[data-field="reasons"]').textContent = result.reasons.join(', ') || 'none';
  log(`Human-visible review opened for ${id}; raw text was not returned through WebMCP.`);
  return true;
}

function stageFilter(risk, maxRecords = 8) {
  state.risk = ['all','clear','review','quarantine'].includes(risk) ? risk : 'all';
  state.staged = filterRecords(state.risk, maxRecords);
  els.filter.value = state.risk;
  render();
  log(`Staged ${state.staged.length} ${state.risk} record(s) for human review.`);
  return state.staged;
}

function stageExport(risk = state.risk) {
  state.exportRows = filterRecords(risk, 20);
  els.exportPanel.hidden = false;
  els.exportPanel.querySelector('strong').textContent = `${state.exportRows.length} safe structural row(s) ready`;
  log('CSV export staged. A human click is required to download.');
  return state.exportRows;
}

els.filter.addEventListener('change', event => stageFilter(event.target.value));
els.exportButton.addEventListener('click', () => {
  const blob = new Blob([safeCsv(state.exportRows)], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `metafence-${state.risk}-review.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
  log('Human confirmed CSV download.');
});
document.querySelector('#stage-export').addEventListener('click', () => stageExport());

const tools = [
  {
    name: 'summarize_metadata_risk',
    description: 'Summarize structural metadata risk counts. Raw untrusted metadata is deliberately excluded.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    execute: async () => summarize()
  },
  {
    name: 'stage_metadata_review',
    description: 'Stage a bounded set of safe structural records in the visible page for human review. Does not reveal raw metadata or make changes.',
    inputSchema: { type: 'object', properties: { risk: { type: 'string', enum: ['all','clear','review','quarantine'] }, maxRecords: { type: 'integer', minimum: 1, maximum: 20 } }, required: ['risk'], additionalProperties: false },
    execute: async ({ risk, maxRecords = 8 }) => ({ staged: stageFilter(risk, maxRecords), userVisible: true, irreversibleAction: false })
  },
  {
    name: 'request_human_metadata_review',
    description: 'Open one record in the visible human-review panel. The tool response never contains the raw untrusted description.',
    inputSchema: { type: 'object', properties: { id: { type: 'string', maxLength: 64 } }, required: ['id'], additionalProperties: false },
    execute: async ({ id }) => ({ opened: revealForHuman(id), id, rawTextReturnedToAgent: false, nextStep: 'Ask the human to inspect the visible panel.' })
  },
  {
    name: 'stage_safe_csv_export',
    description: 'Prepare a structural CSV export and require a human click before download. Raw metadata is excluded.',
    inputSchema: { type: 'object', properties: { risk: { type: 'string', enum: ['all','clear','review','quarantine'] } }, required: ['risk'], additionalProperties: false },
    execute: async ({ risk }) => ({ rows: stageExport(risk).length, humanConfirmationRequired: true, downloaded: false })
  }
];

if (document.modelContext?.registerTool) {
  for (const tool of tools) document.modelContext.registerTool(tool);
  els.webmcp.textContent = `WebMCP active — ${tools.length} tools registered`;
  els.webmcp.classList.add('active');
  log('WebMCP tools registered.');
} else {
  els.webmcp.textContent = 'WebMCP unavailable in this browser; human UI remains fully functional.';
  log('WebMCP unavailable; rendered progressive-enhancement fallback.');
}

render();
