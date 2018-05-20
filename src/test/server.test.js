import startServer from '../server-setup';
import { request, GraphQLClient } from 'graphql-request';
import mongoose from 'mongoose';
import * as clientGraphql from './client-graphql';
import * as dataMocker from './data-mocker';

import 'dotenv/config';

const graphqlEndpoint = `http://localhost:${ process.env.TEST_PORT }/graphql`;

const getAuthenticatedClient = async() => {
  const variables = dataMocker.userData();
  const res = await request(graphqlEndpoint, clientGraphql.register, variables);
  const client = new GraphQLClient(graphqlEndpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: res.register.token,
    },
  });

  return {
    client,
    user: variables.user,
  };
};

const clearDatabase = async() => {
  const collections = mongoose.connection.collections;

  // Get collection names.
  const collectionsNames = Object.keys(collections);

  // Clear the dataMocker.in the collection.
  collectionsNames.forEach(async name => {
    await collections[name].remove({});
  });
};

// Pre-test settings
beforeAll(async() => {
  await startServer();
  await clearDatabase();
});

// test suites
describe('authentication', () => {
  test('register', async() => {
    const variables = dataMocker.userData();

    const res = await request(
      graphqlEndpoint,
      clientGraphql.register,
      variables
    );
    // console.log(res);
    expect(res.register.token).not.toBeNull();
  });

  test('login', async() => {
    // Pre-test: register the user;
    const userData = dataMocker.userData();
    let variables = userData;
    await request(graphqlEndpoint, clientGraphql.register, variables);

    // Test login
    variables = {
      user: {
        email: userData.user.email,
        password: userData.user.password,
      },
    };
    const res = await request(graphqlEndpoint, clientGraphql.login, variables);
    expect(res.login.token).not.toBeNull();
  });

  test('get me', async() => {
    // prepare for testing conditions
    const { client, user } = await getAuthenticatedClient();
    // test
    const res = await client.request(clientGraphql.me);
    expect(res.me.email).toBe(user.email);
  });
});

describe('tags', () => {
  test('create tag', async() => {
    const {client} = await getAuthenticatedClient();
    const variables = dataMocker.tagData();
    const res = await client.request(clientGraphql.createTag, variables);
    expect(res.createTag.name).toBe(variables.tag.name);
  });

  test('get all tags', async() => {
    // prepare a testing tag
    const { client } = await getAuthenticatedClient();
    const variables = dataMocker.tagData();
    await client.request(clientGraphql.createTag, variables);
    // test getTags
    const res = await client.request(clientGraphql.getTags);
    expect(res.tags.length).toBeGreaterThan(0);
  });

  test('get tags owned by the user', async() => {
    // prepare the testing tags
    const {client} = await getAuthenticatedClient();
    const count = 5;
    for (let i = 0; i < count; ++i) {
      const variables = dataMocker.tagData();
      await client.request(clientGraphql.createTag, variables);
    }
    // test getTags
    let res = await client.request(clientGraphql.getMyTags);
    expect(res.mytags.length).toBe(count);
  });

  test('get single tag', async() => {
    // prepare for a testing tag
    const {client} = await getAuthenticatedClient();
    const testTag = dataMocker.tagData();
    let variables = testTag;
    let res = await client.request(clientGraphql.createTag, variables);
    // test getTag
    variables = {
      id: res.createTag.id,
    };
    res = await client.request(clientGraphql.getTag, variables);
    expect(res.tag.name).toBe(testTag.tag.name);
  });

  test('update tag', async() => {
    const { client } = await getAuthenticatedClient();
    const tagData = dataMocker.tagData();
    let variables = tagData;
    let res = await client.request(clientGraphql.createTag, variables);
    variables = {
      id: res.createTag.id,
      tag: {
        name: 'new tag',
      },
    };
    res = await client.request(clientGraphql.updateTag, variables);
    expect(res.updateTag.name).toBe(variables.tag.name);
  });

  test('delete tag', async() => {
    // prepare for a testing tag
    const { client } = await getAuthenticatedClient();
    const tagData = dataMocker.tagData();
    let variables = tagData;
    let res = await client.request(clientGraphql.createTag, variables);
    variables = {
      id: res.createTag.id,
    };
    // delete the tag
    res = await client.request(clientGraphql.deleteTag, variables);
    expect(res.deleteTag.name).toBe(tagData.tag.name);
    // verify the tag is actually removed from database.
    res = await client.request(clientGraphql.getTag, variables);
    expect(res.tag).toBeNull();
  });
});

