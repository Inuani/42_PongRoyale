import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity('game_player')
export class GamePlayer {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
    username: string;

    @Column()
    place: number;

	@Column()
    a_players: number;

	@Column()
    game_id: string;
}
