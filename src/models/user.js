import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    default: 'test@test.com',
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    }
  },
  age: {
    type: Number,
    required: true,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive value');
      }

      if (!value) {
        throw new Error('Age is required!');
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
    lowercase: true,
    validate(value) {
      if (value.includes('password')) {
        throw new Error('passwords must not contain the word password!');
      }
    }
  }
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({email});

  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
};

// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model('User', userSchema);

export default User;