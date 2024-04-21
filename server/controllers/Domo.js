const models = require('../models');

const { Domo, Account } = models;

const makerPage = (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.content) {
    return res.status(400).json({ error: 'Content is required!' });
  }

  const domoData = {
    name: req.session.account.username,
    content: req.body.content,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, content: newDomo.content});
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

const getDomos = async (req, res) => {
  try {
    const query = { };
    const docs = await Domo.find(query).select('name content').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

const followUser = async (req, res) => {
  try {
    console.log("follow request pending.");
    // need to add empty check for followed users array.
    req.session.account.followedUsers = [ req.body.owner ];
    return res.status(500).json({ error: 'Debug: followed user' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error following user!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  followUser,
  getDomos,
};
