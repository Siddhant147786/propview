import { createRoot } from 'react-dom/client'
import {BrowserRouter,Routes, Route, Navigate} from "react-router-dom";
import './index.css'
import Home from './Home.jsx'
import About from './Components/About.jsx';
import Contact from './Components/Contact.jsx';
import Terms from './Components/Terms.jsx';
import Privacy from './Components/Privacy.jsx';
import SearchHomes from './Components/SearchHomes.jsx';
import SignIn from './Components/SignIn.jsx';
import Register from './Components/Register.jsx';
import ListProperty from './Components/ListProperty.jsx';
import Protected from './Components/Protected.jsx';
import Profile from './Components/Profile.jsx';
import AuthProvider from './auth/AuthProvider.jsx';
import PropertyDetail from './Components/PropertyDetail.jsx';
import ResetPassword from './Components/ResetPassword.jsx';
import Help from './Components/Help.jsx';
import NotFound from './Components/NotFound.jsx';
import Admin from './Components/Admin.jsx';

createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
    <AuthProvider>
    <Routes>

      <Route path="/" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/privacy" element={<Privacy/>}/>
      <Route path="/terms" element={<Terms/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/searchhomes" element={<SearchHomes/>}/>
      <Route path="/signin" element={<SignIn/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/reestpassword" element={<Navigate to="/resetpassword" replace />} />
      <Route path="/help" element={<Help />} />
      <Route path="/admin" element={<Protected><Admin /></Protected>} />
      <Route path="/properties/:id" element={<PropertyDetail />} />
      <Route path="/properties/:id/edit" element={<Protected><ListProperty key="edit" /></Protected>} />
      <Route path="/profile" element={<Protected><Profile /></Protected>} />
      <Route path="/listproperty" element={
        <Protected>
          <ListProperty key="create" />
        </Protected>
      }/>
    
      <Route path="*" element={<NotFound />} />
    </Routes>
    </AuthProvider>
  </BrowserRouter>

)
