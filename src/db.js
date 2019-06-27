const users = [
  {
    id: '1',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com'
  },
  {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com'
  }
];

const posts = [
  {
    id: 'p1',
    title: 'ABC title',
    body: 'XYZ title',
    published: true,
    author: '1'
  },
  {
    id: 'p2',
    title: 'TTT title',
    body: 'BBB body',
    published: false,
    author: '1'
  },
  {
    id: 'p3',
    title: '111 title',
    body: '222 body',
    published: true,
    author: '2'
  }
];

const comments = [
  {
    id: 'c1',
    text: 'Nice info',
    author: '1',
    post: 'p1'
  },
  {
    id: 'c2',
    text: 'Cool bro!',
    author: '1',
    post: 'p2'
  },
  {
    id: 'c3',
    text: 'Thank you. I will check it out.',
    author: '2',
    post: 'p2'
  },
  {
    id: 'c4',
    text: 'I hate you',
    author: '3',
    post: 'p3'
  }
];

const db = {
  users,
  posts,
  comments
};

export default db;
