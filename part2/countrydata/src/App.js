import { useState, useEffect } from 'react'
import axios from 'axios'
import FilteredCountries from './components/FilteredCountries'
import Search from './components/Search'
import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [countryToShow, setCountryToShow] = useState(null)

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setCountryToShow(null)
  }

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => setCountries(response.data))
  }, [])

  const ExpandedCountry = (countryToShow) => { //doesnt work properly, will fix later
    if(countryToShow) {
      console.log(countryToShow)
      console.log('1')
      return (<p>cool</p>)
    }
    else {
      console.log(typeof countryToShow.name)
      console.log(countryToShow)
      return <p>testi</p>
    }
  }

  return (
    <div>
      <h1>Country data</h1>
      <Search searchTerm={searchTerm} handleSearchChange={handleSearchChange}/>
      <h3>Countries</h3>
      <FilteredCountries 
        countries={countries} 
        filter={searchTerm} 
        setCountryToShow={setCountryToShow}
      />
      <ExpandedCountry countryToShow={countryToShow}/>
    </div>
  )
}

export default App