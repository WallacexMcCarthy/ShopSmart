import React, {useState, useEffect} from 'react'
import SignUpForm from './SignUpForm'
import LoginForm from './Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from './Home'
import HistoryPage from './History'
import Navbar from './Components/Navbar'

function App(){
  return(
    <div>
      < Navbar />
      <BrowserRouter>
      <Routes>
        <Route path = '/signup' element = {<SignUpForm />}> </Route>
        <Route path = '/login' element = {<LoginForm />}> </Route>
        <Route path = '/home' element = {<HomePage />}> </Route>
        <Route path = '/history' element = {<HistoryPage />}> </Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App