#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const languageScript = fs.readFileSync(path.join(projectRoot, 'production-src/assets/js/language-init.js'), 'utf8');

function runLanguageInitializer({ href, pageLanguage = 'en', browserLanguages = ['en-US'], savedLanguage = null, explicitCounterpart = null }) {
  const url = new URL(href);
  const storage = new Map(savedLanguage ? [['tommy-site-language', savedLanguage]] : []);
  let redirect = null;

  const location = {
    href: url.href,
    pathname: url.pathname,
    protocol: url.protocol,
    replace(value) { redirect = value; }
  };
  const localStorage = {
    getItem(key) { return storage.get(key) ?? null; },
    setItem(key, value) { storage.set(key, value); }
  };
  const document = {
    documentElement: { lang: pageLanguage },
    querySelector(selector) {
      if (selector === 'meta[name="language-counterpart"]' && explicitCounterpart) {
        return { content: explicitCounterpart };
      }
      return null;
    }
  };
  const window = { location, localStorage };
  const context = {
    window,
    document,
    navigator: { languages: browserLanguages, language: browserLanguages[0] },
    URL,
    Set
  };
  vm.runInNewContext(languageScript, context);
  return { redirect, api: window.TommyLanguage, storage };
}

const spanishBrowser = runLanguageInitializer({
  href: 'https://tommynicol.com/about.html?from=test#focus',
  browserLanguages: ['es-MX', 'en-US']
});
assert.equal(spanishBrowser.redirect, 'https://tommynicol.com/es/about.html?from=test#focus');

const englishBrowser = runLanguageInitializer({
  href: 'https://tommynicol.com/projects.html',
  browserLanguages: ['en-US', 'es']
});
assert.equal(englishBrowser.redirect, null);

const directSpanishVisit = runLanguageInitializer({
  href: 'https://tommynicol.com/es/tools.html',
  pageLanguage: 'es',
  browserLanguages: ['en-US']
});
assert.equal(directSpanishVisit.redirect, null);

const savedSpanish = runLanguageInitializer({
  href: 'https://tommynicol.com/blog.html',
  browserLanguages: ['en-US'],
  savedLanguage: 'es'
});
assert.equal(savedSpanish.redirect, 'https://tommynicol.com/es/blog.html');

const savedEnglish = runLanguageInitializer({
  href: 'https://tommynicol.com/es/contact.html',
  pageLanguage: 'es',
  browserLanguages: ['es'],
  savedLanguage: 'en'
});
assert.equal(savedEnglish.redirect, 'https://tommynicol.com/contact.html');

const explicitPdfCounterpart = runLanguageInitializer({
  href: 'https://tommynicol.com/es/papers/meaning-of-life.html',
  pageLanguage: 'es',
  browserLanguages: ['es'],
  explicitCounterpart: '/papers/files/what-is-the-meaning-of-life.pdf'
});
assert.equal(explicitPdfCounterpart.api.counterpartUrl('en'), 'https://tommynicol.com/papers/files/what-is-the-meaning-of-life.pdf');

const missingPageInSpanish = runLanguageInitializer({
  href: 'https://tommynicol.com/a-page-that-does-not-exist',
  browserLanguages: ['es'],
  explicitCounterpart: '/es/404.html'
});
assert.equal(missingPageInSpanish.redirect, 'https://tommynicol.com/es/404.html');

const localSpanishPage = runLanguageInitializer({
  href: 'file:///Users/test/site/production-src/website/es/about.html',
  pageLanguage: 'es',
  browserLanguages: ['es']
});
assert.equal(localSpanishPage.api.counterpartUrl('en'), 'file:///Users/test/site/production-src/website/about.html');

const localExplicitCounterpart = runLanguageInitializer({
  href: 'file:///Users/test/site/production-src/website/es/papers/meaning-of-life.html',
  pageLanguage: 'es',
  browserLanguages: ['es'],
  explicitCounterpart: '/papers/files/what-is-the-meaning-of-life.pdf'
});
assert.equal(localExplicitCounterpart.api.counterpartUrl('en'), 'file:///Users/test/site/production-src/website/papers/files/what-is-the-meaning-of-life.pdf');

spanishBrowser.api.setPreference('en');
assert.equal(spanishBrowser.storage.get('tommy-site-language'), 'en');

console.log('Validated browser-language detection, saved preferences, URL mapping, and both switch directions.');
