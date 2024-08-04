import mongoose from 'mongoose';
import Product from './models/Product';
import CategorySchema, { Category } from './models/Category';
import  csvToJson from 'convert-csv-to-json';
import ProductSchema from './models/Product';


const uri = 'mongodb://localhost:27017/product-catalog'
const data = csvToJson.fieldDelimiter(',').getJsonFromCsv('./data/data.csv')

const categoriesSet = new Set();
console.log(data[0]);
data.forEach(el => {
    // console.log(el)
    categoriesSet.add(el.Category);
});

async function insertData(){
    try{
        await mongoose.connect(uri)
        const count = await ProductSchema.where({}).countDocuments()
        console.log(count);
        /*
        const insertCategory:{category_name:string}[] = []
        categoriesSet.forEach((cat) =>{
            insertCategory.push({category_name: cat as string});
        });
        const catRes = await CategorySchema.insertMany(insertCategory);
        const catMap:{[key:string]:string} = catRes.reduce((prev, current) =>{
            return {
                ...prev,
                [current.category_name]: current._id
            }
        }, {});
        const insertProduct = data.map((el) =>{
            const catId = catMap[el.Category];
            if(!catId){
                console.log('no value');
                console.log(el)
            }
            const parsePrice = parseInt(el.price);
            const parsedStock = parseInt(el.StockQuantity);
            return {
                product_name: el.ProductName,
                category_id: catId,
                price: isNaN(parsePrice) ? 0 : parsePrice,
                stock_quantity: isNaN(parsedStock) ? 0 : parsedStock,
                description: el.Description
            }
        });
        const proRes = await ProductSchema.insertMany(insertProduct);
        */

    }catch(error){
        console.log(error);
    }finally{
        await mongoose.disconnect();
        console.log('Disconnected')
    }
}

insertData();