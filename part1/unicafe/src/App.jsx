import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header label = 'give feedback' />
      <div>
        <Button label = 'good' onClick = {() => setGood(good + 1)}/>
        <Button label = 'neutral' onClick = {() => setNeutral(neutral + 1)}/>
        <Button label = 'bad' onClick = {() => setBad(bad + 1)}/>
      </div>
      <Statistics good = {good} neutral = {neutral} bad = {bad} />
    
    </div>
  )
}
const Header = ({label}) =>{
  return(
  <h1>{label}</h1>
  )
}
const Button = ({label,onClick}) => {
  return(
  <button onClick={onClick}>
    {label}
    </button>
  )
}
const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  return(
    all == 0?<p>No feedback given</p>:
    <>
      <Header label = 'statistics' />
      <table>
        <tbody>
          <StatisticLine text = 'good' value = {good} />
          <StatisticLine text = 'neutral' value = {neutral} />
          <StatisticLine text = 'bad' value = {bad} />
          <StatisticLine text = 'all' value = {all} />
          <StatisticLine text = 'average' value = {(good-bad)/all} />
          <StatisticLine text = 'positive' value = {`${(good/all*100)} %`} />
        </tbody>
      </table>
    </>
  )
}

const StatisticLine = ({text,value}) => {

  return(
    <tr>
      <td>{text} </td>
      <td>{value}</td>
    </tr>
  )
}


export default App