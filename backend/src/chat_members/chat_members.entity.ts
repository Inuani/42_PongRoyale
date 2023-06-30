import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from '../users/users.entity';
import { Chat } from 'src/chat/chat.entity';

@Entity('chat_members')
export class ChatMembers {

    @PrimaryColumn()
    user_id: number;

    @PrimaryColumn()
    channel_id: number;

    @ManyToOne(() => Users)
    @JoinColumn({ name: 'user_id'})
    user: Users;

    @ManyToOne(() => Chat, chat => chat.members, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'channel_id'})
    channel: Chat;

    @Column({ default: 0 })
    status: number;
}
