import { useState, useEffect } from 'react'
import axios from 'axios'
import FilteredPersons from './components/FilteredPersons'
import Search from './components/Search'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => setCountries(response.data))
  }, [])

  return (
    <div>
      <h1>Hello world</h1>
      <Search searchTerm={searchTerm} handleSearchChange={handleSearchChange}/>
      <h3>Countries</h3>
      <FilteredPersons persons={countries} filter={searchTerm}/>
    </div>
  )
}

export default App