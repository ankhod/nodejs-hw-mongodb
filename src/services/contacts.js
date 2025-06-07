import { Contact } from '../models/contact.js';
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
  userId,
}) => {
  const skip = (page - 1) * perPage;
  const filter = { userId }; // Фільтруємо за userId

  if (type) {
    filter.contactType = type;
  }
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }

  const totalItems = await Contact.countDocuments(filter);
  const sortCriteria = {};
  sortCriteria[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const contacts = await Contact.find(filter)
    .sort(sortCriteria)
    .skip(skip)
    .limit(perPage);

  return {
    data: contacts,
    totalItems,
    page: Number(page),
    perPage: Number(perPage),
    totalPages: Math.ceil(totalItems / perPage),
    hasPreviousPage: page > 1,
    hasNextPage: page < Math.ceil(totalItems / perPage),
  };
};

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (contactData, userId, file) => {
  let photoUrl = null;
  if (file) {
    const result = await cloudinary.v2.uploader.upload(file.path);
    photoUrl = result.secure_url;
  }
  return await Contact.create({ ...contactData, userId, photo: photoUrl });
};

export const updateContact = async (contactId, updateData, userId, file) => {
  let photoUrl = null;
  if (file) {
    const result = await cloudinary.v2.uploader.upload(file.path);
    photoUrl = result.secure_url;
  }
  return await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    { ...updateData, photo: photoUrl },
    { new: true },
  );
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  if (contact && contact.photo) {
    const publicId = contact.photo.split('/').pop().split('.')[0];
    await cloudinary.v2.uploader.destroy(publicId);
  }
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
