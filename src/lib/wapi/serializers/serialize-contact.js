
export const _serializeContactObj = async (obj) => {
  if (obj == undefined) {
    return null;
  }

  let profile = await WAPI._profilePicfunc(obj.id._serialized);

  if (
    !obj.profilePicThumb &&
    obj.id &&
    window.Store.ProfilePicThumb &&
    profile === null
  ) {
    let PicThumb = window.Store.ProfilePicThumb.get(obj.id);
    profile = PicThumb ? WAPI._serializeProfilePicThumb(PicThumb) : {};
  }

  return Object.assign(window.WAPI._serializeRawObj(obj), {
    formattedName: obj.formattedName,
    isHighLevelVerified: obj.isHighLevelVerified,
    isMe: obj.isMe,
    isMyContact: obj.isMyContact,
    isPSA: obj.isPSA,
    isUser: obj.isUser,
    isVerified: obj.isVerified,
    isWAContact: obj.isWAContact,
    profilePicThumbObj: profile,
    statusMute: obj.statusMute,
    msgs: null,
  });
};
