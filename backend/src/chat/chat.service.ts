import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { sha256 } from 'js-sha256';
import { MessagesService } from 'src/messages/messages.service';
import { Messages } from 'src/messages/messages.entity';
import { ChatMembersService } from 'src/chat_members/chat_members.service';
import { status } from 'src/status';
import { UsersService } from 'src/users/users.service';
import { ChatMembers } from 'src/chat_members/chat_members.entity';
import { randomBytes } from 'crypto';
import { retryWhen } from 'rxjs';

@Injectable()
export class ChatService {
  constructor(
	@InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
	private messageService: MessagesService,
	private chatMembersService: ChatMembersService,
	private userService: UsersService) {}

	async create(data: any): Promise<Chat> {

		//console.log(data)
		const alphanumericRegex = /^[a-zA-Z0-9]+$/;
   		if (data.name.length < 3 || data.name.length > 20 || !alphanumericRegex.test(data.name))
      		throw status.INVALID_CHATNAME;

		// if (data.password)
		// {
		// 	const lowercaseRegex = /[a-z]/;
		// 	const uppercaseRegex = /[A-Z]/;
		// 	const numberRegex = /[0-9]/;
		// 	const hasLowercase = lowercaseRegex.test(data.password);
		// 	const hasUppercase = uppercaseRegex.test(data.password);
		// 	const hasNumber = numberRegex.test(data.password);

		// 	if (!hasLowercase || !hasUppercase || !hasNumber || data.password.length < 8)
		// 		throw status.INVALID_PASSWORD
		// }
		//console.log("still alive");
		if (await this.chatRepository.findOne({where: {name: data.name}}) != undefined)
      		throw status.CHATNAME_ALREADY_EXIST;

			  //console.log("still alive1");
		const chat = new Chat();
		chat.is_private = data.is_private;
		chat.hashed_password = data.password == undefined ? null : sha256(data.password);
		chat.name = data.name;
		chat.owner_id = data.user_id;
		chat.invite_link = sha256(randomBytes(64));
		//console.log("still alive3");
		const res = await this.chatRepository.save(chat)
		//console.log("still aliv4e");
		data.channel_id = res.id;
		data.status = 2;
		await this.chatMembersService.create(data);
		//console.log("still aliv5e");

		var decorators = new ChatMembers();

		//console.log("still aliv8e");
		decorators.status= 3,
		decorators.channel_id = res.id;
		decorators.user = await this.userService.getGPT()

		//console.log("still aliv9e");
		decorators.user_id= decorators.user.id;
		await this.chatMembersService.create(decorators);

		return res;
	}

	async edit(data: any){
		var chat = await this.chatRepository.findOne({where: {name: data.chat}});
		if (chat == null)
			throw status.INVALID_RIGHTS;
		var user = await this.chatMembersService.isInChat(data.user_id, chat.id);
		if (user == null || user.status < 2)
			throw status.INVALID_RIGHTS;
		chat.is_private = data.is_private;
		chat.hashed_password = data.password == undefined ? null : sha256(data.password);
		await this.chatRepository.save(chat);
	}

	async join(data: any)
	{
		var chat = await this.chatRepository.findOne({where: {id: data.channel_id}});
		if (chat == null || (chat.hashed_password != null && chat.hashed_password != sha256(data.hashed_password)))
			throw status.INVALID_PASSWORD
		
		return this.chatMembersService.create(data);
	}

	async getChatByHash(hash: string)
	{
		hash = hash.trim();
		return await this.chatRepository.findOne({ where: { invite_link: hash }});
	}

	async getChatByName(name: string, id)
	{
		var res = await this.chatRepository.findOne({ where: { name: name }});
		if ((await this.chatMembersService.isInChat(id, res.id)) == null)	
			throw status.INVALID_RIGHTS;
		return res;
	}

	async getPublicChat(id: number)
	{
		var mychats = await this.chatMembersService.getAllByUserId(id);
		var pub = await this.chatRepository.find({ where: { is_private: false }});
		return pub.filter(elem => !mychats.find(f => f.id == elem.id));
	}
	
	async getMessagesByName(name: string): Promise<Messages[] | undefined>
	{
		var chat = await this.chatRepository.findOne({ where: { name: name }});
		if (chat == undefined)
			throw status.KO;
		return await this.messageService.findAll(chat.id);
	}

	async getUsersByName(me, name: string)
	{
		var chat = await this.chatRepository.findOne({ where: { name: name} });
		var users = await this.chatMembersService.getChatMembersChannelId(me, chat.id);

		return users;
	}

	async getChatByInviteLink(invite_link: string)
	{
		return await this.chatRepository.findOne({ where: { invite_link: invite_link }});
	}
}
