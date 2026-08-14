#!/usr/bin/env node
/**
 * Clean Build System
 * Creates production-ready code by combining source files and removing CMS functionality
 */

import fs from 'fs';
import path from 'path';

class CleanBuilder {
    constructor() {
        this.sourceDir = './production-src';
        this.outputDir = './dist';
        this.devDir = './dev-environment';

        // Files and patterns to clean from production HTML
        this.cmsPatterns = [
            /\s*class="[^"]*cms-editable-text[^"]*"/g,
            /\s*data-field="[^"]*"/g,
            /\s*data-section-id="[^"]*"/g,
            /\s*<!-- CMS Integration -->\s*<script src="[^"]*cms-integration[^"]*"><\/script>/g,
            /\s*<script src="[^"]*cms-integration[^"]*"><\/script>/g
        ];

        // Development-only script references to remove
        this.devScriptPatterns = [
            /\s*<script src="admin\/[^"]*"><\/script>/g,
            /\s*<script src="dev-environment\/[^"]*"><\/script>/g
        ];
    }

    async build() {
        console.log('🏗️  Building clean production version...');
        console.log('📁 Source: production-src/');
        console.log('📁 Output: dist/');

        // Clean output directory
        this.cleanDirectory(this.outputDir);
        fs.mkdirSync(this.outputDir, { recursive: true });

        // Copy and process website files
        await this.processWebsiteFiles();

        // Copy assets
        await this.copyAssets();

        // Tell GitHub Pages to serve the generated files exactly as built.
        fs.writeFileSync(path.join(this.outputDir, '.nojekyll'), '');

        console.log('✅ Clean build complete!');
        console.log(`📦 Production-ready files in: ${this.outputDir}/`);
    }

    async processWebsiteFiles() {
        const websiteDir = path.join(this.sourceDir, 'website');

        if (!fs.existsSync(websiteDir)) {
            throw new Error(`Website source directory not found: ${websiteDir}`);
        }

        console.log('🧹 Processing website files...');
        await this.copyAndProcessDirectory(websiteDir, this.outputDir);
    }

    async copyAssets() {
        const assetsDir = path.join(this.sourceDir, 'assets');

        if (fs.existsSync(assetsDir)) {
            console.log('📋 Copying assets...');
            await this.copyDirectory(assetsDir, this.outputDir);
        }
    }

    async copyAndProcessDirectory(srcDir, destDir) {
        const items = fs.readdirSync(srcDir);
        const isWebsiteRoot = path.resolve(srcDir) === path.resolve(this.sourceDir, 'website');

        for (const item of items) {
            // Source partials and setup notes are not standalone public pages.
            if (isWebsiteRoot && (item === 'includes' || item === 'SETUP_AND_DEPLOYMENT_GUIDE.html')) {
                continue;
            }

            const srcPath = path.join(srcDir, item);
            const destPath = path.join(destDir, item);

            const stat = fs.statSync(srcPath);

            if (stat.isDirectory()) {
                fs.mkdirSync(destPath, { recursive: true });
                await this.copyAndProcessDirectory(srcPath, destPath);
            } else {
                await this.processFile(srcPath, destPath);
            }
        }
    }

    async copyDirectory(srcDir, destDir) {
        const items = fs.readdirSync(srcDir);

        for (const item of items) {
            const srcPath = path.join(srcDir, item);
            const destPath = path.join(destDir, item);

            const stat = fs.statSync(srcPath);

            if (stat.isDirectory()) {
                fs.mkdirSync(destPath, { recursive: true });
                await this.copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }

    async processFile(srcPath, destPath) {
        const ext = path.extname(srcPath).toLowerCase();

        if (ext === '.html') {
            // Process HTML files to remove CMS functionality
            let content = fs.readFileSync(srcPath, 'utf8');
            content = this.cleanHTMLContent(content);
            fs.writeFileSync(destPath, content);
            console.log(`🧹 Cleaned: ${path.basename(srcPath)}`);
        } else {
            // Copy other files as-is
            fs.copyFileSync(srcPath, destPath);
        }
    }

    cleanHTMLContent(content) {
        let cleanContent = content;

        // Remove CMS-specific patterns
        [...this.cmsPatterns, ...this.devScriptPatterns].forEach(pattern => {
            cleanContent = cleanContent.replace(pattern, '');
        });

        // Fix asset paths to work from root
        cleanContent = cleanContent
            .replace(/src="assets\//g, 'src="')
            .replace(/href="assets\//g, 'href="');

        // Clean up formatting
        cleanContent = cleanContent
            .replace(/\s+/g, ' ')
            .replace(/class=""/g, '')
            .replace(/class="\s+"/g, '')
            .replace(/\s+>/g, '>');

        return `${cleanContent.trim()}\n`;
    }

    cleanDirectory(dirPath) {
        if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, { recursive: true, force: true });
        }
    }
}

// Run the build
const builder = new CleanBuilder();
builder.build().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
