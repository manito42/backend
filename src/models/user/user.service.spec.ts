import { UserService } from './user.service';
import { PrismaService } from '../../database/services/prisma.service';
import { UserFactory } from '../../database/factories/user.factory';
import { UserSelectQuery } from './queries/userSelect.query';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    prismaService = new PrismaService();
    await prismaService.$connect(); // Connect to the MySQL database.
    userService = new UserService(prismaService);
  });

  afterEach(async () => {
    await prismaService.$disconnect(); // Disconnect from the MySQL database.
  });

  describe('findMany', () => {
    it('test normal case [return user array by take and page]', async () => {
      const result = await prismaService.user.findMany({
        select: UserSelectQuery,
      });
      const count = result.length > 100 ? 100 : result.length;
      expect(await userService.findMany({ take: result.length, page: 0 })).toStrictEqual(result);
      expect(await userService.findMany({ take: 100, page: 0 })).toHaveLength(count);
      expect(await userService.findMany({ take: 5, page: 0 })).toHaveLength(5);
      expect(await userService.findMany({ take: 5, page: 1 })).toHaveLength(5);
      expect(await userService.findMany({ take: 5000, page: 5 })).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('test normal case [return user object]', async () => {
      const user = await prismaService.user.create({
        data: UserFactory.getCreateUser(),
        select: UserSelectQuery,
      });

      expect(await userService.findById(user.id)).toStrictEqual(user);
    });
    it('test not exist user case [return null]', async () => {
      expect(await userService.findById(-1)).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('test normal case [return user]', async () => {
      const user = await prismaService.user.create({
        data: UserFactory.getCreateUser(),
        select: UserSelectQuery,
      });

      expect(await userService.findByEmail(user.email)).toStrictEqual(user);
    });
    it('test not exist email [return null]', async () => {
      expect(await userService.findByEmail('')).toBeNull();
    });
  });

  describe('findByNickname', () => {
    it('test normal case [return user]', async () => {
      const user = await prismaService.user.create({
        data: UserFactory.getCreateUser(),
        select: UserSelectQuery,
      });

      expect(await userService.findByNickname(user.nickname)).toStrictEqual(user);
    });
    it('test not exist nickname [return null]', async () => {
      expect(await userService.findByNickname('')).toBeNull();
    });
  });

  describe('create', () => {
    it('test normal case [return user]', async () => {
      const user = UserFactory.getCreateUser();
      const answer = await prismaService.user.create({
        data: user,
        select: UserSelectQuery,
      });
      await prismaService.user.delete({ where: { id: answer.id } });
      const result = await userService.create(user);
      answer.id = result.id;
      answer.createdAt = result.createdAt;
      answer.updatedAt = result.updatedAt;
      expect(result).toStrictEqual(answer);
    });
    it('test already exist user case [throw error code P2002]', async () => {
      const user = UserFactory.getCreateUser();
      await prismaService.user.create({
        data: user,
        select: UserSelectQuery,
      });
      try {
        await userService.create(user);
        expect(true).toBe(false); // error not happened
      } catch (e) {
        expect(e.code).toBe('P2002');
      }
    });
  });

  describe('update', () => {
    it('test normal case [return user]', async () => {
      const user = await prismaService.user.create({
        data: UserFactory.getCreateUser(),
        select: UserSelectQuery,
      });
      const updateUser = UserFactory.getUpdateUser();
      const result = await userService.update(user.id, updateUser);
      expect(result.nickname).toEqual(updateUser.nickname);
      expect(result.profileImage).toEqual(updateUser.profileImage);
      expect(result.isMentor).toEqual(updateUser.isMentor);
    });
    it('test not exist user case [throw P2025]', async () => {
      try {
        await userService.update(-1, UserFactory.getUpdateUser());
      } catch (e) {
        expect(e.code).toBe('P2025');
      }
    });
  });
});
