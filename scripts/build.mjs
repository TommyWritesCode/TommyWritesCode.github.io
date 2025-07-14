#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

// Configure marked with better options
marked.setOptions({
  gfm: true,
  breaks: true,
  sanitize: false,
  highlight: function(code, lang) {
    // Simple syntax highlighting placeholder
    return `<pre><code class="language-${lang}">${code}</code></pre>`;
  }
});

async function buildContent() {
  const collections = ['projects', 'philosophy'];
  
  for (const collection of collections) {
    const contentDir = path.join(projectRoot, 'content', collection);
    const outputDir = path.join(projectRoot, collection);
    
    try {
      // Ensure output directory exists
      await fs.mkdir(outputDir, { recursive: true });
      
      // Read all markdown files
      const files = await fs.readdir(contentDir);
      const markdownFiles = files.filter(f => f.endsWith('.md'));
      
      const posts = [];
      
      for (const file of markdownFiles) {
        const filePath = path.join(contentDir, file);
        const raw = await fs.readFile(filePath, 'utf8');
        const { data: meta, content } = matter(raw);
        
        if (!meta.slug) {
          console.warn(`Warning: ${file} is missing slug field`);
          continue;
        }
        
        // Process the markdown content
        const html = marked.parse(content);
        
        // Generate the page HTML
        const pageHtml = generatePageHtml(meta, html, collection);
        
        // Write the HTML file
        const outputPath = path.join(outputDir, `${meta.slug}.html`);
        await fs.writeFile(outputPath, pageHtml);
        
        // Add to posts list for index generation
        posts.push({
          ...meta,
          content,
          excerpt: content.slice(0, 200) + '...'
        });
        
        console.log(`Generated: ${collection}/${meta.slug}.html`);
      }
      
      // Sort posts by published date (newest first)
      posts.sort((a, b) => new Date(b.published) - new Date(a.published));
      
      // Generate index page
      const indexHtml = generateIndexHtml(posts, collection);
      const indexPath = path.join(outputDir, 'index.html');
      await fs.writeFile(indexPath, indexHtml);
      
      console.log(`Generated: ${collection}/index.html with ${posts.length} entries`);
      
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`Content directory not found: ${contentDir}`);
        console.log('Creating example content...');
        await createExampleContent(contentDir, collection);
      } else {
        throw error;
      }
    }
  }
}

