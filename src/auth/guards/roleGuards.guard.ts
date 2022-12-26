import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import User from 'src/user/entities/user.entity';
import { RoleTypes } from 'src/utils/constants';

const RoleGuard = (roles: RoleTypes[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const user = request.user as User;
      console.log(user);
      return roles.includes(user.role);
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
