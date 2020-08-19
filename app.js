const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const CharProfile = require('./models/charProfile');

const app = express();

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
                dateCreated: String! 
            }

            input CharInput {
                name: String!
                age: String!
                eyeColour: String!
                hairColour: String!
                history: String!
                dateCreated: String!
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
                return CharProfile.find()
                .then(profiles => {
                    return profiles.map(profile => {
                        return { ...profile._doc, _id: profile.id };
                    })
                }).catch(err => {
                    throw err;
                });
            },
            createCharProfile: (args) => {
                const charProfile = new CharProfile({
                    name: args.charInput.name,
                    age: args.charInput.age,
                    eyeColour: args.charInput.eyeColour,
                    hairColour: args.charInput.hairColour,
                    history: args.charInput.history,
                    dateCreated: new Date(args.charInput.dateCreated)
                });
                return charProfile
                .save()
                .then(result => {
                    console.log(result);
                    return {...result._doc, _id: result.id};
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
            }
        },
        graphiql: true
    })
);

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@lorecluster0.d0xng.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`

mongoose.connect(uri, { useNewUrlParser: true })
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
