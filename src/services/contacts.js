import { Contact } from '../models/contact.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
}) => {
  const skip = (page - 1) * perPage;
  const totalItems = await Contact.countDocuments();
  const sortCriteria = {};
  sortCriteria[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const contacts = await Contact.find()
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

export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

export const updateContact = async (contactId, updateData) => {
  return await Contact.findByIdAndUpdate(contactId, updateData, {
    new: true,
  });
};

export const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};
