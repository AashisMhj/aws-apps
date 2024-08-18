import { ProductSlugResType, ProductsResType } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = process.env.API_TOKEN;

async function requestAPI(url:string, options:RequestInit,){
    // TODO find better way to pass url or search params using URL or SearchParams class
    let fetchURL = API_URL+'/api/'+url;

    const fetchOptions:RequestInit = {
        cache: 'no-cache',
        method: 'GET',
        headers: {
            "Authorization": `bearer ${TOKEN}`,
            "Content-Type": "application/json"
        },
        ...options
    };

    try {
        const data = await fetch(fetchURL, fetchOptions);
        if(!data.ok) throw `Error with ${data.statusText}`;
        const resJson = await data.json();
        return resJson;
    } catch (error) {
        let error_msg = "Error making Fetch";
        if(typeof error === "string") error_msg = error;
        else if(error instanceof Error) error_msg = error.message
        // TODO throw error
        // throw Error(error_msg)
    }
}


export async function getProducts(){
    const response = await requestAPI('products?populate=*', {},);
    return response as ProductsResType;
}

export async function getProductSlugs(){
    const response = await requestAPI('products', {});
    return response as ProductSlugResType;
}

export async function getProductDetail(slug:string){
    // TODO create custom controller to search by id ?
    // const response = await requestAPI(`products/${slug}`, {});
    const response = (await requestAPI(`products?filters[slug][$eq]=${slug}&populate=*`, {},)) as ProductsResType;
    if(response && response.data.length >= 1) return response;
    return null;
}

export async function createCheckout(id:number, quantity:number){
    const response = await requestAPI(`checkout/${id}`, {
        body: JSON.stringify({quantity})
    });
    return response;

}

export async function updateCheckout(id:number, lineItems:number){
    const response = await requestAPI(`/checkout/${id}`, {
        body: JSON.stringify({lineItems})
    });
    return response;
}