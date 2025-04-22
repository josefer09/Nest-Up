import { Role } from '@role/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'a19e1b72-2311-445b-8a7b-3ccacd4f3e0e' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @Column('text', { unique: true, nullable: false })
  email: string;

  @ApiProperty({ example: 'hashedpassword', description: 'Encrypted password', writeOnly: true })
  @Column('text', { select: false, nullable: false })
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @Column('text', { nullable: false })
  fullName: string;

  @ApiProperty({ example: true })
  @Column('bool', { default: true, nullable: false })
  isActive: boolean;

  @ApiProperty({ example: false })
  @Column('bool', { default: false, nullable: false })
  isVerified: boolean;

  @ApiProperty({ type: () => [Role], description: 'User roles' })
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
    if (this.email) return this.checkBeforeInsert();
  }
}
