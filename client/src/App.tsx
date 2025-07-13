import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SignUp from "@/components/pages/SignUp";
import Login from "@/components/pages/Login";
import LandingPage from './components/pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;