export const register = `
  mutation register($user: UserInput!) {
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

export const login = `
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

export const me = `
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

export const createTag = `
  mutation createTag($tag: TagInput!) {
    createTag(tag: $tag) {
      id
      name
    }
  }
`;

export const getTags = `
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

export const getMyTags = `
  query {
    mytags {
      id
      name
      owner {
        id
        email
      }
    }
  }
`;

export const getTag = `
  query getTag($id: ID!) {
    tag(id: $id) {
      id
      name
    } 
  }
`;

export const updateTag = `
  mutation updateTag($id: ID!, $tag: TagInput!) {
    updateTag(id: $id, tag: $tag) {
      id
      name
    }
  }
`;

export const deleteTag = `
  mutation deleteTag($id: ID!) {
    deleteTag(id: $id) {
      id
      name
    }
  }
`;

export const createPost = `
  mutation createPost($post: PostInput!) {
    createPost(post: $post) {
      id
      title
      body
      feature_image_url
    }
  }
`;

export const getPosts = `
  query getPosts($first: Int, $after: String, $order: String) {
    posts(first: $first, after: $after, order: $order) {
      edges {
        cursor
        node {
          id
          title
          body
          feature_image_url
          author {
            id
            email
            name {
              first
              last
            }
            avatar
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const getPost = `
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

export const updatePost = `
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

export const deletePost = `
  mutation deletePost($id: ID!) {
    deletePost(id: $id) {
      id
    } 
  }
`;

export const createComment = `
  mutation createComment($comment_on: ID!, $comment: CommentInput!) {
    createComment(comment_on: $comment_on, comment: $comment) {
      id
      body
      author {
        id
        email
      }
      comment_on
    }
  }
`;

export const getComments = `
  query getComments($on: ID!, $first: Int, $after: String, $order: String) {
    comments(on:$on, first: $first, after:$after, order:$order) {
      edges {
        cursor
        node {
          id
          body
          author {
            id 
            email
            avatar
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
