import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  isFavourite: {
    type: Boolean,
    required: false,
    default: false,
  },
  contactType: {
    type: String,
    required: true,
    enum: ['work', 'home', 'personal'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export const Contact = mongoose.model('Contact', contactSchema);
