import { useEffect, useState } from 'react'
import countryService from "./services/countryService"
import Countries from './components/Countries'

function App() {
  const [allCountries, setAllCountries] = useState([])
  const [countries, setCountries] = useState([])
  const [filter,setFilter] = useState("")

  useEffect(()=>{
    countryService.getAll()
    .then(countries => {setAllCountries(countries)})
  },[])

 
  
 
  return (
    <>
    <div>find countries</div>
    <input value = {filter} onChange={e => {
      setFilter(e.target.value)
      setCountries(allCountries
        .filter(country =>{
        return country.name.common.toLowerCase().includes(filter.toLowerCase())
        }))
      }} />
      <Countries countriesToShow={countries} setCountries={setCountries} setFilter={setFilter}/>
    </>
  )
}

export default App
