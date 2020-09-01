import * as Faker from "faker";
import { define } from "typeorm-seeding";
import { User } from "../../entities/user.entity";

define(User, (faker: typeof Faker) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);
  const email = faker.internet.email(firstName, lastName);
  const age = faker.random.number(50);

  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.age = age;
  return user;
});
