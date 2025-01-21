import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Payment from './Pages/Payment'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </Router>
  )
}

export default App
