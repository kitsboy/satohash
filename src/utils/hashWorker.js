self.onmessage = async (e) => {
  const { data } = e;

  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    self.postMessage(hashHex);
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};
