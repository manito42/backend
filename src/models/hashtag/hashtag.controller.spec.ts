import { PrismaService } from '../../database/services/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { HashtagController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';
import { HashtagFactory } from '../../database/factories/hashtag.factory';
describe('HashtagController', () => {
  let hashtagController: HashtagController;
  let hashtagService: HashtagService;

  beforeEach(() => {
    hashtagService = new HashtagService(new PrismaService());
    hashtagController = new HashtagController(hashtagService);
  });

  describe('create', () => {
    it('test normal case [return a menteeFeedback]', async () => {
      const result = HashtagFactory.getHashtag();
      jest.spyOn(hashtagService, 'create').mockImplementation(async () => result);
      expect(await hashtagController.create(HashtagFactory.getCreateHashTag())).toBe(result);
    });
  });

  describe('findMany', () => {
    it('test normal case [return array of menteeFeedback]', async () => {
      const result = HashtagFactory.getHashtags(10);
      jest.spyOn(hashtagService, 'findMany').mockImplementation(async () => result);
      expect(await hashtagController.getHashtags({ take: 10, page: 0 })).toBe(result);
    });
  });

  describe('findById', () => {
    it('test normal case [return a menteeFeedback]', async () => {
      const result = HashtagFactory.getHashtag();
      jest.spyOn(hashtagService, 'findById').mockImplementation(async () => result);
      expect(await hashtagController.getHashtagById(result.id)).toBe(result);
    });
    it('test id < 1 [throw BadRequestException]', async () => {
      const result = HashtagFactory.getHashtag();
      jest.spyOn(hashtagService, 'findById').mockImplementation(async () => result);
      await expect(hashtagController.getHashtagById(-1)).rejects.toThrowError(BadRequestException);
    });
    it('test not exist id [throw NotFoundException]', async () => {
      jest.spyOn(hashtagService, 'findById').mockImplementation(async () => null);
      await expect(hashtagController.getHashtagById(1)).rejects.toThrow(NotFoundException);
    });
  });
});
