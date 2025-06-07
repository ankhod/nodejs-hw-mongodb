import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

export const getAllContactsController = async (req, res) => {
  const { page, perPage, sortBy, sortOrder, type, isFavourite } = req.query;
  const userId = req.user._id; // Отримуємо userId із req.user

  const contactsData = await getAllContacts({
    page: page ? parseInt(page) : 1,
    perPage: perPage ? parseInt(perPage) : 10,
    sortBy: sortBy || 'name',
    sortOrder: sortOrder === 'desc' ? 'desc' : 'asc',
    type,
    isFavourite,
    userId,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contactsData,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = [
  upload.single('photo'),
  async (req, res, next) => {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const userId = req.user._id;
    const file = req.file;

    const newContact = await createContact(
      {
        name,
        phoneNumber,
        email,
        isFavourite: isFavourite || false,
        contactType,
      },
      userId,
      file,
    );

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  },
];

export const updateContactController = [
  upload.single('photo'),
  async (req, res, next) => {
    const { contactId } = req.params;
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const userId = req.user._id;
    const file = req.file;

    const updatedContact = await updateContact(
      contactId,
      {
        name,
        phoneNumber,
        email,
        isFavourite,
        contactType,
      },
      userId,
      file,
    );

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  },
];

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const deletedContact = await deleteContact(contactId, userId);

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
