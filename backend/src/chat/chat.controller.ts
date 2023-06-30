import { Controller, Get, Post, Body, Request, Headers, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/app.guard';
import { RequestUser, StatusOK } from 'src/decorators';
import { Chat } from './chat.entity';
import { status } from 'src/status';
@Controller('chat')

export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	//Controlllll rights

	//NOT Safe
	@UseGuards(new AuthGuard(1))
	@Get('/messages')
	@StatusOK
	async getMessages(@Headers() headers, @Request() req: RequestUser): Promise<any> {
		var messages = await this.chatService.getMessagesByName(headers.name);
		var users = await this.chatService.getUsersByName(req.user.id, headers.name);
		return {
			messages: messages,
			users: users,
		};
	}

	//NOT Safe
	@UseGuards(new AuthGuard(1))
	@Get()
	@StatusOK
	async getChat(@Headers() headers, @Request() req: RequestUser): Promise<any>{
		var chat: Chat = await this.chatService.getChatByName(headers.name, req.user.id);
		return {
			pass: chat.hashed_password != null,
			name: chat.name,
			id: chat.id,
			is_private: chat.is_private,
			invite_link: chat.invite_link,
			owner_id: chat.owner_id,
		}
	}
  
	@UseGuards(new AuthGuard(1))
	@Get('invite_link')
	@StatusOK
	async getChatByInviteLink(@Headers() headers){
		var chat: Chat = await this.chatService.getChatByInviteLink(headers.invite_link);
		return {
			pass: chat.hashed_password != null,
			name: chat.name,
			id: chat.id,
			is_private: chat.is_private,
			invite_link: chat.invite_link,
			owner_id: chat.owner_id,
		}
	}

	//NOT Safe
	@UseGuards(new AuthGuard(1))
	@Get("/public")
	@StatusOK
 	async getPublic(@Request() req: RequestUser): Promise<any> {
		var chats = await this.chatService.getPublicChat(req.user.id);
		return  {public: chats.map(chat => ({
			pass: chat.hashed_password != null,
			name: chat.name,
			id: chat.id,
			is_private: chat.is_private,
			invite_link: chat.invite_link,
			owner_id: chat.owner_id,
		}))}
	}

	//NOT Safe
	@UseGuards(new AuthGuard(1))
	@Post('create')
	@StatusOK
	async create(@Body() content:any, @Request() res: RequestUser): Promise<any> {
		content.user_id = res.user.id;
		var chat = await this.chatService.create(content);
		return {
			token: chat.invite_link,
		};
	}

	//NOT Safe
	@UseGuards(new AuthGuard(1))
	@Post('edit')
	@StatusOK
	async edit(@Body() content:any, @Request() res: RequestUser): Promise<any> {
		
		content.user_id = res.user.id;
		//console.log(content);
		var chat = await this.chatService.edit(content);
		return {};
	}
	//NOT Safe
	// content: id, user_id,
	@UseGuards(new AuthGuard(1))
	@Post('/join_id')
	@StatusOK
	async join(@Body() content:any, @Request() res: RequestUser): Promise<any>
	{
		content.user_id = res.user.id;
		await this.chatService.join(content);
		return {};
	}
}
