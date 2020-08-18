const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use(
    '/graphql', 
    graphqlHTTP({
        schema: buildSchema(`
            type RootQuery {
                charProfiles: [String!]!
            }

            type RootMutation {
                createCharProfile(name: String): String
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            charProfiles: () => {
                return ['Dex', 'Beni', 'Ohru']
            },
            createCharProfile: (args) => {
                const charProfileName = args.name;
                return charProfileName
            }
        },
        graphiql: true
    })
);

app.listen(3000);
