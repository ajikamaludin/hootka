import moment from "moment";

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const formatDate = (stringDate) => {
  return moment(stringDate).format('DD-MM-yyyy')
}

export const hasPermission = (permission, user) => {
  if (user.role === null) {
    return true;
  }

  const allowed = user.role.permissions.find(i => i.name === permission)
  if(allowed) {
    return true
  }
  return false
}