import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { DirectMessages, Friends } from './friends.entity';
import { NotifService } from 'src/notif/notif.service';
import { NotifModule } from 'src/notif/notif.module';
import { Notif } from 'src/notif/notif.entity';
import { ChatMembers } from 'src/chat_members/chat_members.entity';
import { GamePlayer } from 'src/game/games.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Friends]), TypeOrmModule.forFeature([DirectMessages]), TypeOrmModule.forFeature([Notif]), TypeOrmModule.forFeature([ChatMembers])],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}