const bcrypt = require('bcryptjs')

const CharProfile = require('../../models/charProfile');
const User = require('../../models/user');

const profiles = async profileIds => {
    try {
        const profiles = await CharProfile.find({ _id: { $in: profileIds } });
        profiles.map(profile => {
            return {
                ...profile._doc,
                _id: profile.id,
                creator: user.bind(this, profile.creator)
            };
        });
    } catch (err) {
        throw err;
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdProfiles: profiles.bind(this, user._doc.createdProfiles)
        };
    } catch (err) {
        throw err;
    }
}

module.exports = {
        charProfiles: async () => {   
            try {
            const profiles = await CharProfile.find();
            return profiles.map(profile => {
                return { ...profile._doc, _id: profile.id };
            });
        }
        catch (err) {
            throw err;
        }
        },
        createCharProfile: async (args) => {
            const charProfile = new CharProfile({
                name: args.charInput.name,
                age: args.charInput.age,
                eyeColour: args.charInput.eyeColour,
                hairColour: args.charInput.hairColour,
                history: args.charInput.history,
                origin: args.charInput.origin,
                dateCreated: new Date(args.charInput.dateCreated),
                creator: '5f3d50b01f339d311f694222'
            });
            let createdProfile;
            try {
                const result = await charProfile
                    .save();
                createdProfile = { ...result._doc, _id: result.id };
                const user = await User.findById('5f3d50b01f339d311f694222');
                if (!user) {
                    throw new Error('User not found.');
                }
                user.createdProfiles.push(charProfile);
                const result_1 = await user.save();
                return createdProfile;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        },
        createUser: async args => {
            try {
                const user = await User.findOne({ email: args.userInput.email });
                if (user) {
                    throw new Error('User exists already.');
                }
                const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
                const user_1 = new User({
                    email: args.userInput.email,
                    password: hashedPassword,
                    userName: args.userInput.userName
                });
                const user_2 = await user_1.save();
                return { ...user_2._doc, password: null, _id: user_2.id };
            }
            catch (err) {
                throw err;
            }
    }
}
