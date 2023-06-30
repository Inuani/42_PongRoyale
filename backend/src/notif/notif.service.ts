import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notif } from './notif.entity';
// import { Server } from 'socket.io';
import { FriendsService }  from '../friends/friends.service';
import { ChatMembersService } from '../chat_members/chat_members.service';
import { ChatService } from '../chat/chat.service';
// import { GameService } from '../game/games.service';

@Injectable()
export class NotifService{

    constructor(
        @InjectRepository(Notif)
        private notifRepository: Repository<Notif>,
		private friendsService: FriendsService,
		private chatMembersService: ChatMembersService,
		private chatService: ChatService,
		// private gameService: GameService,
    ) {}

	async createNotif(data: any) : null | Promise<Notif>
	{
		const existNotif = await this.notifRepository.findOne({
			where: {
			type: data.type,
			link: data.link,
			id_from: data.id_from,
			id_to: data.id_to,
			from: data.from,
			pending : true,
			}
		});

		if (existNotif) {
			return null;
		}

        const notif = new Notif();
	    notif.type = data.type;
        notif.link = data.link;
        notif.id_from = data.id_from;
        notif.id_to = data.id_to;
        notif.message = data.message;
		notif.from = data.from;
		if (data.type == "else")
        	notif.pending = false;
		return await this.notifRepository.save(notif);
	}

	async unpending(data: any) : Promise<void>
	{
		// console.table(data);
		await this.notifRepository.update(data.notif.id, {pending: data.notif.pending})
	}

	async getNotifsFrom(user_id : number) : Promise<Notif[]>
	{
		return await this.notifRepository.find({where: {id_from: user_id}});
	}

	async getNotifsTo(user_id : number) : Promise<Notif[]>
	{
		return await this.notifRepository.find({where: {id_to: user_id}});
	}

	async handleGameNotif(data: any) : Promise<"game request accepted" | "game request not accepted">
	{
		if (data.response === true)
		{
			// console.table(data)
			// let gameToJoin = await this.gameService.getGame(data.notif.link)

			// console.table(gameToJoin)
			// await this.gameService.create({
			// 	id: gameToJoin.id,
			// 	game_id: data.notif.id_to
			// })
			return 'game request accepted';
		}
		return 'game request not accepted';
	}

	async handleFriendNotif(data: any): Promise<string>
	{
		if (data.response == true)
		{
			await this.friendsService.addFriend({my_id: data.notif.id_from, friend_id: data.notif.id_to})
			return "friend request accepted";
		}
		return "friend request not accepted";
	}

	async handleChatNotif(data: any): Promise<string>
	{
		if (data.response === true)
		{
			//console.table(data)
			let chatToJoin = await this.chatService.getChatByHash(data.notif.link)
			
			//console.table(chatToJoin)
			await this.chatMembersService.create({
				status: 0,
				channel_id: chatToJoin.id,
				user_id: data.notif.id_to
			})
			return 'chat request accepted';
		}
		return 'chat request not accepted';
	}

	async checkFriendNotif(id_from: number, id_to: number): Promise<boolean> {
		const pendingNotif = await this.notifRepository.findOne({
			where: {
				id_from: id_from,
				id_to: id_to,
				type: 'friend',
				pending: true 
			}
		})
		return pendingNotif != null;
	}

	async handleElseNotif(data: any) : Promise<void>
	{
		
	}
}