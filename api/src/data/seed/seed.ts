import { User } from './../../entities/user.entity';
import { createConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ReviewerStatus } from '../../entities/reviewer-status.entity';
import { WorkItemStatus } from '../../entities/work-item-status.entity';
import { Role } from '../../entities/role.entity';

const main = async () => {
  const connection = await createConnection();

  const userRepository = connection.manager.getRepository(User);
  const reviewerStatusRepository = connection.manager.getRepository(ReviewerStatus);
  const workItemStatusRepository = connection.manager.getRepository(WorkItemStatus);
  const roleRepository = connection.manager.getRepository(Role);
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

    await userRepository.save(user1);
    console.log('Valka created!');
  } else {
    console.log('Valka is already in the Database!');
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



  connection.close();
}

main().catch(console.error);