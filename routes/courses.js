const {Router} = require('express')
const Course = require('../modules/course')
const router = Router();

router.get('/', async (req, res) => {
  const courses = await Course.getAll();
  res.render('courses', {
    title: 'Курсы',
    isCourses: true,
    courses
  })
})

router.get('/:id', (async (req, res) => {
  const course = await Course.getById(req.params.id)
  res.render('details', {
    layout: 'empty',
    course,
    title: `Курс ${course.title}`,
  })
}))

router.get('/:id/edit', ( async (req, res) => {
  const course = await Course.getById(req.params.id)
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
  await Course.update(req.body);

  res.redirect('/courses')
}))

module.exports = router;
