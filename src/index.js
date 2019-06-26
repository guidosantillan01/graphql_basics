import { GraphQLServer } from 'graphql-yoga';

// Demo user data
const users = [
  {
    id: '1',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com'
  },
  {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com'
  }
];

const posts = [
  {
    id: 'p1',
    title: 'ABC title',
    body: 'XYZ title',
    published: true,
    author: '1'
  },
  {
    id: 'p2',
    title: 'TTT title',
    body: 'BBB body',
    published: false,
    author: '1'
  },
  {
    id: 'p3',
    title: '111 title',
    body: '222 body',
    published: true,
    author: '2'
  }
];

const comments = [
  {
    id: 'c1',
    text: 'Nice info',
    author: '1',
    post: 'p1'
  },
  {
    id: 'c2',
    text: 'Cool bro!',
    author: '1',
    post: 'p2'
  },
  {
    id: 'c3',
    text: 'Thank you. I will check it out.',
    author: '2',
    post: 'p2'
  },
  {
    id: 'c4',
    text: 'I hate you',
    author: '3',
    post: 'p3'
  }
];

// Type definitions (Application Schema. Describes the operations and data structures)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }
  
  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

// Resolvers (Functions that run when operations are performed)
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }

      return posts.filter(post => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());
        return isTitleMatch || isBodyMatch;
      });
    },
    comments(parent, args, ctx, info) {
      return comments;
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
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author; // The parent is the Post
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find(post => {
        return post.id === parent.post;
      });
    }
  }
};

// Startup the server
const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log('The server is up!'); // Default port: 4000
});
