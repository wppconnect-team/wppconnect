
export const getAllContacts = async function () {
  let contacts = await Promise.all(
    window.Store.Contact.map(async (contact) => {
      return await WAPI._serializeContactObj(contact);
    })
  );
  return contacts;
};
