import { Transform } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

export class EmailDto {
    @IsString()
    @IsEmail()
    @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase().trim() : value)
    email: string
}