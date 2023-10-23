class Transaction {
  static #transactionList = []
  static #count = 1
  #id

  constructor({ user, type, target, summ }) {
    this.user = user
    this.type = type
    this.#id = Transaction.count++
    this.date = new Date().getTime()
    this.target = String(target).toLowerCase()
    this.summ = Number(summ)
  }

  static create({ user, type, target, summ }) {
    if (type === 'sender') {
    } else if (type === 'reciver') {
    } else {
    }
    const transaction = new Transaction({
      user,
      type,
      target,
      summ,
    })

    this.#transactionList.push(transaction)

    console.log(this.#transactionList)

    return transaction
  }

  static getTransactionById(id) {
    return (
      this.#transactionList.find(
        (transaction) => transaction.id === Number(id),
      ) || null
    )
  }

  static getList(userId) {}
}

module.exports = { Transaction }
