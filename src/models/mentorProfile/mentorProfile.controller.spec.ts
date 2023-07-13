import { PrismaService } from '../../database/services/prisma.service';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MentorProfileController } from './mentorProfile.controller';
import { MentorProfileService } from './mentorProfile.service';
import { MentorProfileFactory } from '../../database/factories/mentorProfile.factory';

describe('MentorProfileController', () => {
  let mentorProfileController: MentorProfileController;
  let mentorProfileService: MentorProfileService;

  beforeEach(() => {
    mentorProfileService = new MentorProfileService(new PrismaService());
    mentorProfileController = new MentorProfileController(mentorProfileService);
  });

  describe('create', () => {
    it('test normal case [return a mentorProfile]', async () => {
      const result = MentorProfileFactory.getMentorProfile();
      jest.spyOn(mentorProfileService, 'create').mockImplementation(async () => result);
      expect(
        await mentorProfileController.create(
          MentorProfileFactory.getCreateMentorProfile(result.user.id),
        ),
      ).toBe(result);
    });
  });

  describe('update', () => {
    it('test normal case [return a mentorProfile]', async () => {
      const result = MentorProfileFactory.getMentorProfile();
      jest.spyOn(mentorProfileService, 'update').mockImplementation(async () => result);
      expect(
        await mentorProfileController.update(
          result.id,
          MentorProfileFactory.getUpdateMentorProfile(),
        ),
      ).toBe(result);
    });
    it('test id < 0 [throw BadRequestException]', async () => {
      const result = MentorProfileFactory.getMentorProfile();
      jest.spyOn(mentorProfileService, 'update').mockImplementation(async () => result);
      await expect(
        mentorProfileController.update(-1, MentorProfileFactory.getUpdateMentorProfile()),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('findMany', () => {
    it('test normal case [return an array of mentorProfiles]', async () => {
      const result = MentorProfileFactory.getMentorProfiles(10);
      jest.spyOn(mentorProfileService, 'findMany').mockImplementation(async () => result);

      expect(await mentorProfileController.getMentorProfiles({})).toBe(result);
    });
  });

  describe('findById', () => {
    it('test normal case [return a mentorProfile]', async () => {
      const result = MentorProfileFactory.getMentorProfile();
      jest.spyOn(mentorProfileService, 'findById').mockImplementation(async () => result);
      expect(await mentorProfileController.getMentorProfileById(result.id)).toBe(result);
    });
    it('test id < 1 [throw BadRequestException]', async () => {
      await expect(mentorProfileController.getMentorProfileById(-1)).rejects.toThrowError(
        BadRequestException,
      );
    });
    it('test not exist id [throw NotFoundException]', async () => {
      jest.spyOn(mentorProfileService, 'findById').mockImplementation(async () => null);
      await expect(mentorProfileController.getMentorProfileById(1)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
