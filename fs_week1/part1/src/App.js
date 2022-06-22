const Header = (props) => {
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>{props.pname} {props.pex}</p>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part pname={props.parts[0].name} pex={props.parts[0].exercises}/>
      <Part pname={props.parts[1].name} pex={props.parts[1].exercises}/>
      <Part pname={props.parts[2].name} pex={props.parts[2].exercises}/>
    </div>
  )
}

const Total = (props) => {
  return (
    <div>
      <p>Number of exercises {props.parts.map(a => a.exercises).reduce((a,b) => a+b)}</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
    name: 'Fundamentals of React',
    exercises: 10
  },
  {
    name: 'Using props to pass data',
    exercises: 7
  },
  {
    name: 'State of a component',
    exercises: 14
  }
]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts}/>
      <Total parts={parts}/>
    </div>
  )
}

export default App