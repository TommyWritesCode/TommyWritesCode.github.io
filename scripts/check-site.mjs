#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const siteRoot = path.join(projectRoot, 'dist');
const htmlFiles = [];
const errors = [];
const duplicateCopyPattern = /(?:^|\/)\S.* \d+\.html$/;

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
  const relativePath = path.relative(siteRoot, htmlPath).split(path.sep).join('/');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  for (const id of new Set(ids.filter((id, index) => ids.indexOf(id) !== index))) {
    errors.push(`${relativePath}: duplicate id "${id}"`);
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = resolveInternalReference(htmlPath, match[1]);
    if (!target) continue;
    try {
      const stat = await fs.stat(target);
      if (stat.isDirectory()) await fs.access(path.join(target, 'index.html'));
    } catch {
      errors.push(`${relativePath}: missing ${match[1]}`);
    }
  }

  // Finder-created duplicate copies in this working tree are not canonical public pages.
  if (duplicateCopyPattern.test(relativePath) || relativePath.startsWith('qa-')) continue;

  const isSpanish = relativePath.startsWith('es/');
  const expectedLanguage = isSpanish ? 'es' : 'en';
  const declaredLanguage = html.match(/<html\s[^>]*lang="([^"]+)"/i)?.[1]?.toLowerCase();
  if (!declaredLanguage?.startsWith(expectedLanguage)) {
    errors.push(`${relativePath}: expected <html lang="${expectedLanguage}">`);
  }

  if (!html.includes('language-init.js')) {
    errors.push(`${relativePath}: missing the early language initializer`);
  }
  if (!html.includes('main.js')) {
    errors.push(`${relativePath}: missing the shared navigation and language-switch script`);
  }
  if (!html.includes('data-nav-links')) {
    errors.push(`${relativePath}: missing the primary navigation target for the language switch`);
  }

  if (!isSpanish) {
    const spanishCounterpart = path.join(siteRoot, 'es', ...relativePath.split('/'));
    try {
      await fs.access(spanishCounterpart);
    } catch {
      errors.push(`${relativePath}: missing Spanish counterpart es/${relativePath}`);
    }
    continue;
  }

  const englishRelativePath = relativePath.slice(3);
  const englishCounterpart = path.join(siteRoot, ...englishRelativePath.split('/'));
  try {
    await fs.access(englishCounterpart);
  } catch {
    const explicitCounterpart = html.match(/<meta\s+name="language-counterpart"\s+content="([^"]+)"/i)?.[1];
    if (!explicitCounterpart) {
      errors.push(`${relativePath}: missing English counterpart or language-counterpart metadata`);
    } else {
      const target = resolveInternalReference(htmlPath, explicitCounterpart);
      try {
        await fs.access(target);
      } catch {
        errors.push(`${relativePath}: missing explicit English counterpart ${explicitCounterpart}`);
      }
    }
  }
}

if (errors.length) {
  console.error(`Site validation failed with ${errors.length} error(s):`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML files, internal links, and English/Spanish page parity.`);
