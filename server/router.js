const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getBlogs', mid.requiresLogin, controllers.Blog.getBlogs);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  // app post & get for passChange...???
  /*
  app.get('/passChange', mid.requiresSecure, mid.requiresLogin, controllers.Account.passChange);
  app.post('/passChange', mid.requiresSecure, mid.requiresLogin, controllers.Account.passChange);

  make new passwordChange page?

  */

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Blog.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Blog.makeBlog);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
