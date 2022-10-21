import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagingService } from './messaging.service';
import { CreateMessagingDto } from './dto/create-messaging.dto';
import { Server, Socket } from 'socket.io';

// * Send and receive messages only
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagingGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly messagingService: MessagingService) {}

  // *SEND MESSAGE
  @SubscribeMessage('createMessaging')
  create(@MessageBody() createMessagingDto: CreateMessagingDto) {
    const message = { ...createMessagingDto };
    this.server.emit('message', message);
    this.messagingService.create(message);
    return message;
  }

  // * GET ALL MESSAGES
  @SubscribeMessage('findAllMessaging')
  findAll() {
    return this.messagingService.findAll();
  }

  // * JOIN CONNECTION (SignIn)
  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagingService.joinRoom(name, client.id);
  }

  // * TYPING ACTIVITY
  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: string,
    @ConnectedSocket() client: Socket,
  ) {
    const name = this.messagingService.getClientId(client.id);
    client.broadcast.emit('typing', { name, isTyping });
  }
}
