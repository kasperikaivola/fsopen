const FilteredPersons = ({persons,filter}) => {
    const filtered = persons.filter(p => p.name.common.toLowerCase().includes(filter.toLowerCase()))
    if(filtered.length<=10 && filtered.length>1) return filtered.map(p => <p key={p.name.common}>{p.name.common} {p.number}</p>)
    else if(filtered.length===1) {
      const cand = filtered[0]
      return (
        <div>
          <h1>{cand.name.common}</h1>
          <p>Capital {cand.capital}</p>
          <p>Area {cand.area}</p>
          <h4><b>Languages:</b></h4>
          {/*console.log(Object.values(cand.languages))*/}
          <ul>
            {Object.values(cand.languages).map(lang => <li key={lang}>{lang}</li>)}
          </ul>
          <img src={cand.flags.png} height="200" alt="Flag here"/>
        </div>
      )
    }
    else if(filtered.length===0) return (<p>No matches, specify another filter</p>)
    else return (<p>Too many matches, specify another filter</p>)
  }
  
  export default FilteredPersons