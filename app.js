const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const charProfiles = []; 

app.use(bodyParser.json());

app.use(
    '/graphql', 
    graphqlHTTP({
        schema: buildSchema(`
            type CharProfile {
                _id: ID!
                name: String!
                age: String!
                eyeColour: String!
                hairColour: String!
                history: String!
            }

            input CharInput {
                name: String!
                age: String!
                eyeColour: String!
                hairColour: String!
                history: String!
            }

            type RootQuery {
                charProfiles: [CharProfile!]!
            }

            type RootMutation {
                createCharProfile(charInput: CharInput): CharProfile
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            charProfiles: () => {
                return charProfiles
            },
            createCharProfile: (args) => {
                const charProfile = {
                    _id: Math.random().toString(),
                    name: args.charInput.name,
                    age: args.charInput.age,
                    eyeColour: args.charInput.eyeColour,
                    hairColour: args.hairColour.hairColour,
                    history: args.charInput.history
                }
                charProfiles.push(charProfile);
                return charProfile;
            }
        },
        graphiql: true
    })
);

app.listen(3000);
