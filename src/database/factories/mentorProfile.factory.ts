import { User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { HashtagFactory } from './hashtag.factory';
import { CategoryFactory } from './category.factory';
import { IMentorProfileResponse } from '../../common/interfaces/api/mentorProfile/mentorProfileResponse.interface';

export class MentorProfileFactory {
  constructor() {}

  static getMentorProfile(): IMentorProfileResponse {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      shortDescription: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.future(),
      isHide: faker.datatype.boolean(),
      hashtags: HashtagFactory.getHashtags(3),
      categories: CategoryFactory.getCategories(3),
      user: {
        id: faker.number.int({ min: 1, max: 1000 }),
        nickname: faker.internet.userName(),
        profileImage: faker.internet.avatar(),
      },
    };
  }

  static getSimpleMentorProfile() {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      shortDescription: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.future(),
      isHide: faker.datatype.boolean(),
      hashtags: HashtagFactory.getHashtags(3),
      categories: CategoryFactory.getCategories(3),
    };
  }

  static getMentorProfiles(count: number): Array<IMentorProfileResponse> {
    const mentorProfiles = [];
    for (let i = 0; i < count; i++) {
      mentorProfiles.push(MentorProfileFactory.getMentorProfile());
    }
    return mentorProfiles;
  }

  static getCreateMentorProfile(userId: number) {
    return {
      userId: userId,
      shortDescription: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      isHide: faker.datatype.boolean(),
    };
  }

  static getCreateMentorProfiles(mentors: Array<User>) {
    const mentorProfiles = [];
    for (const mentor of mentors) {
      mentorProfiles.push(MentorProfileFactory.getCreateMentorProfile(mentor.id));
    }
    return mentorProfiles;
  }

  static getUpdateMentorProfile() {
    return {
      shortDescription: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      isHide: faker.datatype.boolean(),
      hashtags: HashtagFactory.getHashtags(3).map((hashtag) => {
        return {
          id: hashtag.id,
        };
      }),
      categories: CategoryFactory.getCategories(3).map((category) => {
        return {
          id: category.id,
        };
      }),
    };
  }
}