function generatePageHtml(meta, content, collection) {
  const title = `${meta.title} | Tommy Nicol`;
  const collectionTitle = collection === 'philosophy' ? 'Philosophy' : 'Projects';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${meta.tagline || meta.title}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="../css/retro-90s.css">
</head>
<body data-theme="dark">
    <div class="matrix-rain"></div>
    <header class="header">
        <div class="container">
            <div class="fun-header">
                <h1 class="fun-header__title">${meta.title.toUpperCase()}.${collection === 'philosophy' ? 'PHI' : 'EXE'} <span class="badge-new">NEW!</span></h1>
                <p class="fun-header__subtitle">${meta.tagline}</p>
                <nav class="fun-nav">
                    <ul class="fun-nav__list">
                        <li class="fun-nav__item">
                            <a href="../index.html" class="fun-nav__link">HOME.EXE</a>
                        </li>
                        <li class="fun-nav__item">
                            <a href="../about.html" class="fun-nav__link">ABOUT.DAT</a>
                        </li>
                        <li class="fun-nav__item">
                            <a href="../projects.html" class="fun-nav__link">PROJECTS.DB</a>
                        </li>
                        <li class="fun-nav__item">
                            <a href="../blog.html" class="fun-nav__link">BLOG.TXT</a>
                        </li>
                        <li class="fun-nav__item">
                            <a href="../contact.html" class="fun-nav__link">CONTACT.SYS</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>

    <main class="main">
        <article class="post">
            <div class="container">
                <div class="post__meta">
                    <div class="post__category">${collection.toUpperCase()}.${collection === 'philosophy' ? 'PHI' : 'DB'}</div>
                    <div class="post__date">${meta.published}</div>
                    <a href="index.html" class="post__back">← BACK_TO_${collectionTitle.toUpperCase()}.INDEX</a>
                </div>
                
                <div class="post__content neon-border">
                    ${content}
                </div>
            </div>
        </article>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer__content">
                <p class="footer__text">
                    &copy; 2024 Tommy Nicol. Built with HTML, CSS, and JavaScript.
                </p>
                <div class="footer__links">
                    <a href="https://github.com/tommynicol" class="footer__link" target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                    <a href="https://linkedin.com/in/tommynicol" class="footer__link" target="_blank" rel="noopener noreferrer">
                        LinkedIn
                    </a>
                </div>
            </div>
        </div>
    </footer>

    <script src="../js/sfx.js"></script>
    <script src="../js/main.js"></script>
</body>
</html>`;
}

function generateIndexHtml(posts, collection) {
  const collectionTitle = collection === 'philosophy' ? 'Philosophy' : 'Projects';
  const title = `${collectionTitle} | Tommy Nicol`;
  
  const postsHtml = posts.map(post => `
    <div class="retro-table-cell" style="grid-column: span 6;">
        <div class="preview__card neon-border">
            <h3 class="preview__title">${post.title.toUpperCase()}.${collection === 'philosophy' ? 'PHI' : 'EXE'} <span class="badge-new">NEW!</span></h3>
            <p class="preview__text">
                ${post.tagline}<br>
                <span class="post__date">CREATED: ${post.published}</span>
            </p>
            <a href="${post.slug}.html" class="preview__link">EXECUTE >></a>
        </div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${collectionTitle} by Tommy Nicol">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="../css/retro-90s.css">
</head>
<body data-theme="dark">
    <div class="matrix-rain"></div>
    <header class="header">
        <div class="container">
            <div class="fun-header">
                <h1 class="fun-header__title">${collectionTitle.toUpperCase()}_DATABASE.${collection === 'philosophy' ? 'PHI' : 'DB'} <span class="badge-hot">HOT!</span></h1>
                <p class="fun-header__subtitle">LOADING ${collectionTitle.toUpperCase()}_ARCHIVE... ${posts.length} ENTRIES FOUND...</p>
                <nav class="fun-nav">
                    <ul class="fun-nav__list">
                        <li class="fun-nav__item">
                            <a href="../index.html" class="fun-nav__link">HOME.EXE</a>
                        </li>
                        <li class="fun-nav__item">
                            <a href="../about.html" class="fun-nav__link">ABOUT.DAT</a>
                        </li>
                        <li class="fun-nav__item">
                            <a href="../projects.html" class="fun-nav__link">PROJECTS.DB</a>
                        </li>
                        <li class="fun-nav__item">
                            <a href="../blog.html" class="fun-nav__link">BLOG.TXT</a>
                        </li>
                        <li class="fun-nav__item">
                            <a href="../contact.html" class="fun-nav__link">CONTACT.SYS</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>

    <main class="main">
        <section class="content">
            <div class="container">
                <div class="retro-table">
                    ${postsHtml}
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer__content">
                <p class="footer__text">
                    &copy; 2024 Tommy Nicol. Built with HTML, CSS, and JavaScript.
                </p>
                <div class="footer__links">
                    <a href="https://github.com/tommynicol" class="footer__link" target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                    <a href="https://linkedin.com/in/tommynicol" class="footer__link" target="_blank" rel="noopener noreferrer">
                        LinkedIn
                    </a>
                </div>
            </div>
        </div>
    </footer>

    <script src="../js/sfx.js"></script>
    <script src="../js/main.js"></script>
</body>
</html>`;
}

async function createExampleContent(contentDir, collection) {
  await fs.mkdir(contentDir, { recursive: true });
  
  if (collection === 'philosophy') {
    const examplePost = `---
title: "Why Absurdism Rings True"
slug: absurdism-rings-true
published: 2025-07-14
category: philosophy
tagline: "Camus meets coding"
cover: /assets/covers/absurdism.jpg
---

# The Absurd and the Algorithm

In the intersection of philosophy and computer science, I've found that Camus's concept of the absurd resonates deeply with the programming experience.

## The Sisyphean Developer

Every bug fixed reveals two more. Every feature completed spawns three new requirements. We are digital Sisyphus, eternally pushing our boulder of code up the mountain, only to watch it roll back down.

But here's the beautiful paradox: **we must imagine the developer happy.**

## Embracing the Absurd

The absurd isn't a problem to solve—it's a condition to embrace. When we accept that:

- Perfect code doesn't exist
- Requirements will always change  
- There's always more to learn

We free ourselves from the tyranny of seeking ultimate meaning in our work and instead find joy in the process itself.

## Code as Rebellion

Writing clean, thoughtful code becomes an act of rebellion against the absurd. Not because it eliminates absurdity, but because it represents our human choice to create meaning despite meaninglessness.

Every refactor, every test written, every comment added is our way of saying: "I exist, and I choose to care."

*This is just the beginning of a much deeper exploration...*`;

    await fs.writeFile(path.join(contentDir, 'absurdism-rings-true.md'), examplePost);
  } else {
    const exampleProject = `---
title: "Task Flow Manager"
slug: task-flow-manager
published: 2025-07-14
category: fullstack
tagline: "Productivity meets philosophy"
cover: /assets/covers/task-flow.jpg
tech: ["React", "Node.js", "PostgreSQL", "TypeScript"]
---

# Task Flow Manager

A philosophical approach to productivity software that respects human psychology and workflow patterns.

## The Problem

Most task managers treat humans like machines—expecting perfect, linear execution of predetermined sequences. This contradicts how creative minds actually work.

## The Solution

Task Flow Manager embraces the **natural ebb and flow** of human productivity:

- **Flow States**: Recognizes when you're in deep work and protects that time
- **Context Switching**: Smooth transitions between different types of work
- **Energy Levels**: Matches tasks to your current mental state
- **Reflection**: Built-in time for processing and planning

## Technical Implementation

### Architecture
- **Frontend**: React with TypeScript for type safety
- **Backend**: Node.js with Express and PostgreSQL
- **Real-time**: WebSocket connections for collaborative features
- **AI**: Simple machine learning for productivity pattern recognition

### Key Features
- Adaptive task scheduling based on historical patterns
- Collaborative workspaces with philosophical discussion threads
- Integration with time-tracking and focus tools
- Privacy-first design with local-first data storage

## Philosophical Foundation

This isn't just another productivity app—it's a tool built on the premise that software should adapt to human nature, not force humans to adapt to rigid systems.

[View Live Demo](https://taskflow-demo.example.com) | [Source Code](https://github.com/tommynicol/task-flow-manager)`;

    await fs.writeFile(path.join(contentDir, 'task-flow-manager.md'), exampleProject);
  }
  
  console.log(`Created example content in ${contentDir}`);
}

