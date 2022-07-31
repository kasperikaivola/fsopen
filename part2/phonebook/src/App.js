import { useState, useEffect } from 'react'
import FilteredPersons from './components/FilteredPersons'
import Search from './components/Search'
import AddNumber from './components/AddNumber'
import phonebookService from './services/phonebook'

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

  const deleteNumber = (id, name) => {
    if(window.confirm(`Delete contact ${name}?`)) {
      phonebookService
        .deletePerson(id)
        .then(response => {
          setPersons(persons.filter(p => p.id!==id))
      })
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }
    if(newName.length===0) window.alert(`Name is empty`)
    else if(persons.map(p => p.name).includes(newPerson.name)) {
      //window.alert(`${newName} is already added to phonebook`)
      if(window.confirm(
        `Contact ${newPerson.name} already exists in the phonebook, would you like to replace the number with a new one?`)
        ) {
          const toBeUpdated = persons.filter(p => p.name==newPerson.name)
          phonebookService
            .update(toBeUpdated[0].id, newPerson)
            .then(response => {
              setPersons(persons.map(p => (p.name===newPerson.name)? newPerson:p))
            })
      }
    }
    else {
      phonebookService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  useEffect(() => {
    phonebookService
      .getAll()
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
      <FilteredPersons persons={persons} filter={searchTerm} deleteNumber={deleteNumber}/>
    </div>
  )
}

export default App