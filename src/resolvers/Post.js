const Post = {
  author(parent, args, { db }, info) {
    return db.users.find(user => {
      return user.id === parent.author; // The parent is the Post
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter(comment => {
      return comment.post === parent.id;
    });
  }
};

export { Post as default };
