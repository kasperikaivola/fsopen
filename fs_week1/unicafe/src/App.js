import { useState } from 'react'

const Button = (props) => <button onClick={props.handleClick}>{props.text}</button>

const StatisticLine = (props) => {
  if(props.text==="Positive") return (<tr><td>{props.text}</td><td>{props.value} %</td></tr>)
  else return (<tr><td>{props.text}</td><td>{props.value}</td></tr>)
}

const Statistics = (props) => {
  if(props.total>0) {return (
  <div>
    <table>
      <tbody>
        <StatisticLine text="Good" value={props.good}/>
        <StatisticLine text="Neutral" value={props.neutral}/>
        <StatisticLine text="Bad" value={props.bad}/>
        <StatisticLine text="Total" value={props.total}/>
        <StatisticLine text="Average" value={(props.good-props.bad)/props.total}/>
        <StatisticLine text="Positive" value={(props.good/props.total)*100}/>
      </tbody>
    </table>
  </div>
  )
  }
  else return (<p>No feedback given</p>)
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)

  const UpdateGood = () => {
    setGood(good+1)
    setTotal(total+1)
  }

  const UpdateNeutral = () => {
    setNeutral(neutral+1)
    setTotal(total+1)
  }

  const UpdateBad = () => {
    setBad(bad+1)
    setTotal(total+1)
  }

  return (
    <div>
      <h1>Unicafe</h1>
      <h2>Give feedback</h2>
      <Button handleClick={() => UpdateGood()} text="Good"/>
      <Button handleClick={() => UpdateNeutral()} text="Neutral"/>
      <Button handleClick={() => UpdateBad()} text="Bad"/>
      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} total={total}/>
    </div>
  )
}

export default App