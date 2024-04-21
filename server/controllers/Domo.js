const models = require('../models');

const { Domo } = models;

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

const deleteDomo = async (req, res) => {
  try {
    const query = {
      owner: req.session.account._id,
      name: req.body.name,
      age: req.body.age,
      height: req.body.height,
    };
    await Domo.deleteOne(query);
    return res.json({});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error deleting domo!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  deleteDomo,
  getDomos,
};
