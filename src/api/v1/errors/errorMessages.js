function notFoundMessage(resource) {
  return `${resource} not found.`;
}

function authenticationErrorMessage() {
  return 'Email or password is incorrect.';
}

function authorizationErrorMessage() {
  return 'Unauthorized! You\'re allowed to access this resource!';
}

export default {
  notFoundMessage,
  authenticationErrorMessage,
  authorizationErrorMessage
};
