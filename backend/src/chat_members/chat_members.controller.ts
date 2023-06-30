import { Controller, Get, Request, Post, Body, Param, Inject, Headers, UseGuards } from '@nestjs/common';
import { ChatMembersService } from './chat_members.service';
import { AuthGuard } from 'src/app.guard';
import { RequestUser, StatusOK, User } from 'src/decorators';

@Controller('chat_members')
export class ChatMembersController {
  constructor(private readonly chatMembersService: ChatMembersService) {}

  //NOT Safe
  @UseGuards(new AuthGuard(1))
  @Get("/all")
  @StatusOK
  async getUserChats(@Request() req: RequestUser): Promise<any> {
    return {all: await this.chatMembersService.getChatsByUserId(req.user.id)};
  }

  //NOT Safe
  @UseGuards(new AuthGuard(1))
  @Get("/remove")
  @StatusOK
  async removeUserChats(@Headers() headers, @Request() req: RequestUser): Promise<any>
  {
	var data = {
		user_id: req.user.id,
		chat_id: headers.chat_id,
	}
	await this.chatMembersService.quitChat(data);
    return {}
  }

//   //NOT Safe
//   @UseGuards(new AuthGuard(1))
//   @Get()
//   @StatusOK
//   async getChatMembers(@Headers() headers) {
//     // return await this.chatMembersService.getChatMembersByHash(headers.token);
//   }

  @UseGuards(new AuthGuard(1))
  @Get('members_of_channel')
  @StatusOK
  async getUsersByChannelId(@Headers() headers: {channel_id: number}, @Request() req: RequestUser) : Promise<{members_of_channel: User[]}>
  {
    return {members_of_channel: await this.chatMembersService.getChatMembersChannelId(req.user.id , headers.channel_id)};
  }

}
