const models = require('../models');

const { Blog } = models;
const BlogModel = require('../models/Blog');

const makerPage = (req, res) => res.render('app');

const makeBlog = async (req, res) => {
  if (!req.body.name || !req.body.text) {
    return res.status(400).json({ error: 'Blog name and blog text are required!' });
  }

  const blogData = {
    name: req.body.name,
    text: req.body.text,
    owner: req.session.account._id,
  };

  try {
    const newBlog = new Blog(blogData);
    await newBlog.save();
    return res.status(201).json({ name: newBlog.name, text: newBlog.text });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Blog name already exists!' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

const getBlogs = (req, res) => BlogModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred!' });
  }

  return res.json({ blogs: docs });
});

module.exports = {
  makerPage,
  makeBlog,
  getBlogs,
};
