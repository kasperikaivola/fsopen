import Country from './Country'

const FilteredCountries = ({countries,filter, setCountryToShow, handleExpand}) => {
    const filtered = countries.filter(p => p.name.common.toLowerCase().includes(filter.toLowerCase()))
    if(filtered.length<=10 && filtered.length>1) {
      const countriesToShow = 
      filtered.map(p => <Country key={p.name.common} cand={p} visible={false} setCountryToShow={setCountryToShow} handleExpand={handleExpand}/>)
      return countriesToShow
    }
    else if(filtered.length===1) {
      const cand = filtered[0]
      return <Country cand={cand} visible={true}/>
    }
    else if(filtered.length===0) return (<p>No matches, specify another filter</p>)
    else return (<p>Too many matches, specify another filter</p>)
  }
  
  export default FilteredCountries