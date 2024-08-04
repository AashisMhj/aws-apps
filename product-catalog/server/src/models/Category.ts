import { model, Schema } from "mongoose";

export const Category = new Schema({
    category_name: {
        type: String,
        required: true
    }
});

const CategorySchema = model('category', Category);
export default CategorySchema;