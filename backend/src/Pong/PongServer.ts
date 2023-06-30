import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io"

@WebSocketGateway({ 
	cors: {
		credentials: true,
	},
	transports: ['websocket', 'polling'],
})

export class PongSockets
{
	@WebSocketServer()
	server : Server;
}