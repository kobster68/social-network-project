const models = require('../models');

const { Text } = models;

const makerPage = (req, res) => res.render('app');

const makeText = async (req, res) => {
  if (!req.body.content) {
    return res.status(400).json({ error: 'Content is required!' });
  }

  const textData = {
    name: req.session.account.username,
    content: req.body.content,
    owner: req.session.account._id,
  };

  try {
    const newText = new Text(textData);
    await newText.save();
    return res.status(201).json({ name: newText.name, content: newText.content });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Message already exists!' });
    }
    return res.status(500).json({ error: 'An error occured sending message!' });
  }
};

const getTexts = async (req, res) => {
  console.log('message request recieved');
  try {
    const query = { };
    const docs = await Text.find(query).select('name content').lean().exec();

    return res.json({ texts: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving messages!' });
  }
};

const followUser = async (req, res) => {
  try {
    console.log('follow request pending.');
    // need to add empty check for followed users array.
    req.session.account.followedUsers = [req.body.owner];
    return res.status(500).json({ error: 'Debug: followed user' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error following user!' });
  }
};

module.exports = {
  makerPage,
  makeText,
  followUser,
  getTexts,
};
