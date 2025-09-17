#!/usr/bin/env node

/**
 * This script identifies and optionally removes unused files from the public folder
 * It scans the codebase for references to public files and lists those that are not used
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SRC_DIR = path.join(__dirname, '..', 'src');
const DRY_RUN = process.argv.includes('--dry-run') || !process.argv.includes('--remove');

// Helper functions
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      // Store the path relative to the public directory
      const relativePath = path.relative(PUBLIC_DIR, filePath);
      fileList.push(relativePath.replace(/\\/g, '/'));
    }
  });
  
  return fileList;
}

function findReferencesInCodebase() {
  console.log('Scanning codebase for references to public files...');
  
  // Get all source files
  const sourceFiles = [];
  const extensions = ['.tsx', '.ts', '.jsx', '.js', '.css'];
  
  function findSourceFiles(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findSourceFiles(filePath);
      } else if (extensions.includes(path.extname(filePath))) {
        sourceFiles.push(filePath);
      }
    });
  }
  
  findSourceFiles(SRC_DIR);
  console.log(`Found ${sourceFiles.length} source files to scan`);
  
  // Search for references in each file
  const references = new Set();
  
  sourceFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Look for patterns like src="/file.svg", src={'/file.svg'}, icon: '/file.svg', etc.
      const patterns = [
        /['"`]\/([^'"\s`]+)['"`]/g,  // Matches "/path/to/file" or '/path/to/file' or `/path/to/file`
        /:\s*['"`]\/([^'"\s`]+)['"`]/g,  // Matches key: "/path/to/file"
        /src=\{?['"`]\/([^'"\s`]+)['"`]\}?/g,  // Matches src="/path" or src={'/path'}
        /src=\{?['"`]([^'"\s`]+)['"`]\}?/g,  // Matches src without leading slash
        /<img[^>]*src=["\']\/([^"\'>]+)["\']/g,  // Matches <img src="/path">
      ];
      
      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          if (match[1]) {
            references.add(match[1]);
          }
        }
      });
      
    } catch (error) {
      console.error(`Error reading file ${file}:`, error.message);
    }
  });
  
  return Array.from(references);
}

// Main execution
console.log('=== Public Folder Cleanup Script ===');

// Get all files in the public directory
const allPublicFiles = getAllFiles(PUBLIC_DIR);
console.log(`Found ${allPublicFiles.length} files in the public folder`);

// Find all references to public files in the codebase
const referencedFiles = findReferencesInCodebase();
console.log(`Found ${referencedFiles.length} references to public files in the codebase`);

// Add known references that might be missed by regex
const knownReferences = [
  'DrawKit - Social Movements Illustration Pack/SVG/4_SOCIAL MEDIA.svg',
  'DrawKit Vector Illustration Mental Health & Psychology 2/SVG/DrawKit Vector Illustration Mental Health & Psychology (3).svg',
  'DrawKit Vector Illustration Mental Health & Psychology 2/SVG/DrawKit Vector Illustration Mental Health & Psychology (4).svg',
  'DrawKit Vector Illustration Mental Health & Psychology 2/SVG/DrawKit Vector Illustration Mental Health & Psychology (7).svg',
  'DrawKit Vector Illustration Mental Health & Psychology 2/SVG/DrawKit Vector Illustration Mental Health & Psychology (10).svg',
  'WFH_svg 3/wfh_6.svg',
  'WFH_svg 3/wfh_7.svg',
  'WFH_svg 3/wfh_8.svg',
  'WFH_svg 3/wfh_1.svg'
];

// Merge with found references
const allReferences = [...new Set([...referencedFiles, ...knownReferences])];
console.log(`Total references including known files: ${allReferences.length}`);
console.log('All referenced files:', allReferences);

// Normalize references (handle case sensitivity and path variations)
const normalizedReferences = allReferences.map(ref => {
  // Remove leading slash if present
  if (ref.startsWith('/')) {
    ref = ref.substring(1);
  }
  return ref;
});

// Identify used files
const usedFiles = new Set();

normalizedReferences.forEach(ref => {
  // Check for exact matches (case insensitive)
  const exactMatch = allPublicFiles.find(file => file.toLowerCase() === ref.toLowerCase());
  if (exactMatch) {
    usedFiles.add(exactMatch);
  }
  
  // Check for files that are part of a referenced directory
  allPublicFiles.forEach(file => {
    if (file.toLowerCase().startsWith(ref.toLowerCase() + '/')) {
      usedFiles.add(file);
    }
  });
});

// Special case for favicon.ico which might not be explicitly referenced
if (allPublicFiles.includes('favicon.ico')) {
  usedFiles.add('favicon.ico');
}

// Find unused files
const unusedFiles = allPublicFiles.filter(file => !usedFiles.has(file));

// Display results
console.log('\n=== Results ===');
console.log(`Used files: ${usedFiles.size}`);
console.log(`Unused files: ${unusedFiles.length}`);

if (unusedFiles.length > 0) {
  console.log('\nUnused files:');
  unusedFiles.forEach(file => {
    console.log(`- ${file}`);
  });
  
  if (DRY_RUN) {
    console.log('\nThis was a dry run. No files were removed.');
    console.log('To remove unused files, run the script with the --remove flag.');
  } else {
    console.log('\nRemoving unused files...');
    
    let removedCount = 0;
    unusedFiles.forEach(file => {
      const fullPath = path.join(PUBLIC_DIR, file);
      try {
        fs.unlinkSync(fullPath);
        console.log(`Removed: ${file}`);
        removedCount++;
      } catch (error) {
        console.error(`Error removing ${file}: ${error.message}`);
      }
    });
    
    console.log(`\nRemoved ${removedCount} unused files.`);
  }
} else {
  console.log('\nAll files in the public folder are being used!');
}