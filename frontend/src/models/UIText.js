const mongoose = require('mongoose');

const uiTextSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: '' // Descripción de para qué se usa este texto
  },
  category: {
    type: String,
    enum: ['button', 'label', 'message', 'title', 'other'],
    default: 'other'
  }
}, {
  timestamps: true
});

// Índice para búsquedas rápidas por clave
uiTextSchema.index({ key: 1 });
uiTextSchema.index({ category: 1 });

module.exports = mongoose.models.UIText || mongoose.model('UIText', uiTextSchema);
