import { faker } from "@faker-js/faker";

export const createFakeUser = () => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: `${faker.internet.password({ length: 15 })}1`,
  };
};
