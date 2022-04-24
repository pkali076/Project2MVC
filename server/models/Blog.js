const mongoose = require('mongoose');
const _ = require('underscore');

let BlogModel = {};

const setName = (name) => _.escape(name).trim();

const BlogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  text: {
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
  name: doc.name,
  text: doc.text,
});

BlogSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: mongoose.Types.ObjectId(ownerId),
  };

  return BlogModel.find(search).select('name text').lean().exec(callback);
};
BlogModel = mongoose.model('Blog', BlogSchema);

module.exports = BlogModel;
