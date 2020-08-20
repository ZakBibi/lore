const { buildSchema } = require('graphql');

module.exports = buildSchema(`
        type CharProfile {
            _id: ID!
            name: String!
            age: String!
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

        input CharInput {
            name: String!
            age: String!
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
        }

        type RootMutation {
            createCharProfile(charInput: CharInput): CharProfile
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `)
    