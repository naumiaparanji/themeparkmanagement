import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './Home';
import {Login} from './Login';

const Main = () => {
  return (
    <Routes> {/* Add routes here */}
      <Route exact path='/' element={<Home />}></Route>
      <Route exact path='/login' element={<Login />}></Route>
    </Routes>
  );
}

export default Main;