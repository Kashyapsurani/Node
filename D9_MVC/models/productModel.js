let products = [
  { id: 1, name: "Laptop", price: 999 },
  { id: 2, name: "Phone", price: 499 },
  { id: 3, name: "Tablet", price: 299 },
];

module.exports = {
  getAll: () => products,
  getById: (id) => products.find((product) => product.id === parseInt(id)),
};
