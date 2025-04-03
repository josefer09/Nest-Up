import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";


@Entity('roles')
export class Role {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    name: string;

    @ManyToMany(() => User, (user) => user.roles, { lazy: true } )
    users: User[];

    @BeforeInsert()
    checkBeforeInsert() {
        this.name = this.name.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkBeforeUpdate() {
        this.checkBeforeInsert();
    }

}
