import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material';
import App from './app/App';
import theme from './app/theme';
import reportWebVitals from './reportWebVitals';
import { store, StoreContext } from './app/store/store';

// HashRouter keeps deep links (e.g. /#/movie/123) working on GitHub Pages,
// which can't rewrite unknown paths to index.html.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StoreContext.Provider value={ store }>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HashRouter>
          <App />
        </HashRouter>
      </ThemeProvider>
    </StoreContext.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
