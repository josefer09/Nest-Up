import { User } from "@user/entities/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { TokenType } from "../enums";

@Entity('tokens')
@Unique(['user'])
export class Token {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.id, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id'})
    user: User;

    @Column('enum', { enum: TokenType, nullable: false })
    tokenType: TokenType;

    @Column('text', { unique: true, nullable: false })
    token: string;

    @Column('timestamp', { nullable: false })
    expiresAt: Date;

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