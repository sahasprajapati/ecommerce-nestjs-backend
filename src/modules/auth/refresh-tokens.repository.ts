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

  revokeRefreshToken(tokenId: string) {
    return this.update(
      { id: tokenId },
      {
        is_revoked: true,
      },
    );
  }

  async deleteAllRefreshTokenForUser(id: string, preserveLatest = true) {
    const tokens = await this.find({
      where: {
        user_id: id,
      },
      order: {
        createdDateTime: 'DESC',
      },
    });

    // If the latest token is revoked, delete it with other tokens
    // Else preserve the refresh token
    if (!tokens[0].is_revoked && preserveLatest) tokens.shift();

    tokens.forEach(async (token) => {
      await this.delete({
        id: token.id,
      });
    });
  }

  public async findTokenById(id: string): Promise<RefreshToken | null> {
    return this.findOne({
      where: {
        id,
      },
    });
  }
}
