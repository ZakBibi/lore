const CharProfile = require('../../models/charProfile');
const { transformProfile } = require('./merge')


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
    createCharProfile: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
        const charProfile = new CharProfile({
            name: args.charInput.name,
            age: args.charInput.age,
            gender: args.charInput.gender,
            eyeColour: args.charInput.eyeColour,
            hairColour: args.charInput.hairColour,
            history: args.charInput.history,
            origin: args.charInput.origin,
            creator: req.userId
        });
        let createdProfile;
        try {
            const result = await charProfile.save();
            createdProfile = transformProfile(result);
            const creator = await User.findById(req.userId);

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
    deleteCharProfile: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
        try {
            const profile = await Profile.findById(args.profileId).populate('profile');
            const charProfile = transformProfile(profile)
            await Profile.deleteOne({ _id: args.profileId });

            return charProfile;
        } catch (err) {
            throw err;
        }
    }
};