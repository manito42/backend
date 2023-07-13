import { UserRole } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { MentorProfileFactory } from './mentorProfile.factory';
import { IUserResponse } from '../../common/interfaces/api/user/userResponse.interface';

export class UserFactory {
  constructor() {}

  static getUser(admin?: boolean): IUserResponse {
    const mentorProfile = MentorProfileFactory.getMentorProfile();
    const user = {
      id: faker.number.int({ min: 1, max: 1000 }),
      email: faker.internet.email(),
      nickname: faker.internet.userName(),
      profileImage: faker.internet.avatar(),
      role: admin ? 'ADMIN' : 'USER',
      isMentor: faker.datatype.boolean(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.future(),
    };

    if (user.isMentor) {
      user['mentorProfile'] = mentorProfile;
    }
    return user;
  }

  static getUsers(count: number, admin?: boolean): Array<IUserResponse> {
    const users = [];
    for (let i = 0; i < count; i++) {
      users.push(UserFactory.getUser(admin));
    }
    return users;
  }

  static getCreateUser(email?: string, nickname?: string) {
    return {
      email: email ? email : faker.internet.email(),
      nickname: nickname ? nickname : faker.internet.userName(),
      profileImage: faker.internet.avatar(),
      isMentor: faker.datatype.boolean(),
      role: UserRole.USER,
    };
  }

  private static getUniqueEmails(count) {
    const emails = new Set();
    for (; emails.size < count; ) {
      emails.add(faker.internet.email());
    }
    return emails;
  }

  private static getUniqueNicknames(count) {
    const nicknames = new Set();
    for (; nicknames.size < count; ) {
      nicknames.add(faker.internet.userName());
    }
    return nicknames;
  }
  '';
  static getCreateUsers(count: number) {
    // create unique emails and nicknames
    const emails = this.getUniqueEmails(count);
    const nicknames = this.getUniqueNicknames(count);
    const users = [];
    for (let i = 0; i < count; i++) {
      const email = emails.values().next().value;
      const nickname = nicknames.values().next().value;
      users.push(UserFactory.getCreateUser(email, nickname));
      emails.delete(email);
      nicknames.delete(nickname);
    }
    return users;
  }

  static getUpdateUser() {
    return {
      nickname: faker.internet.userName(),
      profileImage: faker.internet.avatar(),
      isMentor: faker.datatype.boolean(),
    };
  }
}
