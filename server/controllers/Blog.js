const models = require('../models');

const { Blog } = models;
const BlogModel = require('../models/Blog');

// const { Domo } = models;

const makerPage = (req, res) => res.render('app');

// add more requirements..

/* ******************LAYOUT**************************
blogName
textEditor
blogText (textArea)

make variable for textArea in textEditor
or just leave textArea as it is for now.. maybe add textEditor later
make both areas mandatory

possible image upload necessary, or optional image uploads
possible links to post

--at least get rough draft of this done before focusing on a text editor itself
--with bold, italics, added links for customization, etc

*/
const makeBlog = async (req, res) => {
  if (!req.body.blogName || !req.body.blogText) {
    return res.status(400).json({ error: 'Blog name and blog text are required!' });
  }

  const blogData = {
    blogName: req.body.blogName,
    blogText: req.body.blogText,
    owner: req.session.account._id,
  };

  try {
    const newBlog = new Blog(blogData);
    await newBlog.save();
    return res.status(201).json({ blogName: newBlog.blogName, blogText: newBlog.blogText });
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
