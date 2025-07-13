import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SignUp from "@/components/pages/SignUp";
import Login from "@/components/pages/Login";
import LandingPage from './components/pages/LandingPage';
import Home from './components/pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;