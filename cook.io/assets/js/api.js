


window.ACCESS_POINT = 'https://api.edamam.com/api/recipes/v2';

const APP_ID = '6cf19433';  //string
const API_KEY = 'bdc330a3bc29c0ce30f6b78f290ad415';  //string
const TYPE = 'public'; //string

// @param {Array} queries Query array
// @param {function} successCallback successCallback function

export const fetchData = async function(queries, successCallback){
    //string
    const query = queries?.join('&')
        .replace(/,/g, '=')
        .replace(/ /g, '%20')
        .replace(/\+/g, '%2B');
    const url = `${ACCESS_POINT}?app_id=${APP_ID}&app_key=${API_KEY}&type=${TYPE}${query ? `&${query}` : ""}`;
    console.log(url);

    // response->object

    const response = await fetch(url);
    if(response.ok){
        const data=await response.json();
        
        successCallback(data);
    }
    

}