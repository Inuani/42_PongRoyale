import { Entity, ManyToOne, JoinColumn, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../users/users.entity';

@Entity('friends')
export class Friends {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  friend_id: number;

  @Column({ default: false})
  blocked: boolean;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Users;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'friend_id', referencedColumnName: 'id' })
  friend: Users;
}

@Entity('direct_messages')
export class DirectMessages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from_id: number;

  @Column()
  to_id: number;

  @Column()
  message: string;
}