import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Users } from '../users/users.entity';
import { ChatMembers } from 'src/chat_members/chat_members.entity';
import { Messages } from 'src/messages/messages.entity';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ unique: true, nullable: true})
  invite_link: string;

  @Column({ default: false })
  is_private: boolean;

  @Column({ nullable: true })
  hashed_password: string;

  @Column({ default: 8 })
  owner_id: number;

  @OneToMany(() => ChatMembers, member => member.channel, { cascade: true })
  members: ChatMembers[];

  @OneToMany(() => Messages, member => member.channel, { cascade: true })
  messages: Messages[];
}
