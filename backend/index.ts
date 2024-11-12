import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { buildSchema } from 'type-graphql';
import { MessageResolver } from '../backend/resolvers/chat';
import { pubSub } from '../backend/resolvers/pubsub';

async function startServer() {
  const app = express();

  const httpServer = createServer(app);

  const schema = await buildSchema({
    resolvers: [MessageResolver],
    pubSub,
  });

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
        
      {
        async serverWillStart() {
          return {
            async drainServer() {
              wsServer.close();
            },
          };
        },
      },
    ],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  useServer({ schema }, wsServer);

  httpServer.listen(4000, () => {
    console.log(`Server is now running on http://localhost:4000${apolloServer.graphqlPath}`);
    console.log(`Subscriptions are running on ws://localhost:4000/graphql`);
  });
}

startServer();
