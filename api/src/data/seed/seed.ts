import { User } from './../../entities/user.entity';
import { createConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';

const main = async () => {
  const connection = await createConnection();

  const userRepository = connection.manager.getRepository(User);
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

  
 

  connection.close();
}

main().catch(console.error);