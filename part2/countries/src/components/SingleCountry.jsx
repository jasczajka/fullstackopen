import { useState , useEffect} from 'react'
import countryService from "../services/countryService"
const SingleCountry = ({countryToShow}) => {


    const [temperature,setTemperature] = useState("")
    useEffect(()=>{
        countryService.getTemperatureCapital(countryToShow)
        .then(temperatureReceived => {
            console.log(temperatureReceived)
            setTemperature(temperatureReceived)})
    },[])



    return(
    <>
        <h1>{countryToShow.name.common}</h1>
        <div>capital {countryToShow.capital}</div>
        <div>area {countryToShow.area}</div>
        <h2>languages:</h2>
        <ul>
            {
                Object.keys(countryToShow.languages).map(key => (<li>{countryToShow.languages[key]}</li>))
            //countryToShow.languages.map(language=><li>language</li>)
            }
        </ul>
        <img src={countryToShow.flags.png} />
        <div>temperature {temperature} Celsius </div>
    </>
    )


}
export default SingleCountry