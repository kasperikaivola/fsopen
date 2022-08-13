const FilteredPersons = ({persons, filter, deleteNumber}) => {
    const filtered = persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    return filtered.map(p => <p key={p.name}>{p.name} {p.number} {<button onClick={(event) => {
      deleteNumber(p.id, p.name)  //delete
      event.currentTarget.disabled=true //prevent button spamming
    }
    }>Delete</button>}</p>)
  }
  
  export default FilteredPersons