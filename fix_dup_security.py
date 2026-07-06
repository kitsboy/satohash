with open('src/components/Footer.jsx', 'r') as f:
    c = f.read()

# Remove the duplicate Security entry
old_dup = "                  { name: 'Security', path: '/security' },\n                  { name: 'Security', path: '/security' },"
new_clean = "                  { name: 'Security', path: '/security' },"
c = c.replace(old_dup, new_clean)

with open('src/components/Footer.jsx', 'w') as f:
    f.write(c)

# Verify - count occurrences
count = c.count("path: '/security'")
print(f'Security entries: {count}')
assert count == 1, f'Expected 1 Security entry, got {count}'
print('OK')
