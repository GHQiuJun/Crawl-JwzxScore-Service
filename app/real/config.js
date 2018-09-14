module.exports = {

  // required by app

  app: {
    port: Number(process.env.PORT)
  },
  // defined by user
  appId: Number(process.env.APP_ID),
  appKey: process.env.APP_KEY
}
