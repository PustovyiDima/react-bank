// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')
const { Notification } = require('../class/notification')

User.create({
  email: 'admin1@admin.com',
  password: '123Admin',
})
const user = User.getByEmail('admin1@admin.com')
user.isConfirm = true

Notification.create({
  userId: 1,
  type: Notification.NOTIFIC_TYPE.WARNING,
  text: `Вхід в акаунт`,
})
Notification.create({
  userId: 1,
  type: Notification.NOTIFIC_TYPE.INFO,
  text: `Акаунт підтверджено`,
})

// ================================================================

router.post('/signup', function (req, res) {
  let { email, password } = req.body
  // console.debug(req.body)

  if (!email || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message:
          'Помилка. Користувач з таким email вже існує',
      })
    }

    const newUser = User.create({ email, password })

    const session = Session.create(newUser)

    Confirm.create(newUser.email)

    return res.status(200).json({
      message: 'Користувач успішно зареєстровиний',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Помилка створення користувача',
    })
  }
})
// =============================================

router.post('/recovery', function (req, res) {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'Помилка. Користувача з таким email не існує',
      })
    }

    Confirm.create(email)

    return res.status(200).json({
      message: 'Код для відновлення паролю відправлено',
    })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})
// =============================================

router.post('/recovery-confirm', function (req, res) {
  const { code, password } = req.body

  if (!code || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const email = Confirm.getData(Number(code))
    if (!email) {
      return res.status(400).json({
        message: 'Помилка. Код не існує',
      })
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'Помилка. Користувач з таким email не існує',
      })
    }

    user.password = password

    // console.log(user)
    const session = Session.create(user)

    Notification.create({
      userId: user.id,
      type: Notification.NOTIFIC_TYPE.INFO,
      text: `Змінено пароль`,
    })
    return res.status(200).json({
      message: 'Пароль змінено',
      session,
    })

    // ...
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

// =============================================
router.post('/signup-confirm/renew', function (req, res) {
  const { renew, email } = req.body

  if (!renew || !email) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const userData = User.getByEmail(email)

    if (!userData) {
      return res.status(400).json({
        message: 'Помилка. Користувача не існує',
      })
    }
    Confirm.create(email)

    return res.status(200).json({
      message: 'Код повторно відправлено',
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Помилка. Відсутнє зєднання з сервером',
    })
  }
})

router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body

  // console.log(code, token)

  if (!code || !token) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const session = Session.get(token)
    // console.log(session)

    if (!session) {
      return res.status(400).json({
        message: 'Помилка. Ви не увійшли в акаунт',
      })
    }

    const email = Confirm.getData(Number(code))

    // console.log(email)

    if (!email) {
      return res.status(400).json({
        message: 'Помилка. Код не існує',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Помилка. Код не дійсний',
      })
    }

    const user = User.getByEmail(session.user.email)
    user.isConfirm = true

    session.user.isConfirm = true

    Notification.create({
      userId: user.id,
      type: Notification.NOTIFIC_TYPE.INFO,
      text: `Підтверджено акаунт`,
    })

    return res.status(200).json({
      message: 'Ви підтвердили свою пошту',
      session,
    })
    // ...
  } catch (error) {
    return res.status(400).json({ massage: error.message })
  }
})
// =============================================
router.post('/auth-confirm', function (req, res) {
  const { token, email } = req.body
  // console.log(token, email)

  if (!email || !token) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const session = Session.get(token)
    // console.log('serverAuth', session)

    if (!session) {
      return res.status(400).json({
        message: 'Помилка. Токен відсутній в системі',
      })
    }
    // console.log(session.user.email)
    const userData = User.getByEmail(email)

    if (!userData) {
      return res.status(400).json({
        message: 'Помилка. Користувача не існує',
      })
    }

    if (session.user.email !== userData.email) {
      return res.status(400).json({
        message: 'Увага. Несанкціонований вхід',
      })
    }

    return res.status(200).json({
      message: 'Вхід дозволено',
      session,
    })
    // ...
  } catch (error) {
    return res
      .status(400)
      .json({ massage: 'ServerRequestError' })
  }
})

router.post('/signin', function (req, res) {
  let { email, password } = req.body
  // console.debug(req.body)

  if (!email || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'Помилка. Користувач з таким email не існує',
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: 'Помилка. Пароль не підходить',
      })
    }

    const session = Session.create(user)

    Notification.create({
      userId: user.id,
      type: Notification.NOTIFIC_TYPE.WARNING,
      text: `Вхід в акаунт`,
    })

    return res.status(200).json({
      message: 'Вхід успішний',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Помилка  входу',
    })
  }
})

//=====================================================
router.post('/change-password', function (req, res) {
  const { token, email, password, password_new } = req.body
  // console.log(email, password, password_new)
  if (!token || !email || !password || !password_new) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    let user_session = Session.get(token)

    if (!user_session) {
      return res.status(400).json({
        message: 'Відсутня авторизація',
      })
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'Помилка. Користувач з таким email не існує',
      })
    }

    if (user.id !== user_session.user.id) {
      return res.status(400).json({
        message: 'Можливий несанкціонований вхід',
      })
    }

    if (user.password === password) {
      // console.log(true)
      user.password = password_new
    }
    Notification.create({
      userId: user.id,
      type: Notification.NOTIFIC_TYPE.INFO,
      text: `Змінено пароль`,
    })

    // console.log(user)
    const session = Session.create(user)

    return res.status(200).json({
      message: 'Пароль змінено',
      session,
    })

    // ...
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})
//=====================================================
router.post('/change-email', function (req, res) {
  const { token, user_email, email, password } = req.body

  if (!token || !user_email || !email || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    let user_session = Session.get(token)

    if (!user_session) {
      return res.status(400).json({
        message: 'Відсутня авторизація',
      })
    }
    const hasUser = User.getByEmail(email)

    if (hasUser) {
      return res.status(400).json({
        message:
          'Помилка. Користувач з таким email вже існує',
      })
    }

    const user = User.getByEmail(user_email)

    if (!user) {
      return res.status(400).json({
        message:
          'Помилка. Користувач з таким email не існує',
      })
    }

    if (user.id !== user_session.user.id) {
      return res.status(400).json({
        message: 'Можливий несанкціонований вхід',
      })
    }
    // console.log(user.password === password)

    if (password === user.password) {
      user.email = email

      Notification.create({
        userId: user.id,
        type: Notification.NOTIFIC_TYPE.INFO,
        text: `Email змінено`,
      })

      // console.log(user)
      const session = Session.create(user)

      return res.status(200).json({
        message: 'Пароль змінено',
        session,
      })
    }

    return res.status(400).json({
      message: 'Неправильний пароль',
    })

    // ...
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})
//=====================================================
router.post('/get-user-notification', function (req, res) {
  const { userId, token } = req.body

  if (!userId || !token) {
    return res
      .status(400)
      .json({ message: 'Відсутній ID користувача' })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: 'Відсутня авторизація',
      })
    }

    if (userId !== session.user.id) {
      return res.status(400).json({
        message: 'Можливий несанкціонований вхід',
      })
    }
    const user = User.getById(Number(userId))
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Користувача не знайдено' })
    }
    // console.log(userId, token)
    const list = Notification.getList(Number(userId))
    // console.log(list)

    return res.status(200).json({
      list: list,
    })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

// Підключаємо роутер до бек-енду
module.exports = router
