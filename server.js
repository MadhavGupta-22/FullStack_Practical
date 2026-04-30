const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Student = require('./models/Student');
const studentsRoute = require('./routes/students');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

mongoose.connect('mongodb://127.0.0.1:27017/student_records')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.get('/', async (req, res) => {
  const students = await Student.find();
  res.render('index', { students });
});

app.post('/students/add', async (req, res) => {
  await Student.create(req.body);
  res.redirect('/');
});

app.post('/students/delete/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.post('/students/update-marks/:id', async (req, res) => {
  await Student.findByIdAndUpdate(req.params.id, { marks: req.body.marks });
  res.redirect('/');
});

app.use('/api/students', studentsRoute);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
