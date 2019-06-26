import { GraphQLServer } from 'graphql-yoga';

// Type definitions (Application Schema. Describes the operations and data structures)
const typeDefs = `
  type Query {
    greeting(name: String, position: String): String!
    add(numbers: [Float!]!): Float!
    grades: [Int]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

// Resolvers (Functions that run when operations are performed)
const resolvers = {
  Query: {
    greeting(parent, args, ctx, info) {
      // args is where data lives
      if (args.name && args.position) {
        return `Hello, ${args.name}. You are my favorite ${args.position}`;
      } else {
        return 'Hello';
      }
    },
    add(parent, args, ctx, info) {
      if (args.numbers.length === 0) {
        return 0;
      }

      return args.numbers.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      });
    },
    grades(parent, args, ctx, info) {
      return [99, 80, 93];
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
