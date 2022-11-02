import express from 'express';
import User from '../models/user.js';

const router = new express.Router();

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Task: to find user by credentials (user/pass)
router.post('/users/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    
    const user = await User.findByCredentials(email, password);

    res.send(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).send(users)
  } catch (e) {
    res.status(404).send();
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send('User not found!');
    }

    res.status(200).send(user)
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates!'});
  }

  try {
    // refactored since findByIdAndUpdate bypasses middleware
    const user = await User.findById(req.params.id);

    updates.forEach((update) => user[update] = req.body[update]);
    await user.save();

    // const user = await User.findByIdAndUpdate(
    //   req.params.id,
    //   req.body,
    //   {new: true, runValidators: true}
    // );

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

export default router;

