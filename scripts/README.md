# Lookiy Web Scripts

This directory contains utility scripts for the Lookiy web project.

## Cleanup Public Folder Script

### Description

The `cleanup-public.js` script helps identify and optionally remove unused files from the public folder. It scans the codebase for references to files in the public directory and determines which files are not being used anywhere in the application.

### Usage

```bash
# Run in dry-run mode (just list unused files without removing them)
node scripts/cleanup-public.js --dry-run

# Run and remove unused files
node scripts/cleanup-public.js --remove
```

### How It Works

1. The script scans all files in the `public` directory and its subdirectories
2. It then searches through the codebase for references to these files
3. Files that are not referenced anywhere are identified as unused
4. In dry-run mode, it lists the unused files without removing them
5. With the `--remove` flag, it will delete the unused files

### Safety Features

- By default, the script runs in dry-run mode unless explicitly told to remove files
- `favicon.ico` is automatically preserved even if not explicitly referenced
- The script provides detailed output of what it's doing at each step

### Example Output

```
=== Public Folder Cleanup Script ===
Found 68 files in the public folder
Scanning codebase for references to public files...
Found 22 source files to scan
Found 25 references to public files in the codebase
Total references including known files: 27

=== Results ===
Used files: 15
Unused files: 53

Unused files:
- DrawKit - Social Movements Illustration Pack/PNG/1_FEMINISM.png
- DrawKit - Social Movements Illustration Pack/PNG/2_LGBTQ+.png
...

This was a dry run. No files were removed.
To remove unused files, run the script with the --remove flag.
```

### Notes

- The script is designed to be conservative and may keep files that it's not sure about
- PNG files are often kept when their SVG counterparts are used
- If you're unsure, always run with `--dry-run` first to review what will be removed