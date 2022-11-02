import express from 'express';
import Task from '../models/task.js';

const router = new express.Router();

router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
task-manager/src/routers/tasks.js
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});

    if (!tasks.length) {
      return res.status(200).send('No tasks found!')
    }

    return res.status(200).send(tasks);

    console.log(tasks)
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).send('Task not found!')
    }

    return res.status(200).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates!'});
  }

  try {
    const task = await Task.findById(req.params.id);

    updates.forEach((update) => task[update] = req.body[update]);
    await task.save();

    // Refactored since findByIdAndUpdate bypasses middleware
    // const task = await Task.findByIdAndUpdate(
    //   req.params.id,
    //   req.body,
    //   {new: true, runValidators: true}
    // );

    if (!task) {
      return res.status(404).send('task not found!');
    }

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

export default router;