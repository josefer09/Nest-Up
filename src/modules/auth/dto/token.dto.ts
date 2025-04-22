import { IsString, MaxLength, MinLength } from "class-validator";


export class TokenDto {
    @IsString()
    @MinLength(3)
    @MaxLength(6)
    token: string;
}