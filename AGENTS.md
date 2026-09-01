# Bilingual site requirements

The public site is bilingual in English and Spanish. Treat both languages as one product.

- Every new or changed public page must have both an English and a Spanish experience. Prefer a Spanish counterpart under `production-src/website/es/` with the same relative path; when an existing original is a PDF or another document, use an explicit counterpart as described below.
- Translate for meaning, tone, and natural Spanish. Do not produce literal word-for-word Spanish when a fluent writer would phrase the idea differently.
- Keep claims, citations, code, proper names, technical commands, dates, and factual details aligned across both versions.
- Every page must load `/js/language-init.js` in the document head and `/js/main.js` before the closing body tag.
- Preserve the automatic language behavior: a saved manual choice wins; otherwise, an English page redirects to Spanish when Spanish is the browser's first supported language. Direct Spanish URLs remain Spanish unless the visitor previously chose English.
- Keep the language switch available in the primary navigation. Do not add a second competing language control.
- When a page has a nonstandard counterpart path, set `<meta name="language-counterpart" content="...">` so switching languages remains reliable.
- Add natural Spanish equivalents for navigation labels, metadata, alt text, accessibility labels, status text, installation instructions, and generated reading controls—not only visible paragraphs.
- New essays, papers, project explanations, tools, downloads, and code explanations are incomplete until their Spanish pages are written and linked.
- Run the site build and bilingual validation before publishing. Test automatic detection and manual switching in both directions on desktop and mobile widths.
