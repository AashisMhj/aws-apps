import {query} from 'gql-query-builder';

export const getProductsQuery = query({
    operation: 'products',
    fields: ['_id', 'product_name', 'category_id', 'price', 'stock_quantity', 'description', 'createdAt', 'updatedAt'],
    variables: {count: 500}
});

export const getProductQuery = (id:string) => query({
    operation: 'product',
    fields: ['_id', 'product_name', 'category_id', 'price', 'stock_quantity', 'description', 'createdAt', 'updatedAt'],
    variables: {id: id}
})

export const getCategoriesQuery = query({
    operation: 'categories', 
    fields: ['_id', 'category_name', 'createdAt', 'updatedAt'],
    variables: {count: 500}
});

export const getCategoryQuery = (id:string) => query({
    operation: 'categories', 
    fields: ['_id', 'category_name', 'createdAt', 'updatedAt'],
    variables: {id}
});

export const getAggregation = query({
    operation: 'aggregation',
    fields: ['_id', 'category_name', 'productCount']
});

export const getAllProductsPreOrder = query({
    operation: 'countPreOrder',
    fields: ['product_name', 'preOrderCount']
});

export const getProductPreOrder =(id:string) => query({
    operation: 'countProductPreOrder',
    fields: ['product_name', 'preOrderCount'],
    variables: {id}
});

