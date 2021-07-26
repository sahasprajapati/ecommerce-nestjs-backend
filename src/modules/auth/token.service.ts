import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { EnvironmentVariables } from '../config/env.validation';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { RefreshToken } from './refresh-tokens.entity';
import { RefreshTokensRepository } from './refresh-tokens.repository';

export interface RefreshTokenPayload {
  jti: string;
  sub: string;
}
@Injectable()
export class TokensService {
  public BASE_OPTIONS: SignOptions;
  public constructor(
    private readonly tokens: RefreshTokensRepository,
    private readonly jwt: JwtService,
    private readonly users: UserService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    this.BASE_OPTIONS = {
      issuer: configService.get('URL'),
      audience: configService.get('URL'),
    };
  }

  public async generateAccessToken(user: User): Promise<string> {
    const opts: SignOptions = {
      ...this.BASE_OPTIONS,
      subject: user.id,
    };
    return this.jwt.signAsync({}, opts);
  }

  public async generateRefreshToken(
    user: User,
    expiresIn: number,
  ): Promise<string> {
    const token = await this.tokens.createRefreshToken(user, expiresIn);

    const opts: SignOptions = {
      ...this.BASE_OPTIONS,
      expiresIn,
      subject: user.id,
      jwtid: token.id,
    };
    return this.jwt.signAsync({}, opts);
  }

  public async resolveRefreshToken(
    encoded: string,
  ): Promise<{ user: User; refreshToken: string }> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshPayload(payload);

    if (!token) {
      throw new UnprocessableEntityException('Refresh token not found');
    }
    if (token.is_revoked) {
      // If refresh token used again revoke all available refresh tokens
      await this.tokens.deleteAllRefreshTokenForUser(token.user_id, false);

      throw new UnprocessableEntityException('Refresh token revoked');
    }

    const user = await this.getUserFromRefreshTokenPayload(payload);

    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }
    await this.tokens.deleteAllRefreshTokenForUser(token.user_id);

    // https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/
    // Refresh Token Rotation Strategy Used

    // Revoke the current Refresh Token
    this.tokens.revokeRefreshToken(token.id);
    // Send a new refresh Token with Each refresh (For security)
    const refreshToken = await this.generateRefreshToken(
      user,
      60 * 60 * 24 * 30,
    );

    return { user, refreshToken };
  }

  public async createAcessTokenFromRefreshToken(
    refresh: string,
  ): Promise<{ token: string; user: User; refreshToken: string }> {
    const { user, refreshToken } = await this.resolveRefreshToken(refresh);

    const token = await this.generateAccessToken(user);

    return { user, token, refreshToken };
  }

  private async decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload> {
    try {
      return this.jwt.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }

  private async getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<User> {
    const subId = payload.sub;

    if (!subId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.users.findForId(subId);
  }

  private async getStoredTokenFromRefreshPayload(
    payload: RefreshTokenPayload,
  ): Promise<RefreshToken | null> {
    const tokenId = payload.jti;

    if (!tokenId) {
      throw new UnprocessableEntityException('Refresh oken malformed');
    }

    return this.tokens.findTokenById(tokenId);
  }
}
