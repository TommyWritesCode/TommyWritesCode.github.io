#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

function getDateString() {
  return new Date().toISOString().split('T')[0];
}

async function scaffoldPost() {
  console.log('🚀 Creating new content...\n');
  
  const title = await question('Title: ');
  const type = await question('Type (philosophy/project): ');
  const tagline = await question('Tagline: ');
  
  const slug = slugify(title);
  const published = getDateString();
  
  const frontMatter = `---
title: "${title}"
slug: ${slug}
published: ${published}
category: ${type}
tagline: "${tagline}"
cover: /assets/covers/${slug}.jpg
${type === 'project' ? 'tech: ["React", "TypeScript", "Node.js"]' : ''}
---

# ${title}

Your content here...

## Section 1

Write your ${type === 'philosophy' ? 'philosophical exploration' : 'project description'} here.

## Section 2

${type === 'philosophy' ? 
  'Continue developing your argument...' : 
  'Technical implementation details...'}

${type === 'project' ? 
  '\n[Live Demo](https://example.com) | [Source Code](https://github.com/tommynicol/project)' : 
  '\n*This exploration continues...*'}`;

  const collection = type === 'project' ? 'projects' : 'philosophy';
  const contentDir = path.join(projectRoot, 'content', collection);
  const filePath = path.join(contentDir, `${slug}.md`);
  
  // Ensure directory exists
  await fs.mkdir(contentDir, { recursive: true });
  
  // Write the file
  await fs.writeFile(filePath, frontMatter);
  
  console.log(`\n✅ Created: ${filePath}`);
  console.log(`📝 Opening in VS Code...`);
  
  // Try to open in VS Code
  try {
    const { spawn } = await import('node:child_process');
    spawn('code', [filePath], { stdio: 'ignore', detached: true });
  } catch (error) {
    console.log('💡 Open manually:', filePath);
  }
  
  console.log('\n🔧 Next steps:');
  console.log('1. Write your content');
  console.log('2. Run: npm run build');
  console.log('3. Commit and push to deploy');
  
  rl.close();
}

scaffoldPost().catch(console.error);