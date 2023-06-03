import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../database/services/prisma.service';
import { UserFactory } from '../../database/factories/user.factory';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(new PrismaService());
    userController = new UserController(userService);
  });

  // service가 더 중요한 영역이기 때문에 가볍게 테스트함.
  describe('findMany', () => {
    it('test normal case [return user array]', async () => {
      const result = UserFactory.getUsers(10);
      jest.spyOn(userService, 'findMany').mockImplementation(async () => result);

      expect(await userController.getUsers({})).toBe(result);
    });
  });

  describe('findById', () => {
    it('test normal case [return user object]', async () => {
      const result = UserFactory.getUser();
      jest.spyOn(userService, 'findById').mockImplementation(async () => result);
      expect(await userController.getUserById(result.id)).toBe(result);
    });
    it('test id < 0 [throw BadRequestException]', async () => {
      await expect(userController.getUserById(-1)).rejects.toThrowError(BadRequestException);
    });
    it('test id not exists [throw NotFoundException]', async () => {
      jest.spyOn(userService, 'findById').mockImplementation(async () => null);
      await expect(userController.getUserById(1)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('create', () => {
    it('test normal case [return user object]', async () => {
      const result = UserFactory.getUser();
      jest.spyOn(userService, 'create').mockImplementation(async () => result);
      expect(await userController.create(UserFactory.getCreateUser())).toBe(result);
    });
  });

  describe('update', () => {
    it('test normal case [return user object]', async () => {
      const result = UserFactory.getUser();
      jest.spyOn(userService, 'update').mockImplementation(async () => result);
      expect(await userController.update(1, UserFactory.getUpdateUser())).toBe(result);
    });
    it('test not exist user case [throw BadRequestException]', async () => {
      await expect(userController.update(-1, UserFactory.getUpdateUser())).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('verifyNickname', () => {
    it('test normal case [no throw]', async () => {
      jest.spyOn(userService, 'findByNickname').mockImplementation(async () => null);
      await expect(userController.verifyNickname('nickname')).resolves.not.toThrowError();
    });
    it('test already exists [throw ConflictException]', async () => {
      jest
        .spyOn(userService, 'findByNickname')
        .mockImplementation(async () => UserFactory.getUser());
      await expect(userController.verifyNickname('nickname')).rejects.toThrowError(
        ConflictException,
      );
    });
  });
});
