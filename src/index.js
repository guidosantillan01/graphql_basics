import { GraphQLServer, PubSub } from 'graphql-yoga';

import db from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import User from './resolvers/User';
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';

const pubsub = new PubSub(); // To implement subscriptions

// Startup the server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql', // Path relative to our route folder
  resolvers: {
    // Resolvers (Functions that run when operations are performed)
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  },
  context: {
    db,
    pubsub
  }
});

server.start({ port: 4001 }, () => {
  console.log('The server is up!'); // Default port: 4000
});
