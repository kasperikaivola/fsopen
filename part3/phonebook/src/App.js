import { useState, useEffect } from 'react'
import FilteredPersons from './components/FilteredPersons'
import Search from './components/Search'
import AddNumber from './components/AddNumber'
import phonebookService from './services/phonebook'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState({messageType: '', messageText: null})

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
          setMessage({...message, messageType: 'success', messageText: `Deleted ${name}`})
          setTimeout(() => {
            setMessage({...message, messageType: 'error', messageText: null})
          }, 5000)
      })
      .catch(error => {
        setMessage({...message, messageType: 'error', messageText: `Contact with name ${name} has already been removed`})
        setTimeout(() => {
          setMessage({...message, messageType: 'error', messageText: null})
        }, 5000)
      })
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    //event.currentTarget.disabled=true
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
          const toBeUpdated = persons.find(p => p.name===newPerson.name)
          //console.log(toBeUpdated.id)
          newPerson.id=toBeUpdated.id
          phonebookService
            .update(toBeUpdated.id, newPerson)
            .then(response => {
              setPersons(persons.map(p => (p.name===newPerson.name)? response:p))
              setMessage({...message, messageType: 'success', messageText: `Updated ${newPerson.name}'s number`})
              setTimeout(() => {
                setMessage({...message, messageType: 'error', messageText: null})
              }, 5000)
              setNewName('')
              setNewNumber('')
            })
            .catch(error => {
              setMessage({...message, messageType: 'error', messageText: `Error: ${error.response.data.error}`})
              setTimeout(() => {
                setMessage({...message, messageType: 'error', messageText: null})
              }, 5000)
            })
      }
    }
    else {
      phonebookService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setMessage({...message, messageType: 'success', messageText: `Added ${returnedPerson.name}`})
          setTimeout(() => {
            setMessage({...message, messageType: 'error', messageText: null})
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setMessage({...message, messageType: 'error', messageText: `Error: ${error.response.data.error}`})
          setTimeout(() => {
            setMessage({...message, messageType: 'error', messageText: null})
          }, 5000)
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
      <Notification type={message.messageType} message={message.messageText}/>
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
      <p><a href="https://github.com/kasperikaivola/fsopen-part3/blob/master/README.md"
            target="_blank"
            rel="noopener noreferrer">Source code (GitHub)</a></p>
    </div>
  )
}

export default App