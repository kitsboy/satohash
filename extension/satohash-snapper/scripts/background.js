// Service worker for Satohash Snapper extension
// Integrates with Socket.io for real-time OTS updates
// Handles clipboard batch stamping

import { io } from 'https://cdn.socket.io/4.7.5/socket.io.esm.min.js';

const API_URL = 'http://localhost:3001'; // Use https://api.satohash.com in production
const socket = io(API_URL, {
  transports: ['websocket'],
  autoConnect: false
});

// Connect on startup
socket.connect();

// Listen for OTS events
socket.on('ots:stamped', (data) => {
  console.log('Stamp confirmed:', data);
  // Notify popup or content script if open
  chrome.runtime.sendMessage({ action: 'stampUpdated', data });
});

socket.on('ots:collaborated', (data) => {
  console.log('Collaboration added:', data);
  chrome.runtime.sendMessage({ action: 'collaborationUpdated', data });
});

socket.on('ots:revoked', (data) => {
  console.log('Stamp revoked:', data);
  chrome.runtime.sendMessage({ action: 'revokeUpdated', data });
});

// Handle messages from popup/content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'connectSocket') {
    socket.connect();
    sendResponse({ connected: socket.connected });
    return true; // Keep message channel open
  }

  if (request.action === 'stampClipboard') {
    navigator.permissions.query({ name: 'clipboard-read' }).then(permission => {
      if (permission.state !== 'granted') {
        sendResponse({ error: 'Clipboard access denied' });
        return;
      }
      navigator.clipboard.readText().then(text => {
        if (text.length > 10000) { // Batch limit
          sendResponse({ error: 'Text too long for batch' });
          return;
        }
        // Compute SHA-256 hash
        crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
          .then(hashBuffer => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            // Send to API
            fetch(`${API_URL}/api/stamp`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ hash: hashHex })
            }).then(res => res.json())
              .then(data => {
                if (data.id) {
                  // Listen for confirmation via socket
                  sendResponse({ success: true, id: data.id });
                } else {
                  sendResponse({ error: data.error });
                }
              }).catch(err => sendResponse({ error: err.message }));
          });
      }).catch(err => sendResponse({ error: err.message }));
    });
    return true; // Async response
  }

  if (request.action === 'batchStamp') {
    // For multiple items from clipboard (e.g., lines)
    // Implementation similar, split text and hash each
    navigator.permissions.query({ name: 'clipboard-read' }).then(permission => {
      if (permission.state !== 'granted') {
        sendResponse({ error: 'Clipboard access denied' });
        return;
      }
      navigator.clipboard.readText().then(text => {
        const items = text.split(/\\n|\\r\\n/).filter(line => line.trim().length > 0);
        if (items.length > 10) { // Batch limit
          sendResponse({ error: 'Too many lines for batch (max 10)' });
          return;
        }
        const results = [];
        const promises = items.map(item =>
          crypto.subtle.digest('SHA-256', new TextEncoder().encode(item))
            .then(hashBuffer => {
              const hashArray = Array.from(new Uint8Array(hashBuffer));
              const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
              return fetch(`${API_URL}/api/stamp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hash: hashHex, filename: `clipboard-${Date.now()}-${results.length}` })
              }).then(res => res.json()).then(data => ({ item, ...data }));
            })
        );
        Promise.all(promises).then(resps => {
          sendResponse({ success: true, batch: resps });
        }).catch(err => sendResponse({ error: err.message }));
      }).catch(err => sendResponse({ error: err.message }));
    });
    return true; // Async response
  }
});

console.log('Satohash Snapper background script loaded');