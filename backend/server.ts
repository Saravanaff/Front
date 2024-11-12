import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { CompanyResolver } from './resolvers/companyresolve';
import { UserResolver } from './resolvers/userresolve';
import { sequelize } from './database';

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

        server.listen({ port: 5500 }).then(({ url }) => {
            console.log(`Server is running on ${url}`);
        });
    } catch (err) {
        console.error('Error starting the server:', err);
    }
}

bootstrap();
