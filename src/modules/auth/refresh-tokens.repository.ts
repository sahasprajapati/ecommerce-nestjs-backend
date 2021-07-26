import { EntityRepository, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { RefreshToken } from './refresh-tokens.entity';

@EntityRepository(RefreshToken)
export class RefreshTokensRepository extends Repository<RefreshToken> {
  public async createRefreshToken(
    user: User,
    ttl: number,
  ): Promise<RefreshToken> {
    const token = new RefreshToken();

    token.user_id = user.id;
    token.is_revoked = false;

    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ttl);
    token.expires = expiration;

    return this.save(token);
  }

  public async findTokenById(id: string): Promise<RefreshToken | null> {
    return this.findOne({
      where: {
        id,
      },
    });
  }
}
