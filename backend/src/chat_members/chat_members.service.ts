import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ChatMembers } from './chat_members.entity';
import { UsersService } from 'src/users/users.service';
import { Notif } from 'src/notif/notif.entity';
import { userInfo } from 'os';
import { FriendsService } from 'src/friends/friends.service';
import { Chat } from 'src/chat/chat.entity';
import { avararUrl } from 'src/decorators';
import { status } from 'src/status';

@Injectable()
export class ChatMembersService {
  constructor(
	@InjectRepository(ChatMembers)
    private chatMembersRepository: Repository<ChatMembers>,
	@InjectRepository(Chat)
	private chatRepository: Repository<Chat>,
	private friendService: FriendsService,
  ) {}

	async create(data: any): Promise<ChatMembers> {
		var user = await this.chatMembersRepository.findOne({where: {channel_id: data.channel_id, user_id: data.user_id}});
		if (user)
		{
			if (user.status == -2)
				throw "you have been banned";
			return ;
		}
		const chat = new ChatMembers();
		
		chat.channel_id = data.channel_id;
		chat.status = data.status;
		chat.user_id = data.user_id;
		return this.chatMembersRepository.save(chat);
	}

	async getChatMembersChannelId(me: number, id: number)
	{
		var users = (await this.chatMembersRepository.find({ where: { channel_id: id, status: Not(-2) }, relations: ['user']}))
		var res = await Promise.all(users.map(async member => {
			return ({
				role: member.status,
				username: member.user.username,
				avatar_url: avararUrl(member.user.avatar_url),
				bio: member.user.bio,
				id: member.user.id,
				status: await this.friendService.areFriends(me, member.user.id),
			})}));
		return res;
	}

	async getChatsByUserId(id: number)
	{
		var temp = await this.chatMembersRepository.find({ where: { user_id: id, status: Not(-2)}, relations: ['channel']});
		return temp.map(member => member.channel);
	}

	async getAllByUserId(id: number)
	{
		var temp = await this.chatMembersRepository.find({ where: { user_id: id}, relations: ['channel']});
		return temp.map(member => member.channel);
	}

	async isInChat(id: number, chat_id: number)
	{
		return await this.chatMembersRepository.findOne({ where: { user_id: id, channel_id: chat_id, status: Not(-2)}});
	}

	async quitChat(data: any)
	{
		var user = await this.chatMembersRepository.findOne({where: { user_id: data.user_id, channel_id: data.chat_id }});
		await this.chatMembersRepository.delete({ user_id: data.user_id, channel_id: data.chat_id });
		if (user.status != 2)
			return ;
		var status = 1;
		var newOwner = undefined
		while (newOwner == undefined && status >= -1)
			newOwner = await this.chatMembersRepository.findOne({where: { channel_id: data.chat_id, status: status-- }});
		if (newOwner == undefined)
		{
			await this.chatRepository.delete(data.chat_id);
			return ;
		}
		newOwner.status = 2;
		this.chatMembersRepository.save(newOwner);
		
	}

	async kickUser(data: {user_id: number, chat_id: number, target: number, status: number})
	{
		

		var target = await this.chatMembersRepository.findOne({where: {user_id: data.target, channel_id: data.chat_id}})

		if (data.user_id <= target.status || target.status == -2)
			throw 1; // Too low st;

		await this.chatMembersRepository.delete({ user_id: data.target, channel_id: data.chat_id });
	}

	async changeUserStatus(data: {user_id: number, chat_id: number, target: number, status: number})
	{

		if (data.status < -2 || data.status >= 2)
			throw 1; // Invalid status;
		var target = await this.chatMembersRepository.findOne({where: {user_id: data.target, channel_id: data.chat_id}})

		if (data.user_id <= target.status)
			throw 1; // Too low st;

		target.status = data.status;
		this.chatMembersRepository.save(target);
	}

	// async isUserInChat(id_from: number , id_to: number, channel_id: number): Promise<boolean> {
	// 	const chatMember = await this.chatMembersRepository.findOne({
	// 		where: {user_id: id_to, channel_id: channel_id}
	// 	})
	// 	if (chatMember != null)
	// 		return true;
	// 	return false;
	// }

	// async findAll(channelId: number)
	// {
	// 	var temp = await this.chatMembersRepository.find({ where: { channel_id: channelId, status: Not(-2) }, relations: ['user']});
	// 	return temp;
	// }
}
