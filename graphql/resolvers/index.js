const bcrypt = require('bcryptjs')

const CharProfile = require('../../models/charProfile');
const User = require('../../models/user');

const transformProfile = profile => {
    return {
        ...profile._doc,
        _id: profile.id,
        creator: user.bind(this, profile.creator)
    };
};

const profiles = async profileIds => {
    try {
        const profiles = await CharProfile.find({ _id: { $in: profileIds } });
        return profiles.map(profile => {
            return transformProfile(profile)
        });
    } catch (err) {
        throw err;
    }
};

const singleProfile = async profileId => {
    try {
        const profile = await profile.findById(profileId);
        return transformProfile(profile);
    } catch (err) {
        throw err; 
    }
};

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
                return transformProfile(profile);
            });
        } catch (err) {
            throw err;
        }
        },
        createCharProfile: async (args) => {
            const charProfile = new CharProfile({
                name: args.charInput.name,
                age: args.charInput.age,
                gender: args.charInput.gender,
                eyeColour: args.charInput.eyeColour,
                hairColour: args.charInput.hairColour,
                history: args.charInput.history,
                origin: args.charInput.origin,
                creator: '5f3d50b01f339d311f694222'
            });
            let createdProfile;
            try {
                const result = await charProfile.save();
                createdProfile = transformProfile(result);
                const creator = await User.findById('5f3d50b01f339d311f694222');

                if (!creator) {
                    throw new Error('User not found.');
                }
                creator.createdProfiles.push(charProfile);
                await creator.save();

                return createdProfile;
            } catch (err) {
                console.log(err);
                throw err;
            }
        },
        deleteCharProfile: async args => {
            try {
                const profile = await Profile.findById(args.profileId).populate('profile');
                const charProfile = transformProfile(profile)
                await Profile.deleteOne({_id: args.profileId})
                return charProfile
            } catch (err) {
            throw err
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
};
