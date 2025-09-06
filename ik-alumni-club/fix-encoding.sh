#!/bin/bash

# Fix encoding for all TypeScript/TSX files
echo "Fixing file encodings..."

for file in $(find ./src -name "*.ts" -o -name "*.tsx"); do
  # Check if file is not UTF-8
  if ! file -I "$file" | grep -q "utf-8"; then
    echo "Converting $file to UTF-8..."
    # Create temp file with UTF-8 encoding
    iconv -f US-ASCII -t UTF-8 "$file" > "${file}.tmp" 2>/dev/null || cp "$file" "${file}.tmp"
    mv "${file}.tmp" "$file"
  fi
done

echo "Done! All files should now be UTF-8 encoded."