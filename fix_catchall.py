with open('src/App.jsx', 'r') as f:
    c = f.read()

# Find the old inline 404 and replace with NotFound component
old_inline = '''            path="*"
            element={
              <div
                style={{
                  minHeight: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)'
                }}
              >
                <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1rem' }}>404</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  Page not found
                </p>
                <Link
                  to="/"
                  style={{
                    color: 'var(--accent-active)',
                    fontWeight: 700,'''

if old_inline in c:
    # Find the full old block - it starts with the path line and ends with </Route>
    idx = c.index(old_inline)
    # Find the closing </Route> after this block
    end_idx = c.index('</Route>', idx)
    # Find the second </Route> (the one closing the catch-all route)
    end_idx2 = c.index('</Route>', end_idx + 1)
    
    replacement = '''            path="*"
            element={<NotFound />}
          />'''
    
    c = c[:idx] + replacement + c[end_idx2 + 8:]
    print('Replaced inline 404 with NotFound component')
else:
    print('Inline 404 not found - checking alternative pattern')
    # Try to find the simplified pattern
    if 'path="*"' in c and 'element={<NotFound' not in c:
        print('Catch-all route exists but not using NotFound')
    elif 'element={<NotFound' in c:
        print('Already using NotFound - OK')

with open('src/App.jsx', 'w') as f:
    f.write(c)

# Verify
with open('src/App.jsx', 'r') as f:
    content = f.read()

if 'element={<NotFound />}' in content:
    print('VERIFIED: NotFound in catch-all route')
else:
    import re
    match = re.search(r'path="\*".*?</Route>', content, re.DOTALL)
    if match:
        print('Catch-all route:', match.group()[:80])
    print('ERROR: NotFound not in catch-all')
