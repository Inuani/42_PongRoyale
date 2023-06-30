import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Messages } from './messages.entity';
import { AuthGuard } from 'src/app.guard';

@Controller('channels/:channelId/messages')
export class MessagesController
{
  constructor(private readonly messagesService: MessagesService) {}

}
