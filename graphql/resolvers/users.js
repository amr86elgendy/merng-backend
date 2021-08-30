const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server');
const {
  generateToken,
  validateRegisterInput,
  validateLoginInput
} = require('../../util/validators');
const User = require('../../models/User');

module.exports = {
  Mutation: {
    login: async (_, { username, password }) => {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    register: async (
      _,
      {
        registerInput: { username, email, password, confirmPassword }
      }
    ) => {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      // TODO: Make sure user doesnt already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        });
      }
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = await User.create({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      const token = generateToken(newUser);

      return {
        ...newUser._doc,
        id: newUser._id,
        token
      };
    }
  }
};
