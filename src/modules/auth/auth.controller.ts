import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
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
  logger = new Logger('AuthenticationController');

  REFRESH_TOKEN_EXPIRE = 60 * 60 * 24 * 30;

  public constructor(
    private readonly users: UserService,
    private readonly tokens: TokensService,
  ) {}

  @Post('/register')
  public async register(@Body() body: RegisterRequest) {
    console.log(body);
    const user = await this.users
      .createUserFromRequest(body)
      .catch((error: Error) => {
        this.logger.error(error.message, error.stack);
      });

    if (user) {
      const token = await this.tokens.generateAccessToken(user);

      const refresh = await this.tokens.generateRefreshToken(
        user,
        this.REFRESH_TOKEN_EXPIRE,
      );

      const payload = this.buildResponsePayload(user, token, refresh);

      return {
        status: 'success',
        data: payload,
      };
    }

    return {
      status: 'failure',
      data: {
        message: 'Error Authenticating',
      },
    };
  }

  @Post('/login')
  public async login(@Body() body: LoginRequest) {
    const { username, password } = body;

    const user = await this.users
      .findForUsername(username)
      .catch((error: Error) => {
        this.logger.error(error.message, error.stack);
      });

    if (user) {
      const valid = user
        ? await this.users.validateCredentials(user, password)
        : false;

      if (!valid) {
        throw new UnauthorizedException('This login is invalid');
      }

      const token = await this.tokens.generateAccessToken(user);
      const refresh = await this.tokens.generateRefreshToken(
        user,
        this.REFRESH_TOKEN_EXPIRE,
      );

      const payload = this.buildResponsePayload(user, token, refresh);

      return {
        status: 'success',
        data: payload,
      };
    }

    return {
      status: 'failure',
      data: {
        message: 'Error Authenticating',
      },
    };
  }

  @Post('/refresh')
  public async refresh(
    @Body() body: RefreshRequest,
    @Response() res: FastifyReply,
  ) {
    // console.log('Refresh', refresh);
    // console.log('Auth', auth);
    // console.log('BODY', body);

    const result = await this.tokens
      .createAcessTokenFromRefreshToken(
        body.refresh_token,
        this.REFRESH_TOKEN_EXPIRE,
      )
      .catch((err) => {
        console.log('OMG');
        console.log(err);
      });

    if (result) {
      console.log(result);
      const { user, token, refreshToken } = result;

      const payload = this.buildResponsePayload(user, token, refreshToken);

      return res.status(200).send({
        status: 'success',
        data: payload,
      });
    }
    return res.status(401).send({
      status: 'failure',
    });
  }

  @Post('/logout')
  public async logout(@Body() body: RefreshRequest) {
    this.tokens
      .deleteRefreshToken(body.refresh_token)
      .then(() => {
        return {
          status: 'success',
        };
      })
      .catch((error) => {
        console.log(error);
        return {
          status: 'failure',
          data: {
            message: `Refresh failure`,
          },
        };
      });
  }

  @Get('/me')
  @Auth()
  public async getUser(@User() user: UserDTO) {
    try {
      const userId = user.id;

      const userData = await this.users.findForId(userId);

      return { status: 'success', data: userData };
    } catch (error) {
      return {
        status: 'failure',
        data: {
          message: `Fetching failure`,
        },
      };
    }
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
