function createResourceSerializer(fields) {
  return function serializer(resource) {
    const serialized = {};
    fields.forEach(field => {
      serialized[field] = resource[field];
    });
    return serialized;
  };
}

const userFields = ['firstName', 'lastName', 'email', 'password'];
const postFields = ['title', 'body', 'userId'];
const commentFields = ['body', 'userId', 'postId'];

export default {
  commentSerializer: createResourceSerializer(commentFields),
  postSerializer: createResourceSerializer(postFields),
  userSerializer: createResourceSerializer(userFields)
};
