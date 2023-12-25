const {base_url} = require('./base_url')
export const getAPI = async(url)=>{
    const res = await fetch(`${base_url}${url}`)
    .then((response)=>response.json())
    .then((responseJson)=>{
        return responseJson;
    })
    .catch((err)=>{
        console.log(err)
    })
    return res;
}

export const postDataAPI = async(url,data)=>{
    const res = await fetch(`${base_url}${url}`,
    {
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type' :'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((response)=>response.json())
    .then((responseJson)=>{

        return responseJson;
    }
    )
    .catch((err)=>{
      console.log(err)
    })
    return res;
}

export const postDataAPIImg = async(url,data)=>{
    const res = await fetch(`${base_url}${url}`,
    {
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type' :'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((response)=>response.json())
    .then((responseJson)=>{

        return responseJson;
    }
    )
    .catch((err)=>{
      console.log(err)
    })
    return res;
}