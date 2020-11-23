const {Router} = require('express')
const Course = require('../modules/course')
const router = Router();

const mapCart = (courses) => {
  return courses.map((item) => {
    return {...item.courseId._doc, count: item.count, id: item.courseId.id}
  })
}

const getPrice = (courses) => courses.reduce((total, {count, price}) => {
  return total += price * count
}, 0)

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id)
  await req.user.addToCart(course);

  res.redirect('/cart')
})

router.get('/', async (req, res) => {
  const user = await req.user.populate('cart.items.courseId').execPopulate();

  const courses = mapCart(user.cart.items)
  const price = getPrice(courses)

  res.render('cart', {
    title: 'Корзина',
    isCart: true,
    courses,
    price,
  })
})

router.delete('/remove/:id', async (req, res) => {
  await req.user.removeFromCart(req.params.id);

  const user = await req.user.populate('cart.items.courseId').execPopulate()
  const courses = mapCart(user.cart.items)
  const price = getPrice(courses)
  const cart = {
    courses, price
  }
  res.status(200).json(cart);
})

module.exports = router;
