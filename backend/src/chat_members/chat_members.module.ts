import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMembersService } from './chat_members.service';
import { ChatMembersController } from './chat_members.controller';
import { ChatMembers } from './chat_members.entity';
import { FriendsModule } from 'src/friends/friends.module';
import { Chat } from 'src/chat/chat.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ChatMembers]), TypeOrmModule.forFeature([Chat]), FriendsModule],
  providers: [ChatMembersService],
  controllers: [ChatMembersController],
  exports: [ChatMembersService],
})
export class ChatMembersModule {}