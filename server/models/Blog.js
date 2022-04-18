const mongoose = require('mongoose');
const _ = require('underscore');

let BlogModel = {};

const setName = (name) => _.escape(name).trim();

const BlogSchema = new mongoose.Schema({
  blogName: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  blogText: {
    type: String,
    required: true,
    trim: false,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },

});

BlogSchema.statics.toAPI = (doc) => ({
  blogName: doc.blogName,
  blogText: doc.blogText,
});

BlogSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: mongoose.Types.ObjectId(ownerId),
  };

  return BlogModel.find(search).select('blogName blogText').lean().exec(callback);
};
BlogModel = mongoose.model('Blog', BlogSchema);

module.exports = BlogModel;
