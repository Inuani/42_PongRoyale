import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { DirectMessages, Friends } from './friends.entity';
import { Notif } from 'src/notif/notif.entity';
import { ChatMembers } from 'src/chat_members/chat_members.entity';
import { avararUrl } from 'src/decorators';
import type { Users } from 'src/users/users.entity';
import { status } from 'src/status';

@Injectable()
export class FriendsService{

    constructor (
        @InjectRepository(Friends) 
        private friendsRepository: Repository<Friends>,
		@InjectRepository(DirectMessages)
		private dmRepository: Repository<DirectMessages>,
		@InjectRepository(Notif)
		private notifRepository: Repository<Notif>,
		@InjectRepository(ChatMembers)
		private chatMembersRepository: Repository<ChatMembers>,
        ) {}

    
    async areFriends(id_from: number, id_to: number): Promise<string> {
		
        const alreadyFriend : Friends | null = await this.friendsRepository.findOne({
            where: [
                { user_id: id_from, friend_id: id_to },
                { user_id: id_to, friend_id: id_from }
            ]
        });
		if (alreadyFriend != null)
		{
			if (!alreadyFriend.blocked)
				return "friends";
			else if (alreadyFriend.user_id == id_from)
				return "ublocked";
			return "blocked";
		}
		const pendingNotif : Notif | null = await this.notifRepository.findOne({
			where: {
				id_from: id_from,
				id_to: id_to,
				type: 'friend',
				pending: true 
			}
		})
		if ( pendingNotif != null)
			return "request_sent";
		return "not_friends";
    }

	async killFriend(id_from: number, id_to: number) : Promise<void>
	{
		await this.friendsRepository.delete({ user_id: id_from, friend_id: id_to });
		await this.friendsRepository.delete({ user_id: id_to, friend_id: id_from });
	}

	async blockUser(id_from: number, id_to: number) : Promise<void> {
		await this.killFriend(id_from, id_to);
		var friend = new Friends();
		friend.friend_id = id_to;
		friend.user_id = id_from;
		friend.blocked = true;
		this.friendsRepository.save(friend);
    }

    async addFriend (usersId: any): Promise<Friends>
    {

        const alreadyFriend : Friends = await this.friendsRepository.findOne
        ({
            where: [
                { user_id: usersId.my_id, friend_id: usersId.friend_id },
                { user_id: usersId.friend_id, friend_id: usersId.my_id }
            ]
        });

        // const alreadyFriend = await this.areFriends(usersId.my_id, usersId.friend_id);

        if (alreadyFriend) {
            // throw new Error ('You are already friend!');
            return ;
        }

        const newFriend : Friends = new Friends();
        newFriend.user_id = usersId.my_id;
        newFriend.friend_id = usersId.friend_id;

        return this.friendsRepository.save(newFriend);
    }

	async getFriends(usersId: number) : Promise<{
		username: string;
		avatar_url: string;
		id: number;
	}[]>
    {
		const friends = await this.friendsRepository.find({where: 
			[{user_id: usersId, blocked: false}, {friend_id: usersId, blocked: false}], relations: ['user','friend']
		})

        return friends.map((entry) => {
            const friend : Users = entry.user_id === usersId ? entry.friend : entry.user;
    
            return {
                username: friend.username,
                avatar_url: avararUrl(friend.avatar_url),
                id: friend.id,
            };
        });
	}

	async getFriendsChat (link: string, channel_id: number, user: number) : Promise<any>
    {
		const friends : Friends[] = await this.friendsRepository.find({where: 
			[{user_id: user, blocked: false}, {friend_id: user, blocked: false}], relations: ['user','friend']
		})

        return Promise.all(friends.map(async (entry) => {
			let status : string = 'not_invited';
            const friend : Users = entry.user_id === user ? entry.friend : entry.user;

			const chatMember = await this.chatMembersRepository.findOne({
				where: {user_id: friend.id, channel_id: channel_id}
			})
			if (chatMember != null)
				status = 'already_in';
			
			const pendingNotif : Notif | null = await this.notifRepository.findOne({
				where: {
					id_from: user,
					id_to: friend.id,
					type: 'chat',
					pending: true,
					link: link
				}
			})

			if (pendingNotif != null)
				status = 'invite_sent';

            return {
                username: friend.username,
                avatar_url: avararUrl(friend.avatar_url),
                id: friend.id,
				status: status,
            };
        }));
	}

	async getFriendsGame (link: string, user: number) : Promise<any>
    {
		const friends : Friends[] = await this.friendsRepository.find({where: 
			[{user_id: user, blocked: false}, {friend_id: user, blocked: false}], relations: ['user','friend']
		})

        return Promise.all(friends.map(async (entry) => {
			let status = 'not_invited';
            const friend : Users = entry.user_id === user ? entry.friend : entry.user;

			const pendingNotif = await this.notifRepository.findOne({
				where: {
					id_from: user,
					id_to: friend.id,
					type: 'game',
					pending: true,
					link: link
				}
			})

			if (pendingNotif != null)
				status = 'invite_sent';

            return {
                username: friend.username,
                avatar_url: avararUrl(friend.avatar_url),
                id: friend.id,
				status: status,
            };
        }));
	}

	async create_dm(data: any): Promise<DirectMessages> {
		const message : DirectMessages= new DirectMessages();
		message.from_id = data.from_id;
		message.to_id = data.to_id;
		message.message = data.message;
		return this.dmRepository.save(message);
	  }
	
	  async get_dm(data: any): Promise<DirectMessages[]> {
		if (await this.areFriends(data.from_id, data.to_id) != "friends")
			throw status.INVALID_RIGHTS;
		var messages : Promise<DirectMessages[]> = this.dmRepository.find({ where: [
			{ from_id: data.from_id, to_id: data.to_id },
			{ from_id: data.to_id, to_id: data.from_id }
		] });
		return messages;
	  }
}