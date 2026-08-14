#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const siteRoot = path.join(projectRoot, 'dist');
const htmlFiles = [];
const errors = [];

async function collectHtml(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await collectHtml(entryPath);
    if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(entryPath);
  }
}

function resolveInternalReference(htmlPath, reference) {
  const cleanReference = reference.split(/[?#]/, 1)[0];
  if (!cleanReference || /^(?:[a-z]+:|\/\/|#)/i.test(reference)) return null;
  if (cleanReference.startsWith('/')) return path.join(siteRoot, cleanReference.slice(1));
  return path.resolve(path.dirname(htmlPath), cleanReference);
}

await collectHtml(siteRoot);

for (const htmlPath of htmlFiles) {
  const html = await fs.readFile(htmlPath, 'utf8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  for (const id of new Set(ids.filter((id, index) => ids.indexOf(id) !== index))) {
    errors.push(`${path.relative(siteRoot, htmlPath)}: duplicate id "${id}"`);
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = resolveInternalReference(htmlPath, match[1]);
    if (!target) continue;
    try {
      const stat = await fs.stat(target);
      if (stat.isDirectory()) await fs.access(path.join(target, 'index.html'));
    } catch {
      errors.push(`${path.relative(siteRoot, htmlPath)}: missing ${match[1]}`);
    }
  }
}

if (errors.length) {
  console.error(`Site validation failed with ${errors.length} error(s):`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML files with no broken internal references or duplicate IDs.`);
