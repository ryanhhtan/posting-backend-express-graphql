import startServer from '../server-setup';
import { request, GraphQLClient } from 'graphql-request';
import mongoose from 'mongoose';

import 'dotenv/config';

const graphqlEndpoint = `http://localhost:${ process.env.TEST_PORT }/graphql`;
const testData = {
  userData: {
    email: 'jdee@fakemail.com',
    password: '123456',
  },

  tagsData: [
    {name: 'Jest'},
    {name: 'GraphQL'},
    {name: 'React'},
  ],

  postData: {
    title: 'test post 1',
    body: 'test post1 - hello',
    feature_image_url: 'http://image.example.com/abcd.jpg',
  },
};

let savedResult = {
  token: '',
  tags: [],
  posts: [],
};

const getAuthenticatedClient = () => (new GraphQLClient(graphqlEndpoint, {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: savedResult.token,
  },
}));

// Pre-test
beforeAll(async() => {
  // Start the test server
  startServer();

  // Clear test database if exists
  const models = mongoose.connection.models;
  await Object.keys(models).forEach(async(name) => {
    await models[name].remove({});
  });

});

// Tests

describe('authentication', async() => {
  test('register', async() => {
    const mutation = `
    mutation registerUser($user: UserInput!) {
      register(user: $user) {
        user {
          id
          name {
            first
            last
          }
          email
          avatar
        }
        token
      }
    }
  `;

    const variables = {
      user: {
        name: {
          first: 'Jane',
          last: 'Dee',
        },
        ...testData.userData,
      },
    };

    const res = await request(graphqlEndpoint, mutation, variables);
    // console.log(res);
    savedResult.token = res.register.token;
    expect(res.register.token).not.toBeNull();

  });

  test('login', async() => {
    const mutation = `
    mutation login($user: LoginInput!){
      login(user: $user) {
        user {
          id
          name{
            first
            last
          }
          avatar
        }
        token
      }
    }
  `;

    const variables = {
      user: {
        ...testData.userData,
      },
    };
    const res = await request(graphqlEndpoint, mutation, variables);
    savedResult.token = res.login.token;
    expect(res.login.token).not.toBeNull();
  });

  test('get self info', async() => {
    const query = `
  query {
    me {
      id
      email
      name{
        first,
        last
      }
      avatar
    }
  }
  `;

    const client = getAuthenticatedClient();
    // console.log(client);

    const res = await client.request(query);
    // console.log(res);

    expect(res.me.email).toBe(testData.userData.email);
  });
});

describe('tags', async() => {
  test('create tags', async() => {
    const client = getAuthenticatedClient();
    const mutation = `
    mutation createTag($tag: TagInput!) {
      createTag(tag: $tag) {
        id
        name
      }
    }
  `;
    testData.tagsData.forEach(async tagInput => {
      // console.log(tagInput);

      const variables = {
        tag: {
          ...tagInput,
        },
      };

      // console.log(variables);

      const res = await client.request(mutation, variables);
      // console.log(res);
      const newTag = res.createTag;
      savedResult.tags.push(newTag);
      expect(newTag).not.toBeNull();
    });
  });

  test('get all tags owned by the user', async() => {
    const query = ` 
    query {
      tags {
        id
        name
        owner {
          id
          email
        }
      }
    }
  `;
    const client = getAuthenticatedClient();
    const res = await client.request(query);
    // console.log(res);
    expect(res.tags.length).toBeGreaterThan(0);
  });

  test('get single tag', async() => {
    const query = `
    query getTag($id: ID!) {
      tag(id: $id) {
        id
        name
      } 
    }
    `;

    // console.log(savedResult.tags);
    const variables = {
      id: savedResult.tags[0].id,
    };
    // console.log(variables);

    const client = getAuthenticatedClient();
    const res = await client.request(query, variables);
    // console.log(res);
    expect(res.tag.name).toBe(savedResult.tags[0].name);
  });

  test('update tag', async() => {
    const mutation = `
    mutation updateTag($id: ID!, $tag: TagInput!) {
      updateTag(id: $id, tag: $tag) {
        id
        name
      }
    }
  `;

    const variables = {
      id: savedResult.tags[0].id,
      tag: {
        name: 'NewTag',
      },
    };

    const client = getAuthenticatedClient();
    const res = await client.request(mutation, variables);
    // console.log(res);

    expect(res.updateTag.name).toBe(variables.tag.name);
  });

  test('delete tag', async() => {
    const mutation = `
    mutation deleteTag($id: ID!) {
      deleteTag(id: $id) {
        id
        name
      }
    }
  `;
    const variables = {
      id: savedResult.tags[0].id,
    };
    const client = getAuthenticatedClient();
    const res = await client.request(mutation, variables);
    // console.log(res);
    expect(res.deleteTag.id).toBe(variables.id);
  });
});

describe('posts', async() => {
  test('create post', async() => {
    const mutation = `
      mutation createPost($post: PostInput!) {
        createPost(post: $post) {
          id
          title
          body
          feature_image_url
        }
      }
    `;
    const tags = savedResult.tags.map(item => (item.id));
    const variables = {
      post: {
        ...testData.postData,
        tags,
      },
    };
    // console.log(variables);
    const client = getAuthenticatedClient();
    const res = await client.request(mutation, variables);
    // console.log(res);
    const newPostId = res.createPost.id;
    savedResult.posts.push(newPostId);
    expect(newPostId).not.toBeNull();
  });

  test('get all posts', async() => {
    const query = `
      query getPosts {
        posts {
          id
          title
          body
          feature_image_url
          tags {
            name
          }
        }
      }
    `;
    const res = await request(graphqlEndpoint, query);
    // console.log(res);
    expect(res.posts.length).toBeGreaterThan(0);
  });

  test('get single post', async() => {
    const query = `
      query getPost($id: ID!) {
        post(id: $id) {
          id
          title
          body
          feature_image_url
          created_at
          updated_at
        }
      }
    `;
    const variables = {
      id: savedResult.posts[0],
    };
    const res = await request(graphqlEndpoint, query, variables);
    // console.log(res);
    expect(res.post.id).toBe(savedResult.posts[0]);
  });

  test('update post', async() => {
    const mutation = `
      mutation updatePost($id: ID!, $post: PostInput!) {
        updatePost(id: $id, post: $post) {
          title
          body
          feature_image_url
          tags {
            id
          }
        }
      }
    `;
    const variables = {
      id: savedResult.posts[0],
      post: {
        title: 'new title',
        body: 'new body',
      },
    };
    const client = getAuthenticatedClient();
    const res = await client.request(mutation, variables);
    // console.log(res);
    expect(res.updatePost.title).toBe(variables.post.title);
  });

  test('delete post', async() => {
    const mutation = `
      mutation deletePost($id: ID!) {
        deletePost(id: $id) {
          id
        } 
      }
    `;
    const variables = {
      id: savedResult.posts[0],
    };
    const client = getAuthenticatedClient();
    const res = await client.request(mutation, variables);
    // console.log(res);
    expect(res.deletePost.id).toBe(variables.id);
  });
});
