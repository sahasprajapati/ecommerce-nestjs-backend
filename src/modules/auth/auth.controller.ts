import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth } from 'src/utility/decorator/auth.decorator';
import { User } from 'src/utility/decorator/user.decorator';
import { UserDTO } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { LoginRequest, RefreshRequest, RegisterRequest } from './requests';
import { TokensService } from './token.service';
// https://stacksecrets.com/dot-net-core/using-access-token-and-refresh-token
// https://javascript.plainenglish.io/nestjs-implementing-access-refresh-token-jwt-authentication-97a39e448007
export interface AuthenticationPayload {
  user: UserDTO;
  payload: {
    type: string;
    token: string;
    refresh_token?: string;
  };
}

@Controller('/api/auth')
export class AuthenticationController {
  public constructor(
    private readonly users: UserService,
    private readonly tokens: TokensService,
  ) {}

  @Post('/register')
  public async register(@Body() body: RegisterRequest) {
    console.log(body);
    const user = await this.users.createUserFromRequest(body);

    const token = await this.tokens.generateAccessToken(user);

    const refresh = await this.tokens.generateRefreshToken(
      user,
      60 * 60 * 24 * 30,
    );

    const payload = this.buildResponsePayload(user, token, refresh);

    return {
      status: 'success',
      data: payload,
    };
  }

  @Post('/login')
  public async login(@Body() body: LoginRequest) {
    const { username, password } = body;

    const user = await this.users.findForUsername(username);
    const valid = user
      ? await this.users.validateCredentials(user, password)
      : false;

    if (!valid) {
      throw new UnauthorizedException('This login is invalid');
    }

    const token = await this.tokens.generateAccessToken(user);
    const refresh = await this.tokens.generateRefreshToken(
      user,
      60 * 60 * 24 * 30,
    );

    const payload = this.buildResponsePayload(user, token, refresh);

    return {
      status: 'success',
      data: payload,
    };
  }

  @Post('/refresh')
  public async refresh(@Body() body: RefreshRequest) {
    console.log(body);
    const { user, token, refreshToken } =
      await this.tokens.createAcessTokenFromRefreshToken(body.refresh_token);

    const payload = this.buildResponsePayload(user, token, refreshToken);

    return {
      status: 'success',
      data: payload,
    };
  }

  @Get('/me')
  @Auth()
  public async getUser(@User() user: UserDTO) {
    const userId = user.id;

    const userData = await this.users.findForId(userId);

    return { status: 'success', data: userData };
  }

  private buildResponsePayload(
    user: UserDTO,
    accessToken: string,
    refreshToken?: string,
  ): AuthenticationPayload {
    return {
      user: user,
      payload: {
        type: 'bearer',
        token: accessToken,
        ...(refreshToken ? { refresh_token: refreshToken } : {}),
      },
    };
  }
}
