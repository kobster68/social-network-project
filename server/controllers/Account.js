const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

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
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const changePassword = async (req, res) => {
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    await Account.changePassword(req.session.account.username, pass);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const togglePrivate = async (req, res) => {
  const username = req.session.account.username;
  const doc = await Account.findOne({ username });
  doc.private = !doc.private;
  await doc.save();
  if(doc.private) {
    return res.status(200).json({ error: 'Private account enabled!' });
  } else {
    return res.status(200).json({ error: 'Private account disabled!' });
  }
};

const getPrivate = async (req, res) => {
  const username = req.session.account.username;
  const doc = await Account.findOne({ username });
  return res.json({ private: doc.private });
};

const togglePremium = async (req, res) => {
  const username = req.session.account.username;
  const doc = await Account.findOne({ username });
  doc.premium = !doc.premium;
  await doc.save();
  if(doc.premium) {
    return res.status(200).json({ error: 'Premium account enabled!' });
  } else {
    return res.status(200).json({ error: 'Premium account disabled!' });
  }
};

const getPremium = async (req, res) => {
  const username = req.session.account.username;
  const doc = await Account.findOne({ username });
  return res.json({ premium: doc.premium });
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  changePassword,
  togglePrivate,
  getPrivate,
  togglePremium,
  getPremium,
};
