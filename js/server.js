import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/UserRegistration', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
});

const Signup = mongoose.model('userdata', userSchema);

app.get('/', (req, res) => {
  res.send('Server started!k!');
});

app.post('/signup', (req, res) => {
  console.log(req.body);

  Signup.findOne({ username: req.body.username })
    .then((existingUser) => {
      if (existingUser) {
        res.send('User account already exists');
      } else {
        const newUser = new Signup({
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
        });

        newUser
          .save()
          .then(() => {
            res.send('Account created successfully!!!');
          })
          .catch((err) => {
            console.error('Error saving user:', err);
            res.status(500).send('Error occurred while creating the account');
          });
      }
    })
    .catch((err) => {
      console.error('Error finding user:', err);
      res.status(500).send('Error occurred while checking user existence');
    });
});

app.listen(9000, () => {
  console.log('Server started at port no 9000');
});