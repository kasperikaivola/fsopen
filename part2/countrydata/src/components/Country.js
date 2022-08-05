const Country = ({cand, visible, setCountryToShow}) => {
    if(cand===undefined) return null
    else if(visible) {return (
      <div id={cand.name.common}>
        <h1>{cand.name.common}</h1>
        <p>Capital {cand.capital}<br/>Area {cand.area}</p>
        <h4><b>Languages:</b></h4>
        <ul>
          {Object.values(cand.languages).map(lang => <li key={lang}>{lang}</li>)}
        </ul>
        <img src={cand.flags.png} height="200" alt="Flag here"/>
      </div>)
    }
    else return (<p>{cand.name.common} {cand.number} {<button onClick={() => setCountryToShow(cand)}>Show</button>}</p>)
}

export default Country