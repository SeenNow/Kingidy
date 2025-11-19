import 'dotenv/config';
import { createServer } from 'http';
import { createSchema, createYoga } from 'graphql-yoga';
import express from 'express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import prisma from './prismaClient';

const app = express();

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphiql: process.env.NODE_ENV !== 'production',
});

app.use('/graphql', yoga as any);

app.get('/', (_req, res) => {
  res.json({ status: 'Kingidy GraphQL API' });
});

const server = createServer(app);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
server.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}/graphql`);
  // Try migrating and generating prisma client if present
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
