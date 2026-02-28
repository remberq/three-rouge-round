#!/usr/bin/env node
/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();

function fail(msg) {
  console.error(`docs-lint: ${msg}`);
  process.exitCode = 1;
}

function exists(rel) {
  return fs.existsSync(path.join(repoRoot, rel));
}

function read(rel) {
  return fs.readFileSync(path.join(repoRoot, rel), 'utf8');
}

const required = ['AGENTS.md', 'docs/INDEX.md', 'docs/STATUS.md'];

for (const f of required) {
  if (!exists(f)) fail(`missing required file: ${f}`);
}

const status = read('docs/STATUS.md');

// STATUS must link every EP in active/
const activeDir = path.join(repoRoot, 'docs/exec-plans/active');
const activeEps = fs
  .readdirSync(activeDir)
  .filter((f) => f.toLowerCase().endsWith('.md'))
  .map((f) => `exec-plans/active/${f}`);

if (activeEps.length === 0) {
  fail('no active execution plans found in docs/exec-plans/active');
}

for (const epRel of activeEps) {
  if (!status.includes(`(${epRel})`)) {
    fail(`docs/STATUS.md missing link to active EP: ${epRel}`);
  }

  // Each active EP must contain the harness-required sections.
  const epPath = path.join(repoRoot, 'docs', epRel);
  const ep = fs.readFileSync(epPath, 'utf8');
  for (const section of ['## Goal', '## Non-goals', '## Current state', '## Approach', '## Tasks', '## Tests']) {
    if (!ep.includes(section)) fail(`${epRel} missing section: ${section}`);
  }
}

const index = read('docs/INDEX.md');
for (const mustLink of ['product-specs/index.md', 'design-docs/index.md', 'STATUS.md', 'WORKLOG.md', 'exec-plans/active/']) {
  if (!index.includes(mustLink)) fail(`docs/INDEX.md missing link/reference to: ${mustLink}`);
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log('docs-lint: ok');
