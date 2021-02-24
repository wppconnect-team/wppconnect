
export const _profilePicfunc = async (id) => {
  return await Store.ProfilePic.find(id)
    .then((r) => {
      return WAPI._serializeProfilePicThumb(r);
    })
    .catch(() => {
      return null;
    });
};
