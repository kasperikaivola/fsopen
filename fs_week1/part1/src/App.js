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
      <Part pname={props.p1[0]} pex={props.p1[1]}/>
      <Part pname={props.p2[0]} pex={props.p2[1]}/>
      <Part pname={props.p3[0]} pex={props.p3[1]}/>
    </div>
  )
}

const Total = (props) => {
  return (
    <div>
      <p>Number of exercises {props.sum}</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      <Header course={course} />
      <Content p1={[part1.name,part1.exercises]} p2={[part2.name,part2.exercises]} p3={[part3.name,part3.exercises]}/>
      <Total sum={part1.exercises+part2.exercises+part3.exercises} />
    </div>
  )
}

export default App