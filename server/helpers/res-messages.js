const resMessages = {
  success: {
    newPostAdded: {
      'ok': true,
      'message': 'New post added'
    },
    postUpdated: {
      'ok': true,
      'message': 'Post updated'
    },
    postDeleted: {
      'ok': true,
      'message': 'Post deleted'
    },
    loggedInAdmin: {
      'ok': true,
      'message': 'Hello, you are logged in'
    },
    sessionActive: {
      'ok': true,
      'message': 'Session active'
    },
    loggedOut: {
      'ok': true,
      'message': 'You are logged out'
    }
  },
  error: {
    serverError: {
      'error': 'server error',
      'message': 'Server error occured'
    },
    unauthorizedAdmin: {
      'error': 'unauthorized',
      'message': 'You are not blog\'s admin, please log in'
    },
    badRequest: {
      'error': 'bad request',
      'message': 'Bad request'
    },
    wrongAdminCredentials: {
      'error': 'unauthorized',
      'message': 'Username or password is incorrect'
    }
  }
};

module.exports = resMessages;