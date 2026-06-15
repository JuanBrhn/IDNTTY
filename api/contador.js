const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '2160401',
  key: '3f2e85fafca817cc9e2c',
  secret: 'f1eb0f6cf58ac138b3d1',
  cluster: 'eu',
  useTLS: true
});

let total = 0;

module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    const { accion } = req.body || {};
    if (accion === 'entrar') total = Math.max(0, total + 1);
    if (accion === 'salir')  total = Math.max(0, total - 1);
    await pusher.trigger('idntty', 'contador', { total });
    return res.status(200).json({ total });
  }
  if (req.method === 'GET') {
    return res.status(200).json({ total });
  }
  res.status(405).json({ error: 'Method not allowed' });
};
