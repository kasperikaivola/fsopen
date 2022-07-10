const Search = ({searchTerm, handleSearchChange}) => {
    return (<div>Filter contacts: <input value={searchTerm} onChange={handleSearchChange}/></div>)
  }

  export default Search