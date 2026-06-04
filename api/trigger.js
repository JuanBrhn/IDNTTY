const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '2160401',
  key: '3f2e85fafca817cc9e2c',
  secret: 'f1eb0f6cf58ac138b3d1',
  cluster: 'eu',
  useTLS: true
});

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { id } = req.body || {};
    await pusher.trigger('idntty', 'pantalla', { id: id || 'p-terminos' });
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
