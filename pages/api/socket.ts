import type { NextApiRequest } from 'next';
import { initSocket, type NextApiResponseServerIO } from '../../lib/socket';

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (req.method === 'POST') {
    // Initialize Socket.IO
    const io = initSocket(res);
    
    res.status(200).json({ message: 'Socket.IO server initialized' });
  } else {
    res.status(200).json({ message: 'Socket.IO server running' });
  }
}

// Disable body parser for WebSocket connections
export const config = {
  api: {
    bodyParser: false,
  },
};