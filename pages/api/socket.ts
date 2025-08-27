import type { NextApiRequest } from 'next';
import { initSocket, type NextApiResponseServerIO } from '../../lib/socket';

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (req.method === 'POST') {
    // Initialize Socket.IO (no need to assign to a variable if unused)
    initSocket(res);

    return res.status(200).json({ message: 'Socket.IO server initialized' });
  }

  // Default response for other methods
  return res.status(200).json({ message: 'Socket.IO server running' });
}

// Disable body parser for WebSocket connections
export const config = {
  api: {
    bodyParser: false,
  },
};
