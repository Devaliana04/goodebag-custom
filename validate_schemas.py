import os
import re
import json

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
print(f"Validating JSON-LD schemas in {len(html_files)} files...")

for fname in sorted(html_files):
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    matches = re.findall(r'<script type="application/ld\+json">(.*?)</script>', content, re.DOTALL)
    if not matches:
        print(f"[NO SCHEMA] {fname}")
        continue
    
    for idx, schema_str in enumerate(matches):
        try:
            data = json.loads(schema_str.strip())
            types = []
            if '@graph' in data:
                for item in data['@graph']:
                    t = item.get('@type', 'Unknown')
                    types.append(t if isinstance(t, str) else '/'.join(t))
            else:
                t = data.get('@type', 'Unknown')
                types.append(t if isinstance(t, str) else '/'.join(t))
            print(f"[VALID JSON-LD] {fname} (block {idx+1}): {', '.join(types)}")
        except Exception as e:
            print(f"[ERROR JSON-LD] {fname}: {e}")
