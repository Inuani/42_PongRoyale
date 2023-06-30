import { Controller, Post, Body, Get, Headers, UseGuards, Request, Query } from '@nestjs/common';
import { NotifService } from './notif.service';
import { AuthGuard } from 'src/app.guard';
import type { Notif } from './notif.entity'
import { RequestUser, StatusOK } from 'src/decorators';

@Controller('notif')
export class NotifController {

    constructor ( private notifService : NotifService) {}

	// Safe
	@UseGuards(new AuthGuard(1))
    @Get('to')
	@StatusOK
	async getNotifsTo(@Request() req: RequestUser) : Promise<{notifs: Notif[]}> {
        return {notifs: await this.notifService.getNotifsTo(req.user.id)};
	}

	// Safe
	@UseGuards(new AuthGuard(1))
    @Get('from')
	@StatusOK
	async getNotifsFrom(@Request() req: RequestUser) : Promise<{notifs: Notif[]}> {
		return {notifs: await this.notifService.getNotifsFrom(req.user.id)};
	}

	// @Get('friends')
	// async checkFriendNotif(@Query('id_from') idFrom: number, @Query('id_to') idTo: number) {
	// 	const isFriend = await this.notifService.checkFriendNotif(idFrom, idTo);
	// 	return {isFriend};
	// }

}
