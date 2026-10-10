import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'tracking',
})
export class DeliveryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(DeliveryGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected to tracking socket: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from tracking socket: ${client.id}`);
  }

  @SubscribeMessage('joinOrderRoom')
  handleJoinOrderRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string },
  ) {
    if (data?.orderId) {
      client.join(`order:${data.orderId}`);
      this.logger.log(`Socket ${client.id} joined room order:${data.orderId}`);
      return { status: 'joined', orderId: data.orderId };
    }
  }

  @SubscribeMessage('leaveOrderRoom')
  handleLeaveOrderRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string },
  ) {
    if (data?.orderId) {
      client.leave(`order:${data.orderId}`);
      return { status: 'left', orderId: data.orderId };
    }
  }

  emitLocationUpdate(orderId: string, locationData: { lat: number; lng: number; heading?: number; speed?: number }) {
    if (this.server) {
      this.server.to(`order:${orderId}`).emit('locationUpdate', locationData);
    }
  }

  emitStatusUpdate(orderId: string, statusData: { status: string; timestamp: string; message?: string }) {
    if (this.server) {
      this.server.to(`order:${orderId}`).emit('statusUpdate', statusData);
    }
  }
}
