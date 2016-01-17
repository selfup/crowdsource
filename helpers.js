'use strict'

class Helper {
  constructor(req) {
    this.r = req
  }

  get urlHash() {
    return Math.random().toString(36).substring(7)
  }

  get urlGen() {
    return `${this.r.protocol}://${this.r.get('host')}${this.r.originalUrl}`
  }

  get liveUrlGen() {
    return `${this.r.protocol}://${this.r.get('host')}/live_poll`
  }

}

module.exports = Helper
