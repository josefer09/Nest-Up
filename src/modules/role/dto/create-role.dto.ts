import { Transform } from "class-transformer";
import { IsString, MinLength } from "class-validator";

export class CreateRoleDto {

    @IsString()
    @MinLength(3)
    name: string;

}
