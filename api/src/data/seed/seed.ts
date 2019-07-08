import { User } from './../../entities/user.entity';
import { createConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ReviewerStatus } from '../../entities/reviewer-status.entity';

const main = async () => {
  const connection = await createConnection();

  const userRepository = connection.manager.getRepository(User);
  const reviewerStatusRepository = connection.manager.getRepository(ReviewerStatus);
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

  connection.close();
}

main().catch(console.error);