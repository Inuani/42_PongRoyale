import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Users } from '../users/users.entity';
import { Chat } from '../chat/chat.entity';

@Entity('messages')
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, chat => chat.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channel_id', referencedColumnName: 'id' })
  channel: Chat;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Users;

  @Column({ length: 64 })
  username: string;

  @Column('text')
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  sent_at: Date;
}