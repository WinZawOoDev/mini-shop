import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './app/store'
import { fetchItems } from './app/itemSlice'
import { fetchCategorys } from './app/categorySlice'

store.dispatch(fetchCategorys())
store.dispatch(fetchItems())


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
