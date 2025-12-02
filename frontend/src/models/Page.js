const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String, // URL de la imagen
    default: null
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const pageSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  heroImage: {
    type: String, // URL de la imagen principal
    default: null
  },
  sections: [sectionSchema],
  metaDescription: {
    type: String,
    default: ''
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para búsquedas rápidas
pageSchema.index({ slug: 1 });
pageSchema.index({ isPublished: 1 });

module.exports = mongoose.models.Page || mongoose.model('Page', pageSchema);
