const bcrypt = require('bcryptjs')
const User = require('../../models/user');

module.exports = {
    createUser: async args => {
        try {
            const user = await User.findOne({ email: args.userInput.email });
            if (user) {
                throw new Error('User exists already.');
            }
            const userName = await User.findOne({ userName: args.userInput.userName });
            if (userName) {
                throw new Error('User name exists already.')
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