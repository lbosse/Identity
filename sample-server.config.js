module.exports = {
  express: {
    /* Server host port */
    port: 8443
  },
  mongo: {
    /* MongoDB connect URI */
    uri: 'mongodb://localhost/id',
    useMongoClient: true,
    secret: 'blahblah1234@#$',
  },
  /* Values used by test suite */
  test: {
    host: 'https://localhost:8443',
    loginName: 'user',
    modifiedLoginName: 'testUser',
    name: 'test user',
    /* A valid password must contain one upper, lowercase, and special character, 
     * one number, and be longer than 8 characters. */
    password: 'Testing1234!',
    wrongPassword: 'Testing1234?',
    invalidPassword: 'asdf',
    invalidOption: '--asdf'
  }
}
