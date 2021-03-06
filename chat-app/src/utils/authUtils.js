exports.getCookie = (vue) => {
  if (vue.$cookies.isKey('token')) {
    return vue.$cookies.get('token').token;
  } else {
    return null
  }
};

exports.isAuthenticated = (vue, userId) => {
  if (vue.$cookies.isKey('token')) {
    return userId === vue.$cookies.get('token').userId;
  } else {
    return false;
  }
};

exports.getAuthedUserId = (vue) => {
  if (vue.$cookies.isKey('token')) {
    return vue.$cookies.get('token').userId;
  } else {
    return -1;
  }
};

exports.setCookie = (vue, userId, token) => {
  if (vue.$cookies.isKey('token')) {
    vue.$cookies.remove('token');
  }

  return vue.$cookies.set('token', {
    token: token,
    userId: userId
  })
};
