const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};
// targets page for login.handlebars ???

const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }
  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }
    req.session.account = Account.toAPI(account);
    return res.json({ redirect: '/maker' });
  });
};

/*
make functon for passwordChange here to check about field requirements
process is between signup and login */
const passwordPage = (req, res) => {
  res.render('passChange', { csrfToken: req.csrfToken() });
};

const passChange = async (req, res) => {
// enter old password.

  // if password matches current account password
  // replace old password with new password
  // redirect back to /maker

  const oldpass = `${req.body.oldPass}`;
  const newPass2 = `${req.body.newPass2}`;
  if (oldpass === Account.password) {
    const hash = await Account.generateHash(newPass2);
    Account.password = hash;
    await Account.save();
    return res.json({ redirect: '/maker' });
  }
  if (oldpass !== Account.password) {
    return res.status(400).json({ error: 'Current password entered does not match our records' });
  }
  return res.status(400).json({ error: 'An error occurred' });
};

// may as well try

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }
  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use.' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  }
};

module.exports = {
  loginPage,
  passChange,
  passwordPage,
  login,
  logout,
  signup,
  getToken,
};
