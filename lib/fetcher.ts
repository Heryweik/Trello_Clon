
// Sirve para hacer fetch a una url y devolver el json de la respuesta
export const fetcher = (url:string) => fetch(url).then((res) => res.json());