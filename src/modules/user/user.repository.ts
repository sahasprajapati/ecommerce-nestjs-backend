import { hash } from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async signup(username: string, password: string) {
    const user = new User();

    user.name = username;
    user.password = await hash(password, 10);

    return this.save(user);
  }

  findForUsername(username: string): Promise<User | null> {
    console.log(username);
    return this.findOne({
      where: {
        name: username,
      },
    });
  }
  findForId(id: string): Promise<User | null> {
    return this.findOne({
      where: {
        id: id,
      },
    });
  }
}
