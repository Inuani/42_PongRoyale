import { Entity, Column, PrimaryGeneratedColumn, } from 'typeorm';

@Entity('users')
export class Users {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 20, unique: true })
	username: string;

	@Column({ length: 20, unique: true })
	login: string;

	@Column({ length: 124, nullable: true })
	password: string;

	@Column({ default: 600})
	elo: number;

	@Column({ length: 400 })
	bio: string; 

	@Column({ length: 255, nullable: true })
	avatar_url: string;

	@Column({ default: false })
	two_factor_enabled: boolean;

	@Column({ nullable: true })
	two_factor: string
}

