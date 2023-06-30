import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameController } from './games.controller';
import { GameService } from './games.service';
import { GamePlayer } from './games.entity';
import { Users } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GamePlayer]), TypeOrmModule.forFeature([Users])],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
