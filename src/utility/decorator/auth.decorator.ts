import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Role } from 'src/modules/auth/enum/role.enum';
import { JWTAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { Roles } from './role.decorator';

export function Auth() {
  return applyDecorators(
    UseGuards(JWTAuthGuard),
    Roles(Role.user),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
}
