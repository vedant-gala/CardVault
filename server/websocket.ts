import { WebSocket, WebSocketServer } from 'ws';
import { Server as HTTPServer } from 'http';

let wss: WebSocketServer | null = null;

export function setupWebSocket(server: HTTPServer) {
  wss = new WebSocketServer({ 
    server,
    path: '/ws'
  });

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return wss;
}

export function broadcastNotification(notification: {
  id: string;
  type: string;
  title: string;
  message: string;
  cardId?: string;
  read: boolean;
  createdAt: string;
}) {
  if (!wss) {
    console.error('WebSocket server not initialized');
    return;
  }

  const message = JSON.stringify({
    type: 'notification',
    data: notification,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
