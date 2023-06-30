import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { status } from 'src/status';
import { authenticator } from 'otplib';
import { jwtService } from 'src/JWT';
import { avararUrl } from 'src/decorators';
import { sha256 } from 'js-sha256';

@Injectable()
export class UsersService{
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  	async getGPT()
	{
		var gpt = await this.usersRepository.findOne({where: {username: "@Decorators()", login: "@Decorators"}})
		if (gpt != undefined)
			return gpt;
		return await this.create({
			login: "@Decorators",
			username: "@Decorators()",
			bio: "We are the ones who made the all",
			two_factor: "Decorators, Fathers of Everything",
			two_factor_enabled: true,
			avatar_url:"https://th.bing.com/th/id/OIG._rCbTMUqGx2Nz7V2dVto?pid=ImgGn",
		});
	}

  async create(data: any): Promise<Users>
  {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (data.username.length < 3 || data.username.length > 20 || (!alphanumericRegex.test(data.username) && data.username != "@Decorators()"))
      throw status.INVALID_USERNAME;

    if (await this.usersRepository.findOne({where: {username: data.username}}) != undefined)
      throw status.USERNAME_ALREADY_EXIST;
    if (await this.usersRepository.findOne({where: {login: data.login}}) != undefined)
      throw status.USERNAME_ALREADY_EXIST;

      const user = new Users();
      if (data.password != undefined)
        user.password = sha256(data.password);
      user.login = data.login;
      user.username = data.username;
      user.bio = data.bio;
      user.two_factor = data.two_factor;
      user.two_factor_enabled = data.two_factor_enabled;
      user.avatar_url = data.avatar_url;
      return this.usersRepository.save(user);
  }

  async edit(data: any): Promise<Users>
  {
	var user = await this.usersRepository.findOne({where: {username: data.old}});
	if (user == undefined)
		throw status.INVALID_USER_TOKEN;
	//console.log(data.old, data.username)
	if (data.old != data.username && await this.usersRepository.findOne({where: {username: data.username}}) != undefined)
		throw status.USERNAME_ALREADY_EXIST;

    user.username = data.username;
    user.bio = data.bio;
	if (user.two_factor_enabled == false && data.two_factor_enabled)
		user.two_factor = data.two_factor;
	user.two_factor_enabled = data.two_factor_enabled;
    user.avatar_url = data.avatar_url;
    return this.usersRepository.save(user);
  }
  
//   async setUserHash(login: string, hash:string)
//   {
//     var user = await this.getUserByLogin(login);
//     if (user == undefined)
//       return undefined;
//     user.hash = hash;
//     return this.usersRepository.save(user);
//   }

  async login(data: any): Promise<string>
  {
    var user = await this.usersRepository.findOne({ where: { username: data.username }});
    if (user == undefined)
      throw status.INVALID_USERNAME;
    //console.log(data.password, user.password);
    if (sha256(data.password) != user.password)
      throw status.INVALID_PASSWORD;
    if (user.two_factor_enabled && !this.verifyToken2fa(user.two_factor, data.token))
      throw status.INVALID_2FA;
    var payload = {
      username: user.username,
      id: user.id,
      rights: 1,
	}
    return jwtService.sign(payload);
  }

  async getUserByLogin(login: string): Promise<Users | undefined>
  {
    return await this.usersRepository.findOne({ where: { login: login }});
  }
  async getUserByUsername(username: string): Promise<Users | undefined>
  {
    return await this.usersRepository.findOne({ where: { username: username }});
  }

  async profile(username: string)
  {
    var user = await this.usersRepository.findOne({ where: { username: username }});
    if (user == undefined)
      throw status.INVALID_USER;
      return {
      username: user.username,
      avatar_url: avararUrl(user.avatar_url),
      bio: user.bio,
      id: user.id,
      elo: user.elo,
    } 
  }

  async getUserByHash(token: string): Promise<Users | undefined>
  {
    var payload = jwtService.verify(token);
    return await this.usersRepository.findOne({ where: { id: payload.id }})
  }

  generateSecretKey(): string {
    const secretKey = authenticator.generateSecret();
    return secretKey;
  }

  generateQRCodeUrl(username: string, issuer: string, secretKey: string): string {
    const otpAuthUrl = authenticator.keyuri(username, issuer, secretKey);
    return otpAuthUrl;
  }

  verifyToken2fa(secretKey: string, token: string): boolean {
    const isValid = authenticator.check(token, secretKey);
    return isValid;
  }

  generate(payload: any): string {
    return jwtService.sign(payload);
  }

}


