import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from 'src/entities/team.entity';
import { TeamRules } from '../entities/team-rules.entity';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Team, TeamRules]),
    AuthModule,
  ],

  controllers: [TeamController],
  providers: [TeamService]
})
export class TeamModule {}
