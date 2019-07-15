import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoreModule } from './core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { WorkItemModule } from './workItem/work-item.module';
import { TeamModule } from './team/team.module';
import { TeamInvitationModule } from './team-invitation/team-invitation.module';
import { Review } from './entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: configService.dbType as any,
        host: configService.dbHost,
        port: configService.dbPort,
        username: configService.dbUsername,
        password: configService.dbPassword,
        database: configService.dbName,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        
        migrations: [__dirname + '/migrations'],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    CoreModule, 
    ConfigModule,
    WorkItemModule,
    ConfigModule, 
    TeamModule, 
    TeamInvitationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
