import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

export class EmailDto {
    @ApiProperty({ example: 'john@example.com', description: 'User email address' })
    @IsString()
    @IsEmail()
    @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase().trim() : value)
    email: string
}