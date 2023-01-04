const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const list = await listContacts();
  const contact = list.find(({ id }) => id === contactId);

  return contact || null;
};

const removeContact = async (contactId) => {
  const list = await listContacts();
  const contactToDelete = list.find(({ id }) => id === contactId);
  if (!contactToDelete) {
    return null;
  }
  const data = list.filter(({ id }) => id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(data));
  return `contact ${contactToDelete.name} deleted`;
};

const addContact = async (body) => {
  const list = await listContacts();
  const id = nanoid();
  const newContact = { id, ...body };
  const data = JSON.stringify([newContact, ...list]);
  await fs.writeFile(contactsPath, data);
  return newContact;
};

const updateContact = async (contactId, body) => {
  const list = await listContacts();
  const index = list.findIndex(({ id }) => id === contactId);
  if (index === -1) {
    return null;
  }
  list[index] = { id: contactId, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(list));
  return list[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
