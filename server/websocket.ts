import { WebSocket, WebSocketServer } from 'ws';
import { Server as HTTPServer } from 'http';
import { IncomingMessage } from 'http';
import session from 'express-session';
import cookieParser from 'cookie-parser';

interface ExtendedWebSocket extends WebSocket {
  userId?: string;
}

interface SessionData extends session.SessionData {
  passport?: {
    user?: string;
  };
}

let wss: WebSocketServer | null = null;
let sessionParser: any = null;

export function setupWebSocket(server: HTTPServer, sessionMiddleware: any) {
  sessionParser = sessionMiddleware;
  
  wss = new WebSocketServer({ 
    server,
    path: '/ws',
    verifyClient: (info, callback) => {
      // Parse session from cookie
      sessionParser(info.req, {} as any, () => {
        const sessionData = (info.req as any).session as SessionData;
        
        // Require authenticated session
        if (sessionData?.passport?.user) {
          callback(true);
        } else {
          console.log('WebSocket connection rejected: No authenticated session');
          callback(false, 401, 'Unauthorized');
        }
      });
    }
  });

  wss.on('connection', (ws: ExtendedWebSocket, req: any) => {
    // Extract userId from authenticated session
    const sessionData = req.session as SessionData;
    const userId = sessionData?.passport?.user;
    
    if (userId) {
      ws.userId = userId;
      console.log(`WebSocket client connected for user: ${userId}`);
    } else {
      // This shouldn't happen due to verifyClient, but safety check
      ws.close(1008, 'Unauthorized');
      return;
    }

    ws.on('close', () => {
      console.log(`WebSocket client disconnected (user: ${ws.userId})`);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return wss;
}

export function broadcastNotification(
  notification: {
    id: string;
    type: string;
    title: string;
    message: string;
    cardId?: string;
    read: boolean;
    createdAt: string;
  },
  userId: string
) {
  if (!wss) {
    console.error('WebSocket server not initialized');
    return;
  }

  const message = JSON.stringify({
    type: 'notification',
    data: notification,
  });

  wss.clients.forEach((client: ExtendedWebSocket) => {
    // Only send to clients belonging to the specific user
    if (client.readyState === WebSocket.OPEN && client.userId === userId) {
      client.send(message);
    }
  });
}
