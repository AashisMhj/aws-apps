import { ImageType } from "./types";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export function imageResolver(image:ImageType){
    if(image.attributes.provider === 'local') return `${NEXT_PUBLIC_API_URL}${image.attributes.url}`;
    else return image.attributes.url
}