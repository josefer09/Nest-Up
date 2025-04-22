import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "@user/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity('roles')
export class Role {

    @ApiProperty({
        example: 'bfe539c8-b9e4-453c-8176-74ffccdf5748',
        description: 'UUID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'admin',
        description: 'Role name',
        required: true,
        uniqueItems: true,
    })
    @Column('text', { unique: true })
    name: string;

    @ManyToMany(() => User, (user) => user.roles, { lazy: false } )
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
