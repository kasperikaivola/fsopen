const FilteredPersons = ({persons, filter, deleteNumber}) => {
    const filtered = Object.values(persons).filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    return filtered.map(p => <p key={p.name}>{p.name} {p.number} {<button onClick={() => deleteNumber(p.id, p.name)}>Delete</button>}</p>)
  }
  
  export default FilteredPersons