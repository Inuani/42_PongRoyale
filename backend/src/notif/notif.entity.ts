import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Users } from '../users/users.entity';

@Entity('notif')
export class Notif {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    from: string;

    @Column()
    id_from: number;

    @Column()
    id_to: number;

    @Column({default: true})
    pending : boolean;

	@Column()
    message: string;

    @Column({nullable: true})
    link: string;
    
    @Column()
	type: string;
}