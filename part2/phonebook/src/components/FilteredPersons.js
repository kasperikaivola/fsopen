const FilteredPersons = ({persons,filter}) => {
    const filtered = persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    return filtered.map(p => <p key={p.name}>{p.name} {p.number}</p>)
  }
  
  export default FilteredPersons