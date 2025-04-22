import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto } from './dto';
import { UserService } from './user.service';
import { Auth, GetUser } from '@auth/decorators';
import { ValidRoles } from '@auth/enums';
import { PaginationDto } from '@common/dto/pagination.dto';
import { AuthUser } from '@auth/interfaces';

@Controller('user')
@Auth(ValidRoles.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Patch('change-password')
  @Auth()
  changePassword(
    @GetUser() user: AuthUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    console.log('DTO recibido:', changePasswordDto);
    return this.userService.changePassword(user, changePasswordDto);
  }

  @Get(':id')
  findOneById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUserById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id/block')
  blockUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.updateStatusUser(id, false);
  }

  @Patch(':id/unblock')
  unblockUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.updateStatusUser(id, true);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
