import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { Sockets } from './WebSocketServer';
import { MessagesModule } from './messages/messages.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/games.module';
import { FriendsModule } from './friends/friends.module';
import { NotifModule } from './notif/notif.module';
import { JwtModule } from '@nestjs/jwt';
import { ChatMembersModule } from './chat_members/chat_members.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { APP_FILTER } from '@nestjs/core';
import { ErrorToKokoFilter } from './app.filter';
// import { CorsModule } from '@nestjs/common';

@Module(
  // object passed to configure the module
  {
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      // __dirname is a global variable in Node.js that contains the dir name of current module
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // create db tables if not exist,update tables if they don't match current code
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '../pfp'),
      serveRoot: '/pfp',
    }),
    UsersModule,
    MessagesModule,
    ChatModule,
    GameModule,
    FriendsModule,
	NotifModule,
	ChatMembersModule,
  ],
  controllers: [AppController],
  providers: [AppService, Sockets, {
	provide: APP_FILTER,
	useClass: ErrorToKokoFilter,
  }],

})
export class AppModule {
}