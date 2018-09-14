module.exports = {

  // required by app

  app: {
    port: Number(process.env.PORT),

    // if some route handler is not provided, a simple mock version will be provided automatically
    autoMock: true
  }

  // defined by user
}
