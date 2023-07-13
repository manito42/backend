import { faker } from '@faker-js/faker';
import { IHashtagResponse } from '../../common/interfaces/api/hashtag/hashtagResponse.interface';
import { IHashtagRequest } from '../../common/interfaces/api/hashtag/hashtagRequest.interface';

export class HashtagFactory {
  constructor() {}

  static getHashtag(numberOfHashtags?: number) {
    return {
      id: faker.number.int({ min: 1, max: numberOfHashtags ? numberOfHashtags : 100000 }),
      name: faker.lorem.word(),
    };
  }

  static getHashtags(count: number) {
    const hashtags = [];
    for (let i = 0; i < count; i++) {
      hashtags.push(HashtagFactory.getHashtag(count));
    }
    return hashtags;
  }

  static getCreateHashTag(name?: string) {
    return {
      name: name ? name : faker.lorem.word(),
    };
  }

  static getCreateHashTags(count: number): any[] {
    const hashtagNames = new Set();
    const hashtags = [];
    for (; hashtagNames.size < count; ) {
      hashtagNames.add(HashtagFactory.getCreateHashTag().name);
    }
    for (let i = 0; i < count; i++) {
      const name = hashtagNames.values().next().value;
      hashtags.push(HashtagFactory.getCreateHashTag(name));
      hashtagNames.delete(name);
    }
    return hashtags;
  }
}
