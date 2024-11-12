import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { CompanyResolver } from './resolvers/companyresolve';
import { UserResolver } from './resolvers/userresolve';
import { sequelize } from './database';
import dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
    try {
        const schema = await buildSchema({
            resolvers: [UserResolver, CompanyResolver],
        });
        const server = new ApolloServer({ schema });
        sequelize.sync()
    .then(() => {
        console.log("Tables Created");
    })
    .catch((err) => {
        console.error('Error syncing the database:', err);
    });

        server.listen({ port: process.env.PORT }).then(({ url }) => {
            console.log(`Server is running on ${url}`);
        });
    } catch (err) {
        console.error('Error starting the server:', err);
    }
}

bootstrap();
