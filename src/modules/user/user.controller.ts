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
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { CreateUserDto, UpdateUserDto, ChangePasswordDto } from './dto';
import { UserService } from './user.service';
import { Auth, GetUser } from '@auth/decorators';
import { ValidRoles } from '@auth/enums';
import { PaginationDto } from '@common/dto/pagination.dto';
import { AuthUser } from '@auth/interfaces';
import { User } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
@Auth(ValidRoles.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: User })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users (paginated)' })
  @ApiOkResponse({ type: [User], description: 'List of users' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Patch('change-password')
  @Auth()
  @ApiOperation({ summary: 'Change your own password (authenticated user)' })
  @ApiOkResponse({ description: 'Password changed successfully' })
  @ApiBody({ type: ChangePasswordDto })
  changePassword(
    @GetUser() user: AuthUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    console.log('DTO recibido:', changePasswordDto);
    return this.userService.changePassword(user, changePasswordDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: User, description: 'User retrieved successfully' })
  findOneById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUserById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: User, description: 'User updated successfully' })
  @ApiBody({ type: UpdateUserDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id/block')
  @ApiOperation({ summary: 'Block a user by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ description: 'User blocked successfully' })
  blockUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.updateStatusUser(id, false);
  }

  @Patch(':id/unblock')
  @ApiOperation({ summary: 'Unblock a user by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ description: 'User unblocked successfully' })
  unblockUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.updateStatusUser(id, true);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
