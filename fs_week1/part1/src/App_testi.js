const Hello = (props) => {
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  )
}

const App = () => {
  console.log('Hello from komponentti')
  const now = new Date()
  const a = 1
  const b = 2
  return (
    <div>
      <p>Hello world, it is {now.toString()}</p>
      <p>{a} plus {b} is {a+b}</p>
      <h1>Greetings</h1>
      <Hello name="Cool" age={2}/>
      <Hello name="testi" age={10+a}/>
    </div>
  )
}
export default App