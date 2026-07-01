import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './features/dashboard/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
