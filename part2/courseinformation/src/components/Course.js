const Course = (props) => {
    return (
      <div>
        <Header course={props.course.name}/>
        <Content parts={props.course.parts}/>
        <Total parts={props.course.parts}/>
      </div>
    )
  }
  
  const Header = (props) => {
    return (
      <div>
        <h2>{props.course}</h2>
      </div>
    )
  }
  
  const Part = (props) => {
    return (
      <div>
        <p key={props.id}>{props.pname} {props.pex}</p>
      </div>
    )
  }
  
  const Content = (props) => {
    return (
      <div>
        {props.parts.map(part => <Part pname={part.name} pex={part.exercises} key={part.id}/>)}
      </div>
    )
  }
  
  const Total = (props) => {
    return (
      <div>
        <p><b>Total number of exercises {props.parts.map(a => a.exercises).reduce((a,b) => a+b)}</b></p>
      </div>
    )
  }
  
  export default Course