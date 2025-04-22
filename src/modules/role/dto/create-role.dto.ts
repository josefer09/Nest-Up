import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, MinLength } from "class-validator";

export class CreateRoleDto {

    @ApiProperty({
        description: 'Role name (unique)',
        nullable: false,
        minLength: 3,
    })
    @IsString()
    @MinLength(3)
    name: string;

}
