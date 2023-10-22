class Confirm {
  static #list = []

  constructor(data) {
    this.code = Confirm.generateCode()
    this.data = data
  }

  static generateCode = () =>
    Math.floor(Math.random() * 9000) + 1000

  static create = (data) => {
    this.#list.push(new Confirm(data))

    setTimeout(() => {
      this.delete(code)
    }, 24 * 60 * 60 * 1000)

    console.log(this.#list)
  }

  static delete = (code) => {
    const length = this.#list.length
    this.#list = this.#list.filter(
      (item) => item.code !== code,
    )

    return length > this.#list.length
  }

  static getData = (code) => {
    const res = this.#list.find(
      (item) => item.code === code,
    )
    return res ? res.data : null
  }
}

module.exports = { Confirm }
