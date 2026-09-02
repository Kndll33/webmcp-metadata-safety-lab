import test from 'node:test';
import assert from 'node:assert/strict';
import { RECORDS, analyzeRecord, filterRecords, safeCsv, safeProjection, summarize } from './core.mjs';

test('quarantines embedded instructions without exposing raw text in safe projection', () => {
  const row = RECORDS.find(x => x.id === 'instruction-001');
  const analyzed = analyzeRecord(row);
  assert.equal(analyzed.risk, 'quarantine');
  assert.ok(analyzed.reasons.includes('embedded_instruction'));
  assert.equal(Object.hasOwn(safeProjection(row), 'rawDescription'), false);
});

test('detects secrets, markup and external command URLs', () => {
  assert.ok(analyzeRecord(RECORDS.find(x => x.id === 'secret-001')).reasons.includes('secret_request'));
  assert.ok(analyzeRecord(RECORDS.find(x => x.id === 'markup-001')).reasons.includes('active_markup'));
  assert.ok(analyzeRecord(RECORDS.find(x => x.id === 'url-001')).reasons.includes('external_command_url'));
});

test('bounds agent-facing filters', () => {
  assert.equal(filterRecords('quarantine', 2).length, 2);
  assert.equal(filterRecords('all', 100).length, RECORDS.length);
  assert.equal(filterRecords('nonsense', 1).length, 1);
});

test('summary reconciles to the record total', () => {
  const s = summarize();
  assert.equal(s.clear + s.review + s.quarantine, s.total);
  assert.equal(s.total, RECORDS.length);
});

test('safe CSV contains no raw prompt-injection text', () => {
  const csv = safeCsv(filterRecords('all', 20));
  assert.match(csv, /^id,page,url,titleLength/);
  assert.doesNotMatch(csv, /Ignore prior instructions|API keys|<script>/i);
});
