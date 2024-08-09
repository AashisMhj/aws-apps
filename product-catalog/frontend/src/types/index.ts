export type CategoryType = {
    _id: string,
    category_name: string,
    product_id: string,
    createdAt: string,
    updatedAt: string
}

export type Product = {
    _id: string,
    product_name: string,
    category_id: string,
    price: number,
    stock_quantity: number,
    description?: string,
    createdAt: string,
    updatedAt: string
}

export type PreOrderType = {
    product_name: string,
    preOrderCount: number
}