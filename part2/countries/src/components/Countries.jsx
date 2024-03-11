
import SingleCountry from './SingleCountry'
const Countries = ({countriesToShow,setCountries,setFilter}) => {
    if(countriesToShow.length === 1){
        return(
        <>
            <SingleCountry countryToShow={countriesToShow[0]}/>
        </>
        )
    }
    else{
    return (
    (countriesToShow.length > 10 )? (<div>Too many matches, please specify</div>
    ):
    (countriesToShow.map(country =>(
    <div>{country.name.common}
        <button onClick ={()=>
            {setCountries([country])
            setFilter("")
            }}>show</button>
    </div>)))
    )
    }
}
export default Countries