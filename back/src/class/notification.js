class Notification {
  static #count = 1
  static #list = []

  static NOTIFIC_TYPE = {
    WARNING: 'WARNING',
    INFO: 'INFO',
  }

  constructor(userId, type, text) {
    this.id = Notification.#count++
    this.type = String(type).toUpperCase()
    this.userId = userId
    this.text = String(text)
    this.date = new Date().getTime()
  }

  static create = ({ userId, type, text }) => {
    const notification = new Notification(
      userId,
      type,
      text,
    )
    this.#list.push(notification)

    return notification
  }

  static getList = (userid) => {
    const res = this.#list.filter(
      (notification) => notification.userId === userid,
    )

    return res ? res : null
  }
}

module.exports = { Notification }
