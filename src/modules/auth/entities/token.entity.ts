import { User } from "@user/entities/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { TokenType } from "../enums";
import { ApiProperty } from '@nestjs/swagger';

@Entity('tokens')
@Unique(['user'])
export class Token {
    @ApiProperty({ example: '5eafc18a-f1a1-4f8b-8260-abcdef123456', description: 'UUID of the token' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ type: () => User, description: 'User associated with the token' })
    @ManyToOne(() => User, (user) => user.id, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id'})
    user: User;

    @ApiProperty({ enum: TokenType, example: TokenType.PASSWORD_RESET, description: 'Type of the token' })
    @Column('enum', { enum: TokenType, nullable: false })
    tokenType: TokenType;

    @ApiProperty({ example: 'ABC123X', description: 'Unique token string' })
    @Column('text', { unique: true, nullable: false })
    token: string;

    @ApiProperty({ example: new Date(Date.now() + 600000).toISOString(), description: 'Expiration timestamp' })
    @Column('timestamp', { nullable: false })
    expiresAt: Date;

    @ApiProperty({ example: new Date().toISOString(), description: 'Token creation timestamp' })
    @Column('timestamp')
    createdAt: Date;

    @BeforeInsert()
    expire() {
        this.createdAt = new Date(Date.now())
        this.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expira en 10 minutos
    }

    isExpired(): boolean {
        return new Date() > this.expiresAt;
    }
}