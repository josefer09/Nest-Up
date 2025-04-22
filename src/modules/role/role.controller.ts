import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Auth } from '@auth/decorators';
import { ValidRoles } from '@auth/enums';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './entities/role.entity';

@ApiTags('Role')
@Controller('role')
@Auth(ValidRoles.ADMIN)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role.'})
  @ApiResponse({ status: 201, description: 'Role created successfully.', type: Role })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all roles (paginated)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of roles retrieved successfully.', type: [Role] })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.roleService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the role' })
  @ApiResponse({ status: 200, description: 'Role retrieved successfully.', type: Role })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the role to update' })
  @ApiResponse({ status: 200, description: 'Role updated successfully.', type: Role })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the role to delete' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.roleService.remove(id);
  }
}
