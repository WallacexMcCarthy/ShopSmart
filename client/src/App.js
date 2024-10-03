import React, {useState, useEffect} from 'react'
import SignUpForm from './SignUpForm'
import LoginForm from './Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from './Home'

function App(){
  const [column, setColumn] = useState([])
  const [records, setRecords] = useState([])
  useEffect(() => {
    fetch("/ebay").then(
      res => res.json()
    ).then(
      data => {
        setColumn(Object.keys(data.products[0]))
        setRecords(data.products)
        console.log(column)
        console.log(records)
      
      }
    )
  }, [])

  return(
    <div>
      <BrowserRouter>
      <Routes>
        <Route path = '/signup' element = {<SignUpForm />}> </Route>
        <Route path = '/login' element = {<LoginForm />}> </Route>
        <Route path = '/home' element = {<HomePage />}> </Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App