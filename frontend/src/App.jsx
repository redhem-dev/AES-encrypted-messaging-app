import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import ChatComponent from './components/Chat';
import Login from './components/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<ChatComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
  