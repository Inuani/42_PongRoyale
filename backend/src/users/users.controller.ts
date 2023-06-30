import { UseGuards, Request, UseFilters, Res, Redirect} from '@nestjs/common';

import { AuthGuard } from '../app.guard';
import { get42Infos, get42Token } from './user.42';
import { Controller, Post, Get, Body, Headers, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { sha256 } from "js-sha256";
import { status } from '../status';
import * as path from 'path';
import * as multer from 'multer'; // handle multipart/form-data, used for uploading files
import { Users } from './users.entity';
import { RequestUser, StatusOK, avararUrl } from 'src/decorators';
import { randomBytes } from 'crypto';


/////////////PFP////////////////////////////
const pfpStorage = multer.diskStorage({
	destination: function (req: any, file: any, callback :any)
	{
		// req : http request
		// callback when processing file is done. return the value wanted
		callback(null, __dirname + '../../../pfp');
	},
	filename: function (req: any, file : any, callback : any)
	{
		// file: infos about the file (types, size, etc.
		callback(null, Date.now() + '_' + file.originalname);
	}
});

const fileChecker = (req: any, file: any, callback: any) =>
{
	const ext = path.extname(file.originalname).toLowerCase();
	if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.gif')
		return callback(new Error('only images are allowed'), false);
	return callback(null, true);
};



@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService){}

	// Safe
	// get my infos without 42
	@Get('login')
	@StatusOK
	async login(@Headers() header:any): Promise<{token: string}>
	{
		return {
			token: await this.usersService.login(header)
		}
	}

	// @Get('/42token')
	// @Redirect('', 302)
	// redirect(@Res() res: Response) {
	//   // Perform any necessary logic before redirecting
	  
	//   // Redirect to a specific frontend route
	//   return res.redirect('/your-frontend-route');
	// }

	// Safe
	// get my infos without 42
	@Get('anon')
	@StatusOK
	async anon(@Headers() header:any)
	{
		var username = `User_${Math.round(Math.random() * 999999)}`
		var id = randomBytes(40).toString('hex');
		return ({
			token: this.usersService.generate({
					username: username,
					id: id,
					rights: 0,
			}),
			username: username,
			id: id,
		})
	}

	// Safe
	@Post('create')
	@StatusOK
	async create(@Body() data: any): Promise<any> {
		var user = await this.usersService.create(data);
		return ({
			token: this.usersService.generate({
					username: user.username,
					id: user.id,
					rights: 1,
			})
		})
	}

	// Safe
	@Get('42')
	@StatusOK
	async userExist(@Headers('code') code: string): Promise<any> {

		var token = await get42Token(code);
		let info = await get42Infos(token);

		var user = await this.usersService.getUserByLogin(info.login);
		if (user == undefined)
			return ({
				token: undefined,
				info: info,
			});
		return ({
			token: this.usersService.generate({
				username: user.username,
				id: user.id,
				rights: ["albaud", "egauthey", "amuhleth", "lskraber"].includes(user.login) ? 2 : 1,
			}),
		});
	}
	
	// Safe
	// get new 2fa
	@Get('2fa')
	@StatusOK
	generateSecretKey(): { secretKey: string; qrCodeUrl: string } {
		const secretKey = this.usersService.generateSecretKey();
		const qrCodeUrl = this.usersService.generateQRCodeUrl(
			'Albaud',
			'PongRoyal',
			secretKey,
		);
		return { 
			secretKey,
			qrCodeUrl,
		};
	}

	// Safe
	// validate 2fa
	@Post('2fa')
	@StatusOK
	test(@Body() loginDto) {
		const { token, secret } = loginDto;
		const isTokenValid = this.usersService.verifyToken2fa(secret, token);

		if (!isTokenValid)
			throw status.INVALID_2FA;
		return {
			status: status.OK,
		};
	}

	// Safe
	@UseGuards(new AuthGuard(1))
	@Post('edit')
	@StatusOK
	async edit(@Body() data: any, @Request() req: RequestUser): Promise<any> {
		data.old = req.user.username;
		var user = await this.usersService.edit(data);
		return ({
			token: this.usersService.generate({
					username: user.username,
					id: user.id,
					rights: 1,
			})
		})
	}

	// Safe
	// get my infos
	@UseGuards(new AuthGuard(1))
	@Get('me')
	@StatusOK
	async data(@Request() req: RequestUser) : Promise<{user: Users | undefined}>
	{

		var user = await this.usersService.getUserByUsername(req.user.username);
		if (user == undefined)
			throw status.INVALID_USER_TOKEN;
		user.avatar_url = avararUrl(user.avatar_url);
		return {
			user:user,
		};
	}
	
	// Safe
	// get user profile
	@UseGuards(new AuthGuard(1))
	@Get('profile')
	@StatusOK
	async profile(@Headers('username') username:string)
	{
		var user = await this.usersService.profile(username);
		if (user == undefined)
			throw status.INVALID_USERNAME;
		return {
			user: user,
		};
	}

	// Safe
	@Post('upload')
	@UseInterceptors(FileInterceptor('pfp', // FileInterceptor for handling multipart form data. uses multer
	{
		storage: pfpStorage,
		fileFilter: fileChecker,
		limits: { fileSize: 6 * 1024 * 1024 }
	}))
	@StatusOK
	async upload(@UploadedFile() file): Promise<any> {
		return ({
			filename: file.filename.toString()
		});
	}
}

