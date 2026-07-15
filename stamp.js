const fetch = require('node-fetch');
const fs = require('fs');

const URL = 'https://script.google.com/macros/s/AKfycbx89YEMm7DT_W3T7gT0dUUjYpybzmzj0DryaruiIdC8DaihpOV5dBW6HiU-iARGh_Dq/exec';

// Format: wallet|handle (satu per baris)
// Contoh: 0xABC123...|namahandle
const lines = fs.readFileSync('wallets.txt', 'utf-8')
  .split('\n').map(w => w.trim()).filter(Boolean);

async function stamp(wallet, handle) {
  const payload = {
    wallet,
    handle,
    ip: '',
    submittedAt: new Date().toISOString(),
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Infinix X6833B Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.7871.46 Mobile Safari/537.36'
  };

  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  console.log(`[${wallet}] [${handle}] →`, JSON.stringify(data));
}

(async () => {
  for (const line of lines) {
    const [wallet, handle] = line.split('|');
    if (!wallet || !handle) {
      console.log(`[SKIP] format salah: ${line}`);
      continue;
    }
    await stamp(wallet.trim(), handle.trim());
    await new Promise(r => setTimeout(r, 1000));
  }
})();
