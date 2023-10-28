import React from 'react';
import Window from './components/Window';
import NotFound from './components/NotFound';

import Login from './components/Login';

import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';

// Authenticate router code
const AuthenticatedRoute = ({children}) => {
  if (localStorage.getItem('user')) {
    return children;
  }
  return <Navigate to='/login' replace />;
};

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          exact element={
            <AuthenticatedRoute>
              <Window />
            </AuthenticatedRoute>
          }
        />
        <Route path="/login" exact element={<Login />} />
        <Route
          path='*'
          element = {
            <AuthenticatedRoute>
              <NotFound />
            </AuthenticatedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
