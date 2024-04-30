const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.post('/follow', mid.requiresLogin, controllers.Text.followUser);

  app.get('/getTexts', mid.requiresLogin, controllers.Text.getTexts);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Text.mainPage);
  app.post('/maker', mid.requiresLogin, controllers.Text.makeText);

  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
