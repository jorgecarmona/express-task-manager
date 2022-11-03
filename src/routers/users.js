import express from 'express';
import User from '../models/user.js';
import auth from '../middleware/auth.js';

const router = new express.Router();

/**
 * Public routes
 */
// signup: non protected
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    const token = await user.generateAuthToken();

    await user.save();

    res.status(201).send({user, token});
  } catch (e) {
    res.status(400).send(e);
  }
});

// login: non protected
router.post('/users/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    res.send({user, token});
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/**
 * Private routes: Need auth
 */
// get auth user profile
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates!'});
  }

  try {
    const user = req.user;

    updates.forEach((update) => user[update] = req.body[update]);
    await user.save();

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();

    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

export default router;

