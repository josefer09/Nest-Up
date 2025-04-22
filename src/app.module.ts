import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { EnvConfiguration, envValidationSchema } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { join } from 'path';
import { RoleModule } from '@role/role.module'; 
import { UserModule } from './modules/user/user.module';
import { CommonModule } from './common/common.module';
import { EmailModule } from './modules/email/email.module';
import { SeedModule } from './modules/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: envValidationSchema,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        ssl: configService.get<string>('NODE_ENV') === 'prod' ? true : false,
        extra: {
          ssl: configService.get<string>('NODE_ENV') === 'prod'
          ? { rejectUnauthorized: false }
          : null,
        },
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') === 'dev' ? true : false,
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
      }),
    AuthModule,
    RoleModule,
    UserModule,
    CommonModule,
    EmailModule,
    SeedModule,
  ],
})
export class AppModule {}
