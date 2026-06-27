// Vercel Serverless Function - LiveKit Token Generator
import { AccessToken } from 'livekit-server-sdk';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { participantName } = req.query;

  if (!participantName) {
    return res.status(400).json({ error: 'participantName parametresi gerekli' });
  }

  // LiveKit credentials from environment variables
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.LIVEKIT_WS_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return res.status(500).json({ error: 'LiveKit credentials not configured' });
  }

  const roomName = 'konvoy-gizli-oda';

  try {
    // Create access token
    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      name: participantName,
    });

    // Grant permissions
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    return res.status(200).json({
      token,
      wsUrl,
      roomName,
      participantName,
    });
  } catch (error) {
    console.error('Token generation error:', error);
    return res.status(500).json({ error: 'Token generation failed' });
  }
}
