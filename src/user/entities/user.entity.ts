import { Role } from 'src/role/entities/role.entity';
import {
    BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true, nullable: false })
  email: string;

  @Column('text', { select: false, nullable: false })
  password: string;

  @Column('text', { nullable: false })
  fullName: string;

  @Column('bool', { default: true, nullable: false })
  isActive: boolean;

  @Column('bool', { default: false, nullable: false })
  isVerified: boolean;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @BeforeInsert()
  checkBeforeInsert() {
    this.email = this.email.toLocaleLowerCase().trim();
  }

  @BeforeUpdate()
  checkBeforeUpdate() {
    if( this.email ) return this.checkBeforeInsert();
  }
}
