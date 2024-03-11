import axios from 'axios'

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all"


const getAll = () =>{
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getTemperatureCapital = (country) =>{
    console.log('lat : ',country.capitalInfo.latlng[0])
    console.log('long : ',country.capitalInfo.latlng[1])
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${country.capitalInfo.latlng[0]}&longitude=${country.capitalInfo.latlng[0]}&current=temperature_2m`
    const request = axios.get(weatherUrl)
    return request.then(response => {
        console.log(response)
        return response.data.current.temperature_2m
    })
}
export default {getAll,getTemperatureCapital}