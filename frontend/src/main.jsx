import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter,Routes, Route} from "react-router-dom";
import './index.css'
import Home from './Home.jsx'
import About from './Components/About.jsx';
import Contact from './Components/Contact.jsx';
import Terms from './Components/Terms.jsx';
import Privacy from './Components/Privacy.jsx';
import SearchHomes from './Components/SearchHomes.jsx';
import SignIn from './Components/SignIn.jsx';
import Register from './Components/Register.jsx';
import ListProperty from './Components/listproperty.jsx';


createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
    <Routes>

      <Route path="/" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/privacy" element={<Privacy/>}/>
      <Route path="/terms" element={<Terms/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/searchhomes" element={<SearchHomes/>}/>
      <Route path="/signin" element={<SignIn/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/listproperty" element={<ListProperty/>}/>
    
    </Routes>
  </BrowserRouter>

)
