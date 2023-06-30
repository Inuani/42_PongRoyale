import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifController } from './notif.controller';
import { NotifService } from './notif.service';
import { Notif } from './notif.entity';
import { FriendsModule }  from '../friends/friends.module';
import { ChatMembersModule } from '../chat_members/chat_members.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notif]), FriendsModule, ChatModule, ChatMembersModule],
  controllers: [NotifController],
  providers: [NotifService],
  exports: [NotifService],
})
export class NotifModule {}