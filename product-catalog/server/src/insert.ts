import  csvToJson from 'convert-csv-to-json';
import ProductSchema from './models/Product';
import CategorySchema from './models/Category';
import path from 'path';

const data = csvToJson.fieldDelimiter(',').getJsonFromCsv(path.resolve(__dirname, '../data/data.csv'))

const categoriesSet = new Set();
data.forEach(el => {
    categoriesSet.add(el.Category);
});

export async function insertData(){
    try{
        const count = await ProductSchema.where({}).countDocuments()
        
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
        

    }catch(error){
        console.log(error);
    }finally{
        console.log('Inserted Final Block')
    }
}
