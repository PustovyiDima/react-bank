class Transactions {
  static #list = []

  static #count = 1

  TRANSACTION_TYPE = {
    SEND: 'send',
    RECEIVE: 'receive',
  }

  constructor(userid, type, target, summ) {
    this.date = new Date().getTime()
    this.id = Transactions.#count++
    this.userid = userid
    this.type = String(type).toLowerCase()

    this.target = String(target).toLowerCase()
    this.summ = Number(summ)
  }

  static create = (userid, type, target, summ) => {
    const transaction = new Transactions(
      userid,
      type,
      target,
      summ,
    )
    this.#list.push(transaction)

    return transaction
  }

  static getById(id) {
    return (
      this.#list.find(
        (transaction) => transaction.id === Number(id),
      ) || null
    )
  }

  static check = (transactionsId, userid) => {
    const transaction = this.getById(transactionsId)
    if (transaction && transaction.userid === userid) {
      return true
    }
    return false
  }

  static getList = (userid) => {
    const res = this.#list.filter(
      (transaction) => transaction.userid === userid,
    )
    return res ? res : null
  }
}

module.exports = { Transactions }
