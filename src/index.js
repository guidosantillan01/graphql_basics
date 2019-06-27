import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid';

import db from './db';

// Resolvers (Functions that run when operations are performed)
const resolvers = {
  Query: {
    users(parent, args, { db }, info) {
      if (!args.query) {
        return db.users;
      }

      return db.users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, { db }, info) {
      if (!args.query) {
        return db.posts;
      }

      return db.posts.filter(post => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());
        return isTitleMatch || isBodyMatch;
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments;
    },
    me() {
      return {
        // We call the database here
        id: '123aaa',
        name: 'Mike',
        email: 'mike@example.com',
        age: 21
      };
    },
    post() {
      return {
        id: 'qq223e',
        title: 'This is a post title',
        body: 'This is the body of the post',
        published: true
      };
    }
  },
  Mutation: {
    createUser(parent, args, { db }, info) {
      const emailTaken = db.users.some(user => user.email === args.data.email);

      if (emailTaken) {
        throw new Error('Email taken.');
      }

      const user = {
        id: uuidv4(),
        ...args.data
      };

      db.users.push(user);

      return user;
    },
    deleteUser(parent, args, { db }, info) {
      const userIndex = db.users.findIndex(user => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const deletedUsers = db.users.splice(userIndex, 1);

      // Delete posts and comments from deleted user
      db.posts = db.posts.filter(post => {
        const match = post.author === args.id;
        if (match) {
          db.comments = db.comments.filter(comment => comment.post !== post.id);
        }
        return !match;
      });

      db.comments = db.comments.filter(comment => comment.author !== args.id);

      return deletedUsers[0]; // Return the first and only item from the array
    },
    createPost(parent, args, { db }, info) {
      const userExists = db.users.some(user => user.id === args.data.author);

      if (!userExists) {
        throw new Error('User not found');
      }

      const post = {
        id: uuidv4(),
        ...args.data
      };

      db.posts.push(post);

      return post;
    },
    deletePost(parent, args, { db }, info) {
      const postIndex = db.posts.findIndex(post => post.id === args.id);

      if (postIndex === -1) {
        throw new Error('Post not found');
      }

      const deletedPosts = db.posts.splice(postIndex, 1);

      // Delete comments from deleted posts
      db.comments = db.comments.filter(comment => comment.post !== args.id);

      return deletedPosts[0]; // Return the first and only item from the array
    },
    createComment(parent, args, { db }, info) {
      const userExists = db.users.some(user => user.id === args.data.author);
      const postExists = db.posts.some(
        post => post.id === args.data.post && post.published
      );

      if (!userExists || !postExists) {
        throw new Error('Unable to find user and post');
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      };

      db.comments.push(comment);

      return comment;
    },
    deleteComment(parent, args, { db }, info) {
      const commentIndex = db.comments.findIndex(
        comment => comment.id === args.id
      );

      if (commentIndex === -1) {
        throw new Error('Comment not found');
      }

      const deletedComments = db.comments.splice(commentIndex, 1);

      return deletedComments[0];
    }
  },
  Post: {
    author(parent, args, { db }, info) {
      return db.users.find(user => {
        return user.id === parent.author; // The parent is the Post
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    posts(parent, args, { db }, info) {
      return db.posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args, { db }, info) {
      return db.users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, { db }, info) {
      return db.posts.find(post => {
        return post.id === parent.post;
      });
    }
  }
};

// Startup the server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql', // Path relative to our route folder
  resolvers,
  context: {
    db
  }
});

server.start({ port: 4001 }, () => {
  console.log('The server is up!'); // Default port: 4000
});
