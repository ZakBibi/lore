const bcrypt = require('bcryptjs')
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error('User exists already.');
            }
            const existingUserName = await User.findOne({ userName: args.userInput.userName });
            if (existingUserName) {
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
    },
    login: async ({ email, password, userName }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User does not exist.');
        }
        const username = await User.findOne( {username: userName});
        if (!username) {
            throw new Error('Username is incorrect.')
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }
        const token = jwt.sign(
            {userId: user.id, email: user.email, username: user.userName},
            'somesupersecretkey', 
            {expiresIn: '1h'}
            );
            return { userId: user.id, token: token, tokenExpiration: 1 };
        }
};