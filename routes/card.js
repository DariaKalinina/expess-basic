const {Router} = require('express')
const Card = require('../modules/card')
const Course = require('../modules/course')
const router = Router();

router.get('/', async (req, res) => {
  const card = await Card.fetch()
  res.render('card', {
    title: 'Корзина',
    isCard: true,
    courses: card.courses,
    price: card.price,
  })
})

router.post('/add', async (req, res) => {
  const course = await Course.getById(req.body.id)
  await Card.add(course);

  res.redirect('/card')
})

module.exports = router;
