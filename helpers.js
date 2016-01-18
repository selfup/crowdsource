module.exports = {
  urlHash: () => {
    return Math.random().toString(36).substring(7)
  },
  urlGen: (req) => {
    return `${req.protocol}://${req.get('host')}${req.originalUrl}`
  },
  liveUrlGen: (req) => {
    return `${req.protocol}://${req.get('host')}/live_poll`
  },
  feedbackUrlGen: (req) => {
    return `${req.protocol}://${req.get('host')}/live_feedback_vote`
  }
}
