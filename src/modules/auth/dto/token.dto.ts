import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";


export class TokenDto {
    @ApiProperty({ example: 'ABC123', description: 'Validation token', minLength: 3, maxLength: 6 })
    @IsString()
    @MinLength(3)
    @MaxLength(6)
    token: string;
}