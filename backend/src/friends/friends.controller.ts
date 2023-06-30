import { Controller, Post, Body, Get, Headers, UseGuards, Request, Query } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { AuthGuard } from 'src/app.guard';
import { RequestUser, StatusOK } from 'src/decorators';
import type { DirectMessages } from './friends.entity';

@Controller('friends')
export class FriendsController {

    constructor( private friendsService: FriendsService) {}

	// Safe
	@UseGuards(new AuthGuard(1))
	@Get()
	@StatusOK
    async getFriends (@Request() req : RequestUser) : Promise<{
		friends: {
			username: string;
			avatar_url: string;
			id: number;
		}[]}>
	{
        return {
			friends: await this.friendsService.getFriends(req.user.id)
		};
    }

	// Safe
	@UseGuards(new AuthGuard(1))
	@Get("chat")
	@StatusOK
    async getFriendsChat (@Headers() headers : any, @Request() req : RequestUser) : Promise<any>
	{
		const { link, channel_id } = headers;
        return {chat: await this.friendsService.getFriendsChat(link, channel_id, req.user.id)};
    }

	@UseGuards(new AuthGuard(1))
	@Get("game")
	@StatusOK
    async getFriendsGame (@Headers() headers : any, @Request() req : RequestUser) : Promise<any>
	{
		const { link } = headers;
        return {game: await this.friendsService.getFriendsGame(link, req.user.id)};
    }

  	// Safe
	@UseGuards(new AuthGuard(1))
	@Get('dms')
	@StatusOK
	async getDms(@Headers() body : any, @Request() req : RequestUser) : Promise<{dms: DirectMessages[]}>
	{
		var t = {
			from_id:req.user.id,
			to_id: body.to_id,
		}
	  return {
			dms: await this.friendsService.get_dm(t)
		};
	}

	@UseGuards(new AuthGuard(1))
	@Get('status')
	@StatusOK
	async getFriendshipStatus(@Headers('user_id') user_id : number, @Request() req : RequestUser) : Promise<{
		friendStatus: string;
	}> {
		return {
			friendStatus: await this.friendsService.areFriends(req.user.id, user_id)
		};
	}

	@UseGuards(new AuthGuard(1))
	@Post('block')
	@StatusOK
	async blockUser(@Body('user_id') user_id : number, @Request() req : RequestUser) : Promise<{}>{
		await this.friendsService.blockUser(req.user.id, user_id);
		return {};
	}

	@UseGuards(new AuthGuard(1))
	@Post('kill')
	@StatusOK
	async killFriend(@Body('user_id') user_id : number, @Request() req : RequestUser) : Promise<{}> {
		await this.friendsService.killFriend(req.user.id, user_id);
		return {};
	}
}