import { useState, useEffect } from 'react'
import axios from 'axios'
import FilteredCountries from './components/FilteredCountries'
import Search from './components/Search'
import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [countryToShow, setCountryToShow] = useState('')
  const [isLoading, setLoading] = useState(true)
  const [capitalWeather, setCapitalWeather] = useState([])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setCountryToShow('')
  }

  const handleExpand = (cand) => {
    setLoading(true)
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${cand.capital}&units=metric&appid=${process.env.REACT_APP_API_KEY}`)
      .then(response => {
        setCapitalWeather(response.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=Helsinki&units=metric&appid=${process.env.REACT_APP_API_KEY}`)
      .then(response => {
        setCapitalWeather(response.data)
        setLoading(false)
      })
  }, [])

  const ExpandedCountry = (countryToShow, capitalWeather) => {
    const cool1 = JSON.stringify(countryToShow)
    const cool2 = JSON.parse(cool1)
    const cool3 = cool2.countryToShow
    if(cool3.length>0) {
      const country = countries.filter(c => c.name.common===cool3)
      return (
        <div>
          <Country cand={country[0]} visible={true}/>
          <p>Temperature: {countryToShow.capitalWeather.main.temp}</p>
          <img src={`https://openweathermap.org/img/wn/${countryToShow.capitalWeather.weather[0].icon}@2x.png`} alt='Weather icon'/>
          <p>Wind: {countryToShow.capitalWeather.wind.speed}</p>
        </div>
      )
    }
    else {
      return null
    }
  }

  if(!isLoading) {return (
    <div>
      <h1>Country data</h1>
      <Search searchTerm={searchTerm} handleSearchChange={handleSearchChange}/>
      <h3>Countries</h3>
      <FilteredCountries 
        countries={countries} 
        filter={searchTerm} 
        setCountryToShow={setCountryToShow}
        handleExpand={handleExpand}
      />
      <ExpandedCountry countryToShow={countryToShow} capitalWeather={capitalWeather}/>
    </div>
  )
  }
  else return (<h1>Loading...</h1>)
}

export default App