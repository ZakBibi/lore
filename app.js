const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const CharProfile = require('./models/charProfile');
const User = require('./models/user');

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

            type User {
                _id: ID!
                email: String!
                password: String
                userName: String!
            }

            input CharInput {
                name: String!
                age: String!
                eyeColour: String!
                hairColour: String!
                history: String!
                dateCreated: String!
            }

            input UserInput {
                email: String!
                password: String!
                userName: String!
            }

            type RootQuery {
                charProfiles: [CharProfile!]!
            }

            type RootMutation {
                createCharProfile(charInput: CharInput): CharProfile
                createUser(userInput: UserInput): User
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
                    dateCreated: new Date(args.charInput.dateCreated),
                    creator: '5f3d50b01f339d311f694222'
                });
                let createdProfile;
                return charProfile
                .save()
                .then(result => {
                    createdProfile = {...result._doc, _id: result.id};
                    return User.findById('5f3d50b01f339d311f694222')
                })
                .then(user => {
                    if (!user) {
                        throw new Error('User not found.');
                    }
                    user.createdEvents.push(charProfile);
                    return user.save();
                })
                .then(result => {
                    return createdProfile;
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
            },
            createUser: args => {
                return User.findOne({email: args.userInput.email}).then(user => {
                    if (user) {
                        throw new Error('User exists already.');
                    }
                    return bcrypt.hash(args.userInput.password, 12);
                })
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password:hashedPassword,
                        userName: args.userInput.userName
                    });
                    return user.save();
                })
                .then(user => {
                    return { ... user._doc, password: null, _id: user.id}
                })
                .catch(err => {
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
