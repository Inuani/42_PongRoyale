import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Messages } from './messages.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Messages)
    private messagesRepository: Repository<Messages>,
	private userService: UsersService
  ) {}

  async create(data: any): Promise<Messages> {
	if (data.user_id == -1)
	{
		data.user_id = (await this.userService.getGPT()).id;
		data.username = (await this.userService.getGPT()).username;
	}

    const message = new Messages();
    message.content = data.message;
	  message.username = data.username;
	  message.user = data.user_id;
	  message.channel = data.chat_id;

    // message.user = { id: userId } as any;
    // message.channel = { id: channelId } as any;
    return this.messagesRepository.save(message);
  }

  async findAll(channelId: number): Promise<Messages[]> {
    return this.messagesRepository.find({ where: { channel: { id: channelId } } });
  }
}
