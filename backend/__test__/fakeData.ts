import { randomUUID } from 'crypto';
import {
  INewUserDto,
  IUserDto,
} from '../src/api/v1/data-access/interfaces/IUserDto';
import { faker } from '@faker-js/faker';

export const createFakeUser = (): IUserDto => {
  return {
    id: faker.database.mongodbObjectId(),
    email: faker.internet.email(),
    name: faker.person.firstName(),
    //+1 to make sure there is at least one number
    password: `${faker.internet.password({ length: 15 })}+1`,
    key: randomUUID(),
  };
};

export const createFakeUserWithoutID = (): INewUserDto => {
  return {
    email: faker.internet.email(),
    name: faker.person.firstName(),
    password: `${faker.internet.password({ length: 15 })}+1`,
    key: randomUUID(),
  };
};
