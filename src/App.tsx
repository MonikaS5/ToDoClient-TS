//App.js

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Todo from './components/Todo';
import logo from './logo.png';
import './App.css';
 
function App() {
 
  return (
    <div>
      <div className='bg-light p-3 mb-5'>
        <h1 className=' text-center'> <img src={logo} className="App-logo me-3" alt="logo" />
          To-Do List</h1>
      </div>

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Todo />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
