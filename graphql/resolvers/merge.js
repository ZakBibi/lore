const CharProfile = require('../../models/charProfile');
const User = require('../../models/user');

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
};

const transformProfile = profile => {
    return {
        ...profile._doc,
        _id: profile.id,
        creator: user.bind(this, profile.creator)
    };
};

exports.transformProfile = transformProfile;
