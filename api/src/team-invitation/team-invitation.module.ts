import { Module } from '@nestjs/common';
import { TeamInvitationController } from './team-invitation.controller';
import { TeamInvitationService } from './team-invitation.service';
import { User } from 'src/entities/user.entity';
import { Team } from 'src/entities/team.entity';
import { TeamInvitation } from 'src/entities/team-invitation.entity';
import { TeamInvitationStatus } from 'src/entities/team-invitation-status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    TypeOrmModule.forFeature([Team, TeamInvitation, TeamInvitationStatus, User ]),
    AuthModule,
  ],
  controllers: [TeamInvitationController],
  providers: [TeamInvitationService],
  exports: [TeamInvitationService],
})
export class TeamInvitationModule {}
