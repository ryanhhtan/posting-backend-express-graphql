import faker from 'faker';

export const userData = () => ({
  user: {
    email: faker.internet.email(),
    name: {
      first: faker.name.firstName(),
      last: faker.name.lastName(),
    },
    password: '123456',
  },
});

export const tagData = () => ({
  tag: {
    name: faker.random.word(),
  },
});

export const postData = () => ({
  post: {
    title: faker.lorem.words(),
    body: faker.lorem.paragraphs(),
    feature_image_url: faker.image.imageUrl(),
  },
});

export const commentData = () => ({
  comment: {
    body: faker.lorem.paragraphs(),
  },
});
