// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json('Hello World')
})

// Підключіть файли роутів
const auth = require('./auth')
const transaction = require('././transaction')
// Підключіть інші файли роутів, якщо є

// Об'єднайте файли роутів за потреби
router.use('/', auth)
router.use('/', transaction)
// Використовуйте інші файли роутів, якщо є

// Експортуємо глобальний роутер
module.exports = router
