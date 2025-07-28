import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SurveyForm from './SurveyForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Routes */}
        <Routes>
          <Route path="/*" element={<SurveyForm />} /> {/* Render SurveyForm for all paths */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
