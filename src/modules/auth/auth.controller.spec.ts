import { PrismaService } from '../../database/services/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../models/user/user.service';
import { UserFactory } from '../../database/factories/user.factory';
import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayloadInterface } from '../../common/interfaces/jwt/jwtPayload.interface';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(new UserService(new PrismaService()), new JwtService());
    authController = new AuthController(authService);
  });

  // service가 더 중요한 영역이기 때문에 가볍게 테스트함.
  describe('get42AuthCallback', () => {
    it('test normal case [return token]', async () => {
      const req = { user: { nickname: 'nickname' } };
      const user = UserFactory.getUser();
      const token = 'token';
      const result = { accessToken: token };
      jest.spyOn(authService, 'verifyOrCreateUser').mockImplementation(async () => user);
      jest.spyOn(authService, 'createToken').mockImplementation(async () => token);
      expect(await authController.get42AuthCallback(req)).toStrictEqual(result);
    });

    it('test user is undefined [throw UnauthorizedException]', async () => {
      const req = { user: undefined };
      const user = UserFactory.getUser();

      jest.spyOn(authService, 'verifyOrCreateUser').mockImplementation(async () => user);
      jest.spyOn(authService, 'createToken').mockImplementation(async () => 'token');
      await expect(authController.get42AuthCallback(req)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('test user nickname is undefined [throw UnauthorizedException]', async () => {
      const req = { user: { id: 1 } };
      const user = UserFactory.getUser();

      jest.spyOn(authService, 'verifyOrCreateUser').mockImplementation(async () => user);
      jest.spyOn(authService, 'createToken').mockImplementation(async () => 'token');
      await expect(authController.get42AuthCallback(req)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('test user is null [throw InternalServerErrorException]', async () => {
      const req = { user: { nickname: 'nickname' } };

      jest.spyOn(authService, 'verifyOrCreateUser').mockImplementation(async () => null);
      jest.spyOn(authService, 'createToken').mockImplementation(async () => 'token');
      await expect(authController.get42AuthCallback(req)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });

  describe('login', () => {
    it('test normal case [return jwt guard request.user object]', async () => {
      const user: JwtPayloadInterface = {
        nickname: 'nickname',
        id: 1,
        role: 'USER',
        profileImage: 'profileImage',
      };
      expect(await authController.login({ user: user })).toStrictEqual(user);
    });
  });
});
