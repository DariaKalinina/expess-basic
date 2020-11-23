const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars')
const handlebars = require('handlebars')
const mongoose = require('mongoose')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const User = require('./modules/user')

const app = express();

// const hbs = exphbs.create({
//   defaultLayout: 'main',
//   extname: 'hbs'
// })
// app.engine('hbs', hbs.engine);

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(handlebars)
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5fba8280572b9b653b8bffdb')
    req.user = user
    next()
  } catch (e) {
    console.log(e)
  }
})

app.use(express.static(path.join(__dirname, 'public' )));
app.use(express.urlencoded({
  extended: true
}))

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const url = 'mongodb+srv://Dasha:Dasha0337@clusternode.7ge9a.mongodb.net/shop';
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: 'test@test.ru',
        name: 'FirstUser',
        items: []
      })
      await user.save();
    }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start();

