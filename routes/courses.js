const {Router} = require('express')
const Course = require('../modules/course')
const router = Router();

router.get('/', async (req, res) => {
  const courses = await Course.find();

  res.render('courses', {
    title: 'Курсы',
    isCourses: true,
    courses
  })
})

router.get('/:id', (async (req, res) => {
  const course = await Course.findById(req.params.id)
  res.render('details', {
    layout: 'empty',
    course,
    title: `Курс ${course.title}`,
  })
}))

router.get('/:id/edit', ( async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!req.query.allow) {
    return res.redirect('/');
  } else {
    res.render('edit', {
      course,
      title: `Редактировать курс ${course.title}`,
    })
  }
}))

router.post('/edit', (async (req, res) => {
  try {
    const { id, ...body } = req.body;
    await Course.findByIdAndUpdate(id, body);

    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
}))

router.post('/remove', (async (req, res) => {
  try {
    const { id } = req.body;
    await Course.deleteOne({_id: id});

    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
}))

module.exports = router;
