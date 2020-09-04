const { buildSchema } = require('graphql');

module.exports = buildSchema(`
        type CharProfile {
            _id: ID!
            name: String!
            age: String!
            gender: String!
            eyeColour: String!
            hairColour: String!
            history: String!
            origin: String!
            creator: User!
        }

        type User {
            _id: ID!
            email: String!
            password: String
            userName: String!
            createdProfiles: [CharProfile!]
        }

        type AuthData {
            userId: ID!
            token: String!
            tokenExpiration: Int!
        }

        input CharInput {
            name: String!
            age: String!
            gender: String!
            eyeColour: String!
            hairColour: String!
            history: String!
            origin: String!
        }

        input UserInput {
            email: String!
            password: String!
            userName: String!
        }

        type RootQuery {
            charProfiles: [CharProfile!]!
            login(email: String!, password: String!, userName: String!): AuthData!
        }

        type RootMutation {
            createCharProfile(charInput: CharInput): CharProfile
            createUser(userInput: UserInput): User
            deleteCharProfile(profileId: ID!): CharProfile!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `)
