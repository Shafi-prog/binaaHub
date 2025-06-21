#!/bin/bash

# Protect Critical Documentation Files
# This script sets up protection for important roadmap and documentation files

echo "🛡️ Setting up file protection for critical documentation..."

# Make critical files read-only in Windows
attrib +R "PLATFORM_FEATURES_ROADMAP.md"
attrib +R "UNIFIED_PLATFORM_COMPLETE.md" 
attrib +R "README.md"
attrib +R "package.json"

# Add git hooks to prevent accidental deletion
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Check if critical files are being deleted
critical_files=(
    "PLATFORM_FEATURES_ROADMAP.md"
    "UNIFIED_PLATFORM_COMPLETE.md"
    "README.md"
    "package.json"
)

for file in "${critical_files[@]}"; do
    if git diff --cached --name-status | grep -q "^D.*$file"; then
        echo "❌ ERROR: Attempting to delete critical file: $file"
        echo "💡 If you really need to delete this file, use: git commit --no-verify"
        exit 1
    fi
done

echo "✅ No critical files being deleted"
EOF

chmod +x .git/hooks/pre-commit

echo "✅ File protection setup complete!"
echo "📁 Protected files:"
echo "   - PLATFORM_FEATURES_ROADMAP.md (read-only)"
echo "   - UNIFIED_PLATFORM_COMPLETE.md (read-only)"
echo "   - README.md (read-only)"
echo "   - package.json (read-only)"
echo "🔒 Git hooks added to prevent accidental deletion"
