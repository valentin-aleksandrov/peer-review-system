import { Injectable, HttpException, BadRequestException } from "@nestjs/common";
import { Team } from "src/entities/team.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TeamInvitation } from "src/entities/team-invitation.entity";
import { TeamInvitationStatus } from "src/entities/team-invitation-status.entity";
import { User } from "src/entities/user.entity";
import { AddTeamInvitationDTO } from "./models/add-team-invitation.dto";
import { ShowTeamInvitationDTO } from "./models/show-team-invitation.dto";
import { plainToClass } from "class-transformer";
import { ShowUserDTO } from "src/users/models/show-user.dto";
import { ShowTeamDTO } from "src/team/models/show-team.dto";
import { ShowTeamInvitationStatusDTO } from "./models/team-invitation-status.dto";
import { EmailService } from "src/notifications/email.service";
import { PushNotificationService } from "src/notifications/push-notification.service";

@Injectable()
export class TeamInvitationService {
  public constructor(
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    @InjectRepository(TeamInvitationStatus)
    private teamInvitationStatusRepository: Repository<TeamInvitationStatus>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(TeamInvitation)
    private teamInvitationRepository: Repository<TeamInvitation>,
    private readonly emailService: EmailService,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  public async createTeamInvitation(
    body: AddTeamInvitationDTO,
    user: User,
  ): Promise<ShowTeamInvitationDTO> {
    const currentTeam: Team = await this.teamRepository.findOne({
      where: {
        teamName: body.teamName,
      },
    });
    const teamMembers: User[] = await currentTeam.users;
    for (let member of teamMembers) {
      if (body.inviteeName === member.username) {
        throw new BadRequestException(
          "This user is already a member of this team!",
        );
      }
    }
    const newInvitation = new TeamInvitation();
    const status = await this.teamInvitationStatusRepository.findOne({
      where: {
        status: "pending",
      },
    });
    newInvitation.status = status;
    newInvitation.host = user;
    const team = await this.teamRepository.findOne({
      where: {
        teamName: body.teamName,
      },
    });
    newInvitation.team = team;
    const invitee = await this.userRepository.findOne({
      where: {
        username: body.inviteeName,
      },
    });
    newInvitation.invitee = invitee;
    const createdInvitation = await this.teamInvitationRepository.save(
      newInvitation,
    );
    // const inviteeToDTO = plainToClass(ShowUserDTO, await invitee, {
    //   excludeExtraneousValues: true,
    // });
    const inviteeToDTO: ShowUserDTO = await this.convertToShowUserDTO(invitee);
    const teamToDTO = plainToClass(ShowTeamDTO, await team, {
      excludeExtraneousValues: true,
    });
    const statusToDTO = plainToClass(
      ShowTeamInvitationStatusDTO,
      await status,
      { excludeExtraneousValues: true },
    );
    const exposedInvitation: ShowTeamInvitationDTO = plainToClass(
      ShowTeamInvitationDTO,
      createdInvitation,
      { excludeExtraneousValues: true },
    );
    exposedInvitation.invitee = inviteeToDTO;
    exposedInvitation.team = teamToDTO;
    exposedInvitation.status = statusToDTO;
    this.notifyInvitedUserInTeam(exposedInvitation);
    return await exposedInvitation;
  }

  public async acceptInvitation(invitationId): Promise<ShowTeamInvitationDTO> {
    const invitation: TeamInvitation = await this.teamInvitationRepository.findOne(
      {
        where: {
          id: invitationId,
        },
      },
    );
    const team: Team = await invitation.team;
    const teamMember: User = await invitation.invitee;
    const updateTeam: Team = await this.teamRepository.findOne({
      where: {
        id: team.id,
      },
    });
    updateTeam.users = [...updateTeam.users, teamMember];
    const updatedTeam = this.teamRepository.save(updateTeam);
    const newStatus: TeamInvitationStatus = await this.teamInvitationStatusRepository.findOne(
      {
        where: {
          status: "accepted",
        },
      },
    );
    invitation.status = newStatus;
    const acceptedInvitation: TeamInvitation = await this.teamInvitationRepository.save(
      invitation,
    );
    const statusToDTO = plainToClass(
      ShowTeamInvitationStatusDTO,
      await newStatus,
      { excludeExtraneousValues: true },
    );
    const acceptInvitationToDTO = plainToClass(
      ShowTeamInvitationDTO,
      await acceptedInvitation,
      { excludeExtraneousValues: true },
    );
    acceptInvitationToDTO.status = statusToDTO;
    return await acceptInvitationToDTO;
  }

  public async rejectInvitation(invitationId): Promise<ShowTeamInvitationDTO> {
    const invitation = await this.teamInvitationRepository.findOne({
      where: {
        id: invitationId,
      },
    });
    const newStatus = await this.teamInvitationStatusRepository.findOne({
      where: {
        status: "rejected",
      },
    });
    invitation.status = newStatus;
    const rejectedInvitation = this.teamInvitationRepository.save(invitation);
    const statusToDTO = plainToClass(
      ShowTeamInvitationStatusDTO,
      await newStatus,
      { excludeExtraneousValues: true },
    );
    const rejectInvitationToDTO = plainToClass(
      ShowTeamInvitationDTO,
      await rejectedInvitation,
      { excludeExtraneousValues: true },
    );
    rejectInvitationToDTO.status = statusToDTO;
    return await rejectInvitationToDTO;
  }

  public async getActiveInvitationsByUserId(
    userId,
  ): Promise<ShowTeamInvitationDTO[]> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    const invitations: TeamInvitation[] = await this.teamInvitationRepository.find(
      { where: { invitee: user }, relations: ["status"] },
    );
    const activeInvitations: TeamInvitation[] = [];
    invitations.forEach(element => {
      const status = element.status.status;

      if (status === "pending") {
        activeInvitations.push(element);
      }
    });
    const activeInvitationsToDTO: ShowTeamInvitationDTO[] = [];
    activeInvitations.forEach(inv => {
      const invToDTO = plainToClass(ShowTeamInvitationDTO, inv, {
        excludeExtraneousValues: true,
      });
      activeInvitationsToDTO.push(invToDTO);
    });
    return await activeInvitationsToDTO;
  }
  private async convertToShowUserDTO(user: User): Promise<ShowUserDTO> {
    const convertedUser: ShowUserDTO = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: (await user.role).name,
      avatarURL: user.avatarURL,
    };
    return convertedUser;
  }
  private notifyInvitedUserInTeam(teamInvitation: ShowTeamInvitationDTO): void {
    const hostUsername: string = teamInvitation.host.username;
    const teamName: string = teamInvitation.team.teamName;
    const inviteeEmail: string = teamInvitation.invitee.email;
    const inviteeUsername: string = teamInvitation.invitee.username;
    const link: string = "http://localhost:4200/profile";

    this.emailService.sendEmail(
      inviteeEmail,
      "New invitation",
      `${hostUsername} invited you to join ${teamName} team. Press here: ${link}`,
    );

    this.pushNotificationService.sendPushNotfication(
      "New invitation",
      `${hostUsername} invited you to join ${teamName} team. Press here:`,
      inviteeUsername,
      link,
    );
  }
}
