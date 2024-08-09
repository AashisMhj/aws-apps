const API_HOST = import.meta.env.VITE_API_HOST;
const GRAHQL_API = `${API_HOST}/graphql`;

export async function fetchAPI(query:string, variables?: {[key: string]: string}):Promise<unknown>{
    const headers = {
        'Content-Type': 'application/json'
    };

    const res = await fetch(GRAHQL_API, {
        method: 'POST',
        headers,
        body: JSON.stringify({query, variables})
    });

    if(!res.ok) throw new Error(`Failed to fetch API with status: ${res.statusText}`);

    const json = await res.json();

    if(json.errors){
        console.log(json.errors);
        throw new Error('Error returned from the API')
    }
    return json.data;
}