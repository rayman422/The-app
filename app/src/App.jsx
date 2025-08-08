import React from 'react';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './routes';

export default function App() {
  return <RouterProvider router={router} />;
}
