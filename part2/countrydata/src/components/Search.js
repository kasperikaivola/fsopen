const Search = ({searchTerm, handleSearchChange}) => {
    return (<div>Filter countries: <input value={searchTerm} onChange={handleSearchChange}/></div>)
  }

  export default Search