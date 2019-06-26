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
    id: '1',
    title: 'ABC title',
    body: 'XYZ title',
    published: true,
    author: '1'
  },
  {
    id: '2',
    title: 'TTT title',
    body: 'BBB body',
    published: false,
    author: '1'
  },
  {
    id: '3',
    title: '111 title',
    body: '222 body',
    published: true,
    author: '2'
  }
];

const comments = [
  {
    id: 'c1',
    text: 'Nice info'
  },
  {
    id: 'c2',
    text: 'Cool bro!'
  },
  {
    id: 'c3',
    text: 'Thank you. I will check it out.'
  },
  {
    id: 'c4',
    text: 'I hate you'
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
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }
  
  type Comment {
    id: ID!
    text: String!
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
        return user.id === parent.author;
      });
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        return post.author === parent.id;
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
