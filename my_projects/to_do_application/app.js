const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

// Models
const TodoTask = require('./models/TodoTask');

dotenv.config();

app.use('/static', express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// GET METHOD
app.get('/', (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render('todo.ejs', { todoTasks: tasks });
  });
});

// POST Method
app.post('/', async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect('/');
  } catch (err) {
    res.redirect('/');
  }
});

// UPDATE Method
// First we find our id and we render the new template.
// Then we update our task using the method findByIdAndUpdate.
app
  .route('/edit/:id')
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render('todoEdit.ejs', { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect('/');
    });
  });

// DELETE Method
// To do that we will use the method findByIdAndRemove.
app.route('/remove/:id').get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect('/');
  });
});

// Connection to DB
mongoose.set('useFindAndModify', false);
// DB_CONNECT credentials from .env file.
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log('Connected to DB!');
  app.listen(PORT, () => console.log('Server Up and Running'));
});
