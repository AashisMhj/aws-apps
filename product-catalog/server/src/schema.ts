const schema = `
type Query {
    product(id: String!): Product!
    products(count: Int): [Product]!
    category(id: String!): Category!
    categories(count: Int): [Category]!
    aggregation: [AggregationType]!
    countPreOrder: [PreOrderCount]!
    countProductPreOrder(id: String!): PreOrderCount!
}
type Mutation {
    createProduct(product_name: String!, category_id: Int!, price: Int!, stock_quantity:Int!, description: String): Product!
}
type PreOrderCount{
    product_name: String!
    preOrderCount: Int
}
type Product {
    _id: ID!
    product_name: String!
    category_id: ID!
    price: Int!
    stock_quantity: Int!
    description: String
    createdAt: String
    updatedAt: String
}
type Category {
    _id: ID!
    category_name: String!
    createdAt: String
    updatedAt: String
}
type AggregationType {
    _id: ID!
    category_name: String!
    productCount: Int!
}
type CreateProductInput {
    product_title: String!
}
`;

export default schema;