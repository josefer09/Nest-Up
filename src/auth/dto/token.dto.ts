import { IsString, MinLength } from "class-validator";


export class TokenDto {
    @IsString()
    @MinLength(6)
    token: string;
}