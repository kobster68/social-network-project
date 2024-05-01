const models = require('../models');

const { Text, Account } = models;

const mainPage = (req, res) => res.render('app');

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

const privateTest = async (docs, followed, username) => {
  // console.log(docs);
  const { name } = docs;

  const _doc = await Account.findOne({ username: name });
  // console.log(_doc.private);
  if (_doc.private && name !== followed && name !== username) {
    return true;
  }
  return false;
};

const getTexts = async (req, res) => {
  console.log('message request recieved');
  try {
    const query = { };
    const docs = await Text.find(query).select('name content').lean().exec();

    const { username } = req.session.account;

    const doc = await Account.findOne({ username });
    const followed = doc.followedUsers;

    for (let i = 0; i < docs.length; i++) {
      if (await privateTest(docs[i], followed, username)) {
        docs[i].content = 'This user is private.';
      }
    }

    return res.json({ texts: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving messages!' });
  }
};

const followUser = async (req, res) => {
  try {
    console.log('follow request pending.');
    const { username } = req.session.account;
    const doc = await Account.findOne({ username });
    doc.followedUsers = req.body.owner;
    await doc.save();
    return res.status(200).json({ error: `Followed ${req.body.owner}` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error following user!' });
  }
};

module.exports = {
  mainPage,
  makeText,
  followUser,
  getTexts,
};
