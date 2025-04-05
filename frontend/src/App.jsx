import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from '../pages/signup';
import Signin from '../pages/signin';
import FlowChart from '../pages/flowchart';
import React from 'react'; // Import React
import ProtectedRoute from '../ProtectetdRoute';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <FlowChart />
          </ProtectedRoute>
        } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </Router>
  );
}

export default App;
