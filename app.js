const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const handlerRoutes = require('./routes/handlerRoutes');
const minirequestRoutes = require('./routes/minirequestRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const dotenv = require('dotenv/config');
const cors = require('cors');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = process.env.dbURI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(process.env.PORT || 3000))
  .catch((err) => console.log(err));



// general routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));

//fragmented routes

app.use(authRoutes);

app.use(handlerRoutes);

//mini request routes

app.use(minirequestRoutes);