// Add CSS for post styling
async function createPostStyles() {
  const postCss = `
/* Post content styling */
.post {
  padding: var(--space-4xl) 0;
}

.post__meta {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
  flex-wrap: wrap;
}

.post__category {
  background: var(--neon-pink);
  color: #000;
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--space-xs);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.post__date {
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 0.9rem;
}

.post__back {
  color: var(--neon-cyan);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  margin-left: auto;
}

.post__back:hover {
  color: var(--neon-green);
  text-shadow: 0 0 10px currentColor;
}

.post__content {
  background: var(--bg-secondary);
  padding: var(--space-3xl);
  border-radius: var(--space-lg);
  line-height: 1.7;
}

.post__content h1,
.post__content h2,
.post__content h3 {
  color: var(--neon-cyan);
  text-shadow: 0 0 10px currentColor;
  margin-top: var(--space-2xl);
  margin-bottom: var(--space-lg);
}

.post__content h1 {
  font-size: 2.5rem;
  margin-top: 0;
}

.post__content h2 {
  font-size: 2rem;
}

.post__content h3 {
  font-size: 1.5rem;
}

.post__content p {
  margin-bottom: var(--space-lg);
  color: var(--text-primary);
}

.post__content strong {
  color: var(--neon-green);
  font-weight: 600;
}

.post__content em {
  color: var(--neon-pink);
}

.post__content ul,
.post__content ol {
  margin-bottom: var(--space-lg);
  padding-left: var(--space-xl);
}

.post__content li {
  margin-bottom: var(--space-sm);
  color: var(--text-primary);
}

.post__content code {
  background: var(--bg-tertiary);
  color: var(--neon-green);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--space-xs);
  font-family: var(--font-mono);
  font-size: 0.9em;
}

.post__content pre {
  background: var(--bg-tertiary);
  padding: var(--space-lg);
  border-radius: var(--space-md);
  overflow-x: auto;
  margin-bottom: var(--space-lg);
  border: 1px solid var(--border-color);
}

.post__content pre code {
  background: none;
  padding: 0;
  color: var(--neon-green);
}

.post__content blockquote {
  border-left: 4px solid var(--neon-cyan);
  margin-left: 0;
  padding-left: var(--space-lg);
  color: var(--text-medium);
  font-style: italic;
}
`;

  const cssPath = path.join(projectRoot, 'css', 'post.css');
  await fs.writeFile(cssPath, postCss);
  console.log('Created post.css for content styling');
}

// Main execution
try {
  await buildContent();
  await createPostStyles();
  console.log('✅ Content build complete!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}