const API_URL = 'http://localhost:3001';

document.getElementById('snapBtn').addEventListener('click', async () => {
  const btn = document.getElementById('snapBtn');
  const status = document.getElementById('status');
  const encrypt = document.getElementById('encryptCheck').checked;

  btn.disabled = true;
  btn.innerText = 'Capturing...';
  status.innerHTML = '<p>Generating Cryptographic Hash...</p>';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Simple way to capture page content info
    const pageData = {
      url: tab.url,
      title: tab.title,
      timestamp: new Date().toISOString()
    };

    // In a real version, we'd use crypto.subtle to hash the page source or screenshot
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(pageData)))
      .then(b => Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join(''));

    const response = await fetch(`${API_URL}/api/stamp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hash: hash,
        filename: `SNAP: ${tab.title.substring(0, 30)}`
      })
    });

    if (!response.ok) throw new Error('API Rejection');
    const result = await response.json();

    status.innerHTML = `<p style="color: #10b981;">✅ Anchored!</p><p style="font-size: 10px;">ID: ${result.id}</p>`;
    btn.innerText = 'Done';
    
  } catch (err) {
    status.innerHTML = `<p style="color: #ef4444;">❌ Failed: ${err.message}</p>`;
    btn.disabled = false;
    btn.innerText = 'Retry Stamp';
  }
});
