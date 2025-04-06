import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { HttpResponseMessage } from 'src/common/utils';
import { DatabaseExceptionHandler } from '../common/providers/postgres-excetion-handler.provider';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly dataBaseExceptionHandler: DatabaseExceptionHandler,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const roleExist = await this.roleRepository.findOne({ where: { name: createRoleDto.name }});
      if( roleExist ) throw new BadRequestException(`Role with name: ${createRoleDto.name} alredy exist.`);

      const role = this.roleRepository.create(createRoleDto);
      const roleSaved = await this.roleRepository.save(role);
      return HttpResponseMessage.created('Role', roleSaved);
    } catch (error) {
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const {limit = 10, offset = 0} = paginationDto;
    try {
      const roles = await this.roleRepository.find({
        take: limit,
        skip: offset,
      })
      return {data: roles}
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const roleExist = await this.roleRepository.findOneBy({id});
      if( !roleExist ) throw new NotFoundException(`Role with id: ${id} not exist.`);
      return roleExist;
    } catch (error) {
      this.dataBaseExceptionHandler.handle(error);
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    if (!updateRoleDto || Object.keys(updateRoleDto).length === 0) {
      throw new BadRequestException('At least one field must be updated.');
    }
  
    if (updateRoleDto.name) {
      const existingRole = await this.roleRepository.findOne({ where: { name: updateRoleDto.name.trim().toLocaleLowerCase() } });
      if (existingRole && existingRole.id !== id) {
        throw new BadRequestException(`Role with name: ${updateRoleDto.name} already exists.`);
      }
    }
  
    const role = await this.roleRepository.preload({ id, ...updateRoleDto });
  
    if (!role) {
      throw new NotFoundException(`Role with id: ${id} not found.`);
    }
  
    await this.roleRepository.save(role);
    return HttpResponseMessage.updated('Role', role);
  }

  async remove(id: string) {
      const { affected } = await this.roleRepository.delete({ id });
      if( affected === 0 ) throw new NotFoundException(`Role with id: ${id} not found.`);
      return { message: HttpResponseMessage.deleted('Role') };
  }
}
