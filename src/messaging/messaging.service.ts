import { Injectable } from '@nestjs/common';
import { CreateMessagingDto } from './dto/create-messaging.dto';
import { Message } from './entities/message.entity';

interface ActiveUsers {
  id: string;
  name: string;
}

@Injectable()
export class MessagingService {
  messages: Message[] = [{ name: 'Collins', text: 'Holla' }];

  activeUsers: ActiveUsers[] = [];

  create(createMessagingDto: CreateMessagingDto) {
    const message = { ...createMessagingDto };
    //TODO: Improve
    this.messages.push(message);
    return message;
  }

  findAll() {
    return this.messages;
  }

  joinRoom(name: string, clientId: string) {
    const users = this.activeUsers.filter((item) => item.id === clientId);
    if (users.length > 0) {
      return { joined: false };
    }
    this.activeUsers.push({ id: clientId, name: name });
    console.log(`Active users: ${this.activeUsers.length}`);
    this.activeUsers.map((user) => {
      console.log(`Active user: ${user.id}: ${user.name}`);
    });
    return { joined: true, name: name };
  }
  getClientId(clientId: string) {
    const users = this.activeUsers.filter((user) => user.id === clientId);
    if (users.length > 0) {
      return users[0].name;
    }
    return '';
  }
}
