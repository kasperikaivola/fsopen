const Search = ({searchTerm, handleSearchChange}) => {
    return (<div>Filter blogs: <input value={searchTerm} onChange={handleSearchChange}/></div>)
  }

  export default Search