import { Contact } from '../models/contact.js';

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

export const createContact = async (contactData, userId) => {
  return await Contact.create({ ...contactData, userId });
};

export const updateContact = async (contactId, updateData, userId) => {
  return await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true },
  );
};

export const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
