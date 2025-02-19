let users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alice Johnson" },
];

module.exports = {
  getAll: () => users,
  getById: (id) => users.find((user) => user.id === parseInt(id)),
};
