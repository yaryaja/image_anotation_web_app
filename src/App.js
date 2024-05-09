import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Authentication from './authentication';
import Registration from './registration';
import ShowImage from './showImage';


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false); // Initially set to false as the user is not logged in

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Authentication setLoggedIn={setLoggedIn} />} />
          <Route exact path="/signup" element={<Registration />} />
          <Route exact path="/Home" element={<Home />} />
          <Route exact path="/ShowImage" element={<ShowImage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
