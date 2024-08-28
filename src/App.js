import React from 'react'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import Login from './components/login'
import NotFound from './components/notFound'
import Home from './components/home'
import MainBody from './components/homepage/mainPage'

const App = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element=<Login/>/>
            <Route path='/*' element=<NotFound/>/>
            <Route path='/mainbody' element=<MainBody/> />

        </Routes>
    </BrowserRouter>
  )
}

export default App
