import { PrismaService } from '../../database/services/prisma.service';
import { UserFactory } from '../../database/factories/user.factory';
import { AuthService } from './auth.service';
import { UserService } from '../../models/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import * as process from 'process';

describe('UserService', () => {
  let authService: AuthService;
  let userService: UserService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    prismaService = new PrismaService();
    userService = new UserService(prismaService);
    jwtService = new JwtService();
    authService = new AuthService(userService, jwtService);
    await prismaService.$connect(); // Connect to the MySQL database.
  });

  afterEach(async () => {
    await prismaService.$disconnect(); // Disconnect from the MySQL database.
  });

  describe('verifyOrCreateUser', () => {
    it('test create new user case [return user]', async () => {
      const user = {
        email: 'email@test.com',
        nickname: 'nickname',
        profileImage: 'profileImage',
        role: UserRole.USER,
      };
      const ans = await userService.create(user);
      await prismaService.user.delete({ where: { id: ans.id } });
      const result = await authService.verifyOrCreateUser(user);
      ans.id = result.id;
      ans.createdAt = result.createdAt;
      ans.updatedAt = result.updatedAt;
      expect(result).toStrictEqual(ans);
    });

    it('test create new user case [return user]', async () => {
      const user = {
        email: 'email@test.com',
        nickname: 'nickname',
        profileImage: 'profileImage',
        role: UserRole.USER,
      };
      const ans = await userService.findByNickname(user.nickname);
      const result = await authService.verifyOrCreateUser(user);
      expect(result).toStrictEqual(ans);
    });
  });

  describe('createToken', () => {
    it('test create token [return token]', async () => {
      jest.spyOn(jwtService, 'signAsync').mockImplementation(async () => token);
      const user = UserFactory.getUser();
      const token = 'token';
      const result = await authService.createToken(user);
      expect(result).toBe(token);
    });
  });
});
