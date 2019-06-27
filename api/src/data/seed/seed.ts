import { Comment } from './../../entities/comment.entity';
import { PostEntity } from './../../entities/post.entity';
import { User } from './../../entities/user.entity';
import { createConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';

const main = async () => {
  const connection = await createConnection();

  const userRepository = connection.manager.getRepository(User);
  // The seed script starts here:

 

  connection.close();
}

main().catch(console.error);