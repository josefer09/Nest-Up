import { Role } from "src/role/entities/role.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    email: string;

    @ManyToMany( () => Role, (role) => role.users)
    @JoinTable({
        name: 'user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id'},
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id'}
    })
    roles: Role[];
}
