import { useState, useEffect } from 'react'
import axios from 'axios'
import FilteredPersons from './components/FilteredPersons'
import Search from './components/Search'
import AddNumber from './components/AddNumber'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const person = {
      name: newName,
      number: newNumber
    }
    if(newName.length===0) window.alert(`Name is empty`)
    else if(persons.map(p => p.name).includes(person.name)) {
      window.alert(`${newName} is already added to phonebook`)
    }
    else {
      setPersons(persons.concat(person))
      setNewName('')
      setNewNumber('')
    }
  }

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => setPersons(response.data))
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Search searchTerm={searchTerm} handleSearchChange={handleSearchChange}/>
      <h3>Add a new number</h3>
      <AddNumber 
        addPerson={addPerson} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
      <FilteredPersons persons={persons} filter={searchTerm}/>
    </div>
  )
}

export default App