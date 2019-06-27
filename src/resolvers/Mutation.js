import uuidv4 from 'uuid';

// Enums

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some(user => user.email === args.data.email);

    if (emailTaken) {
      throw new Error('Email taken.');
    }

    const user = {
      id: uuidv4(),
      ...args.data
    };

    db.users.push(user);

    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex(user => user.id === args.id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const deletedUsers = db.users.splice(userIndex, 1);

    // Delete posts and comments from deleted user
    db.posts = db.posts.filter(post => {
      const match = post.author === args.id;
      if (match) {
        db.comments = db.comments.filter(comment => comment.post !== post.id);
      }
      return !match;
    });

    db.comments = db.comments.filter(comment => comment.author !== args.id);

    return deletedUsers[0]; // Return the first and only item from the array
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find(user => user.id === id);

    if (!user) {
      throw new Error('User not found');
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email);

      if (emailTaken) {
        throw new Error('Email taken');
      }

      user.email = data.email;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age;
    }

    return user;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);

    if (!userExists) {
      throw new Error('User not found');
    }

    const post = {
      id: uuidv4(),
      ...args.data
    };

    db.posts.push(post);

    if (args.data.published) {
      pubsub.publish(`post`, {
        // It needs both values, mutation and data. Check PostSubscriptionPayload in schema
        post: {
          mutation: 'CREATED',
          data: post
        }
      });
    }

    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex(post => post.id === args.id);

    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    const [deletedPost] = db.posts.splice(postIndex, 1);

    // Delete comments from deleted posts
    db.comments = db.comments.filter(comment => comment.post !== args.id);

    if (deletedPost.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: deletedPost
        }
      });
    }

    return deletedPost; // Return the first and only item from the array
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const post = db.posts.find(post => post.id === id);
    const originalPost = { ...post };

    if (!post) {
      throw new Error('Post not found');
    }

    if (typeof data.title === 'string') {
      post.title = data.title;
    }

    if (typeof data.body === 'string') {
      post.body = data.body;
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        // Post is beind DELETED. Unpushished from published
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        });
      } else if (!originalPost.published && post.published) {
        // Post is being CREATED. Published from unpublished
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        });
      }
    } else if (post.published) {
      // Post is being UPDATED.
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      });
    }

    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    const postExists = db.posts.some(
      post => post.id === args.data.post && post.published
    );

    if (!userExists || !postExists) {
      throw new Error('Unable to find user and post');
    }

    const comment = {
      id: uuidv4(),
      ...args.data
    };

    db.comments.push(comment);

    // 2. Update publish call in createComment to send back CREATED with the data
    // channel name
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    });

    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      comment => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1);

    // 3. Add publish call in deleteComment using DELETED event
    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment
      }
    });

    return deletedComment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;

    const comment = db.comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (typeof data.text === 'string') {
      comment.text = data.text;
    }

    // 4. Add publish call in updateComment using UPDATED event
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    });

    return comment;
  }
};

export { Mutation as default };
