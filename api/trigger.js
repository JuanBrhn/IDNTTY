const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '2160401',
  key: '3f2e85fafca817cc9e2c',
  secret: 'f1eb0f6cf58ac138b3d1',
  cluster: 'eu',
  useTLS: true
});

// Estado global en memoria
let pantallaActual = 'p-cero';

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ pantalla: pantallaActual });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { id, reiniciar } = req.body || {};
    const nuevaPantalla = id || 'p-cero';
    pantallaActual = nuevaPantalla;
    await pusher.trigger('idntty', 'pantalla', { id: nuevaPantalla, reiniciar: !!reiniciar });
    res.status(200).json({ ok: true, pantalla: pantallaActual });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
