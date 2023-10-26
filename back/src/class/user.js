const TRANSACTION_TYPE = {
  SEND: 'send',
  RECEIVE: 'receive',
}

class User {
  static #list = []

  static #count = 1
  #balance = 0
  constructor({ email, password }) {
    this.id = User.#count++
    this.email = String(email).toLowerCase()
    this.password = String(password)
    this.#balance = 0
    this.isConfirm = false
  }

  static create(data) {
    const user = new User(data)

    this.#list.push(user)

    console.log(this.#list)

    return user
  }

  static getByEmail(email) {
    return (
      this.#list.find(
        (user) =>
          user.email === String(email).toLowerCase(),
      ) || null
    )
  }

  static getById(id) {
    return (
      this.#list.find((user) => user.id === Number(id)) ||
      null
    )
  }

  static changeBalance(userid, type, summ) {
    const user = this.getById(userid)
    const summa = Number(summ)
    if (type === TRANSACTION_TYPE.RECEIVE) {
      user.#balance += summa
      return user.#balance
    }
    if (type === TRANSACTION_TYPE.SEND) {
      user.#balance -= summa
      return user.#balance
    } else return 'error'
  }

  static getBalance = (useid) => {
    const user = this.getById(useid)
    return user.#balance
  }
}

module.exports = { User }