describe('posts', () => {
  test('create post', async() => {
    // preparation
    const { client } = await getAuthenticatedClient();
    const postData = dataMocker.postData();
    const variables = postData;
    // main test
    const res = await client.request(clientGraphql.createPost, variables);
    expect(res.createPost.title).toBe(postData.post.title);
  });

  test('get post', async() => {
    // Preparation
    const { client } = await getAuthenticatedClient();
    const postData = dataMocker.postData();
    let variables = postData;
    let res = await client.request(clientGraphql.createPost, variables);
    // mait test
    variables = {
      id: res.createPost.id,
    };
    res = await client.request(clientGraphql.getPost, variables);
    expect(res.post.title).toBe(postData.post.title);
  });

  test('update post', async() => {
    // Preparation
    const { client } = await getAuthenticatedClient();
    const postData = dataMocker.postData();
    let variables = postData;
    let res = await client.request(clientGraphql.createPost, variables);
    // update the post
    variables = {
      id: res.createPost.id,
      post: {
        title: 'new title',
      },
    };
    res = await client.request(clientGraphql.updatePost, variables);
    expect(res.updatePost.title).toBe(variables.post.title);
  });

  test('delete post', async() => {
    // Preparation
    const { client } = await getAuthenticatedClient();
    const postData = dataMocker.postData();
    let variables = postData;
    let res = await client.request(clientGraphql.createPost, variables);
    // Delete the post
    variables = {
      id: res.createPost.id,
    };
    res = await client.request(clientGraphql.deletePost, variables);
    expect(res.deletePost.id).toBe(variables.id);
    // Verify the post was actually removed from database
    res = await client.request(clientGraphql.getPost, variables);
    expect(res.post).toBeNull();
  });
  test('get post connection', async() => {
    // Preparation
    const { client } = await getAuthenticatedClient();
    await mongoose.connection.collections['posts'].remove({});
    // Create multiple posts
    const count = 5;
    for (let i = 0; i < count; ++i) {
      const variables = dataMocker.postData();
      await client.request(clientGraphql.createPost, variables);
    }
    // get connection (first halves)
    const first = Math.ceil(count / 2);
    let variables = {
      first,
    };
    let res = await client.request(clientGraphql.getPosts, variables);
    // console.log(res.posts);
    expect(res.posts.edges.length).toEqual(first);
    expect(res.posts.pageInfo.hasNextPage).toBeTruthy();
    // get connection (second halves)
    variables = {
      first,
      after: res.posts.pageInfo.endCursor,
    };
    res = await client.request(clientGraphql.getPosts, variables);
    // console.log(res.posts);
    expect(res.posts.edges.length).toEqual(count - first);
    expect(res.posts.pageInfo.hasNextPage).toBeFalsy();
  });
});

describe('comments', () => {
  test('create comment', async() => {
    // Prepare a post to comment on
    const { client } = await getAuthenticatedClient();
    const postData = dataMocker.postData();
    let variables = postData;
    let res = await client.request(clientGraphql.createPost, variables);
    const postId = res.createPost.id;
    // create a comment
    const commentData = dataMocker.commentData();
    variables = {
      comment_on: postId,
      ...commentData,
    };
    res = await client.request(clientGraphql.createComment, variables);
    expect(res.createComment.comment_on).toBe(postId);
    expect(res.createComment.body).toBe(commentData.comment.body);
  });

  test('get comments on post', async() => {
    // Create a post to comment on
    const { client } = await getAuthenticatedClient();
    const postData = dataMocker.postData();
    let variables = postData;
    let res = await client.request(clientGraphql.createPost, variables);
    const postId = res.createPost.id;
    // Add some comments on the post
    const count = 5;
    for (let i = 0; i < count; ++i) {
      const commentData = dataMocker.commentData();
      const variables = {
        comment_on: postId,
        ...commentData,
      };
      await client.request(clientGraphql.createComment, variables);
    }
    // Get the comments connection (first halves)
    const first = Math.ceil(count / 2);
    variables = {
      on: postId,
      first,
    };
    res = await client.request(clientGraphql.getComments, variables);
    expect(res.comments.edges.length).toEqual(first);
    expect(res.comments.pageInfo.hasNextPage).toBeTruthy();
    // Get the comments connection (second halves)
    variables = {
      on: postId,
      first,
      after: res.comments.pageInfo.endCursor,
    };
    res = await client.request(clientGraphql.getComments, variables);
    expect(res.comments.edges.length).toEqual(count - first);
    expect(res.comments.pageInfo.hasNextPage.toBeFalsy);
  });
});
