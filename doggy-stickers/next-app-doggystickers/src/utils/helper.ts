import { createCheckout, updateCheckout } from "@/lib/api";
const LOCAL_STORAGE_KEY = 'doggy-the-key';

type LocalDataType = {cart:string, checkoutId:string, checkoutUrl:string}

export function saveLocalData(cart:string, checkoutId:string, checkoutUrl:string){
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([cart, checkoutId, checkoutUrl]) )
}

function getLocalData():LocalDataType[] | null{
    const parsedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || 'null');
    if(Array.isArray(parsedData)) return parsedData as LocalDataType[];
    return null;
}

export function setLocalData(setCart:(cart:string)=>void, setCheckoutId:(checkoutId:string) => void, setCheckoutUrl:(checkoutUrl:string) => void){
    const localData = getLocalData();
    if(localData && localData.length > 1){
        // TODO
    }
}

export async function createShopifyCheckout(id:number, quantity:number){
    const data = await createCheckout(id, quantity);
    return data;
}

export async function updateProductCheckout(){

}