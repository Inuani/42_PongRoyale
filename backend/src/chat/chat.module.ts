import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat } from './chat.entity';
import { MessagesModule } from 'src/messages/messages.module';
import { ChatMembersModule } from 'src/chat_members/chat_members.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), MessagesModule, ChatMembersModule, UsersModule],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}