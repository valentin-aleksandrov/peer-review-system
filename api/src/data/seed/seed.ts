import { User } from './../../entities/user.entity';
import { createConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ReviewerStatus } from '../../entities/reviewer-status.entity';
import { WorkItemStatus } from '../../entities/work-item-status.entity';
import { Role } from '../../entities/role.entity';
import { TeamInvitationStatus } from '../../entities/team-invitation-status.entity';
import { TeamRules } from '../../entities/team-rules.entity';
import { Team } from '../../entities/team.entity';

const main = async () => {
  const connection = await createConnection();

  const userRepository = connection.manager.getRepository(User);
  const reviewerStatusRepository = connection.manager.getRepository(ReviewerStatus);
  const workItemStatusRepository = connection.manager.getRepository(WorkItemStatus);
  const teamInivitationStatusRepository = connection.manager.getRepository(TeamInvitationStatus);
  const roleRepository = connection.manager.getRepository(Role);
  const teamRulesRepository = connection.manager.getRepository(TeamRules);
  const teamRepository = connection.manager.getRepository(Team)

  const member: Role = await roleRepository.findOne({
    where: {
      name: 'member',
    },
  });
 
  if (!member) {
    const newMemberRole: Role = new Role();
    newMemberRole.name = 'member';
    await roleRepository.save(newMemberRole);
    console.log("Created member role.");
  } else {
    console.log("Member role already in the DataBase");
  }

  const admin: Role = await roleRepository.findOne({
    where: {
      name: 'admin',
    },
  });
 
  if(!admin){
    const newAdminRole: Role = new Role();
    newAdminRole.name = 'admin';
    await roleRepository.save(newAdminRole);
    console.log("Created admin role.");
  } else {
    console.log("Admin role already in the DataBase");
  }
  // The seed script starts here:
  const valka: User = await userRepository.findOne({
    where: {
      email: 'valentin805@gmail.com'
    },
  });

  if (!valka) {
    const user1:User = new User();
    user1.username = 'Valka';
    user1.email = 'valentin805@gmail.com';
    user1.password = await bcrypt.hash('aaAA$$123456789', 10);
    user1.firstName = 'Valentin';
    user1.lastName = 'Aleksandrov';
    const user1Role = await roleRepository.findOne({
      where: {
        name: 'member',
      },
    });
    user1.role = Promise.resolve(user1Role);

    await userRepository.save(user1);
    console.log('Valka created!');
  } else {
    console.log('Valka is already in the Database!');
  }
  const valka2: User = await userRepository.findOne({
    where: {
      email: 'valentin2805@gmail.com'
    },
  });

  if (!valka2) {
    const user1:User = new User();
    user1.username = 'Valka2';
    user1.email = 'valentin2805@gmail.com';
    user1.password = await bcrypt.hash('aaAA$$123456789', 10);
    user1.firstName = 'Valentin2';
    user1.lastName = 'Aleksandrov2';
    const user1Role = await roleRepository.findOne({
      where: {
        name: 'member',
      },
    });
    user1.role = Promise.resolve(user1Role);

    await userRepository.save(user1);
    console.log('Valka2 created!');
  } else {
    console.log('Valka2 is already in the Database!');
  }

  const valka3: User = await userRepository.findOne({
    where: {
      email: 'valentin3805@gmail.com'
    },
  });

  if (!valka3) {
    const user1:User = new User();
    user1.username = 'Valka3';
    user1.email = 'valentin3805@gmail.com';
    user1.password = await bcrypt.hash('aaAA$$123456789', 10);
    user1.firstName = 'Valentin3';
    user1.lastName = 'Aleksandrov3';
    const user1Role = await roleRepository.findOne({
      where: {
        name: 'member',
      },
    });
    user1.role = Promise.resolve(user1Role);

    await userRepository.save(user1);
    console.log('Valka3 created!');
  } else {
    console.log('Valka3 is already in the Database!');
  }

  const valka4: User = await userRepository.findOne({
    where: {
      email: 'valentin4805@gmail.com'
    },
  });

  if (!valka4) {
    const user1:User = new User();
    user1.username = 'Valka4';
    user1.email = 'valentin4805@gmail.com';
    user1.password = await bcrypt.hash('aaAA$$123456789', 10);
    user1.firstName = 'Valentin4';
    user1.lastName = 'Aleksandrov4';
    const user1Role = await roleRepository.findOne({
      where: {
        name: 'member',
      },
    });
    user1.role = Promise.resolve(user1Role);

    await userRepository.save(user1);
    console.log('Valka4 created!');
  } else {
    console.log('Valka4 is already in the Database!');
  }

  const valka5: User = await userRepository.findOne({
    where: {
      email: 'valentin5805@gmail.com'
    },
  });

  if (!valka5) {
    const user1:User = new User();
    user1.username = 'Valka5';
    user1.email = 'valentin5805@gmail.com';
    user1.password = await bcrypt.hash('aaAA$$123456789', 10);
    user1.firstName = 'Valentin5';
    user1.lastName = 'Aleksandrov5';
    const user1Role = await roleRepository.findOne({
      where: {
        name: 'member',
      },
    });
    user1.role = Promise.resolve(user1Role);

    await userRepository.save(user1);
    console.log('Valka5 created!');
  } else {
    console.log('Valka5 is already in the Database!');
  }

  const revPending: ReviewerStatus = await reviewerStatusRepository.findOne({
    where: {
      status: 'pending',
    },
  });
 
  if(!revPending){
    const newRevPending: ReviewerStatus = new ReviewerStatus();
    newRevPending.status = 'pending';
    await reviewerStatusRepository.save(newRevPending);
    console.log("Created pending reviewer status.");
  } else {
    console.log("Pending reviewer status already in the DataBase");
  }

  const revAccepted: ReviewerStatus = await reviewerStatusRepository.findOne({
    where: {
      status: 'accepted',
    },
  });

  if(!revAccepted){
    const newRevAccepted: ReviewerStatus = new ReviewerStatus();
    newRevAccepted.status = 'accepted';
    await reviewerStatusRepository.save(newRevAccepted);
    console.log("Created accepted reviewer status.");
  } else {
    console.log("Accepted reviewer status already in the DataBase");
  }

  const revRequestChanges: ReviewerStatus = await reviewerStatusRepository.findOne({
    where: {
      status: 'request_changes',
    },
  });

  if(!revRequestChanges){
    const newRevRequestChanges: ReviewerStatus = new ReviewerStatus();
    newRevRequestChanges.status = 'request_changes';
    await reviewerStatusRepository.save(newRevRequestChanges);
    console.log("Created request_changes reviewer status.");
  } else {
    console.log("Accepted request_changes status already in the DataBase");
  }

  const revRejected: ReviewerStatus = await reviewerStatusRepository.findOne({
    where: {
      status: 'rejected',
    },
  });
  
  if(!revRejected){
    const newRevRejected: ReviewerStatus = new ReviewerStatus();
    newRevRejected.status = 'rejected';
    await reviewerStatusRepository.save(newRevRejected);
    console.log("Created rejected reviewer status.");
  } else {
    console.log("Accepted rejected status already in the DataBase");
  }

  const workItemRevPending: WorkItemStatus = await workItemStatusRepository.findOne({
    where: {
      status: 'pending',
    },
  });
 
  if(!workItemRevPending){
    const newWorkItemRevPending: WorkItemStatus = new WorkItemStatus();
    newWorkItemRevPending.status = 'pending';
    await workItemStatusRepository.save(newWorkItemRevPending);
    console.log("Created pending workitem status.");
  } else {
    console.log("Pending workitem status already in the DataBase");
  }

  const workItemRevAccepted: WorkItemStatus = await workItemStatusRepository.findOne({
    where: {
      status: 'accepted',
    },
  });
 
  if(!workItemRevAccepted){
    const newWorkItemRevАccepted: WorkItemStatus = new WorkItemStatus();
    newWorkItemRevАccepted.status = 'accepted';
    await workItemStatusRepository.save(newWorkItemRevАccepted);
    console.log("Created accepted workitem status.");
  } else {
    console.log("Accepted workitem status already in the DataBase");
  }

  const workItemRevRejected: WorkItemStatus = await workItemStatusRepository.findOne({
    where: {
      status: 'rejected',
    },
  });
 
  if(!workItemRevRejected){
    const newWorkItemRevRejected: WorkItemStatus = new WorkItemStatus();
    newWorkItemRevRejected.status = 'rejected';
    await workItemStatusRepository.save(newWorkItemRevRejected);
    console.log("Created rejected workitem status.");
  } else {
    console.log("Rejected workitem status already in the DataBase");
  }

  const workItemRevRequestChanges: WorkItemStatus = await workItemStatusRepository.findOne({
    where: {
      status: 'request_changes',
    },
  });
 
  if(!workItemRevRequestChanges){
    const newWorkItemRevRequestChanges: WorkItemStatus = new WorkItemStatus();
    newWorkItemRevRequestChanges.status = 'request_changes';
    await workItemStatusRepository.save(newWorkItemRevRequestChanges);
    console.log("Created request changes workitem status.");
  } else {
    console.log("Request changes workitem status already in the DataBase");
  }

  
  const invStatusAccepted: TeamInvitationStatus = await teamInivitationStatusRepository.findOne({
    where: {
      status: 'accepted',
    },
  });

  if(!invStatusAccepted){
    const newInvStatusAccepted: TeamInvitationStatus = new TeamInvitationStatus();
    newInvStatusAccepted.status = 'accepted';
    await teamInivitationStatusRepository.save(newInvStatusAccepted);
    console.log("Created accepted inivatation status.");
  } else {
    console.log("Accepted invitation status already in the DataBase");
  }

  const invStatusRejected: TeamInvitationStatus = await teamInivitationStatusRepository.findOne({
    where: {
      status: 'rejected',
    },
  });

  if(!invStatusRejected){
    const newInvStatusRejected: TeamInvitationStatus = new TeamInvitationStatus();
    newInvStatusRejected.status = 'rejected';
    await teamInivitationStatusRepository.save(newInvStatusRejected);
    console.log("Created rejected inivatation status.");
  } else {
    console.log("Rejected invitation status already in the DataBase");
  }

  const invStatusPending: TeamInvitationStatus = await teamInivitationStatusRepository.findOne({
    where: {
      status: 'pending',
    },
  });

  if(!invStatusPending){
    const newInvStatusPending: TeamInvitationStatus = new TeamInvitationStatus();
    newInvStatusPending.status = 'pending';
    await teamInivitationStatusRepository.save(newInvStatusPending);
    console.log("Created pending inviatation status.");
  } else {
    console.log("Pending invitation status already in the DataBase");
  }

  const teamRules: TeamRules = await teamRulesRepository.findOne({
    where: {
      minPercentApprovalOfItem: 100,
    },
  });

  if(!teamRules){
    const newTeamRules: TeamRules = new TeamRules();
    newTeamRules.minPercentApprovalOfItem = 100;
    newTeamRules.minNumberOfReviewers = 3;
    await teamRulesRepository.save(newTeamRules);
    console.log("Created default team rules.");
  } else {
    console.log("Default team rules already in the DataBase");
  }

  const team1: Team = await teamRepository.findOne({
    where: {
      teamName: 'team1',
    }
  });

  if(!team1){
    const newTeam: Team = new Team();
    const rule: TeamRules = await teamRulesRepository.findOne({
        where: {
          minPercentApprovalOfItem: 100,
        },
      })
    await (newTeam.rules = Promise.resolve(rule));
    
    
    newTeam.teamName = 'team1';
   
   
    const user1 = await userRepository.findOne({
      where: {
        email: 'valentin805@gmail.com'
      },
    });
    const user2 = await userRepository.findOne({
      where: {
        email: 'valentin2805@gmail.com'
      },
    });
    const user3 = await userRepository.findOne({
      where: {
        email: 'valentin3805@gmail.com'
      },
    });
    const users: User[] = [];
    if(!user1){
      users.push(user1);
    }
    if(!user2){
      users.push(user2);
    }
    if(!user3){
      users.push(user3);
    }
    // newTeam.users = users;
    await teamRepository.save(newTeam);
    console.log("Created team1");
    
  } else {
    console.log('team1 already in the DataBase.');
  }

  const tag1 = 

  connection.close();
}

main().catch(console.error);