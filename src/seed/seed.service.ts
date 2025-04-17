import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingAdapter } from 'src/common/adapters';
import { HttpResponseMessage } from 'src/common/utils';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { initialSeedData } from './data/seed-data';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly configService: ConfigService,
    private readonly hashingAdapter: HashingAdapter,
  ) {}

  async runSeed() {
    const appEnv = this.configService.get<string>('NODE_ENV');
    if (appEnv === 'prod' || appEnv === 'production')
      throw new BadRequestException(
        '🚫 Cannot run seed in production environment.',
      );
    try {
      await this.deleteTables();
      await this.populateDB();
      return HttpResponseMessage.success('Seed executed successfully.');
    } catch (error) {
      this.logger.error(`Error running the seed - ${error.message}`);
      throw error;
    }
  }

  private async populateDB() {
    const { roles, users } = initialSeedData;

    for (const role of roles) {
      await this.roleRepository.save(this.roleRepository.create(role));
    }

    for (const user of users) {
      const roleEntities = await this.roleRepository.find({
        where: { name: In(user.roles) },
      });

      const defaultPassword = 'adminAdmin123'
      const passwordHash = await this.hashingAdapter.hash(defaultPassword);

      const newUser = this.userRepository.create({
        ...user,
        password: passwordHash,
        roles: roleEntities,
        isVerified: true,
      });

      await this.userRepository.save(newUser, { reload: true });
    }
  }
  private async deleteTables() {
    const userQuery = this.userRepository.createQueryBuilder();
    await userQuery.delete().where({}).execute();

    const roleQuery = this.roleRepository.createQueryBuilder();
    await roleQuery.delete().where({}).execute();
  }
}
