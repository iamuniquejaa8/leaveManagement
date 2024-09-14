import  {BrowserRouter, Routes, Route} from 'react-router-dom'
import Partner from './Pages/Partner'
import Leave from './Pages/Leave'
import AddLeave from './Pages/AddLeave'
import Navbar from './component/Navbar'

function App() {

  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<div className='flex items-center justify-center h-[94vh]'><b> Leave management system</b></div>} />
      <Route path="/partner" element={<Partner />} />
      <Route path="/leave" element={<Leave />} />
      <Route path="/add-leave/:partnerId" element={<AddLeave />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
