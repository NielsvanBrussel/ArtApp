import { useEffect, useState } from 'react';
import { GlobalProvider } from './GlobalState';
import './App.css';
import AppRouter from './AppRouter';

function App() {
   



    return (
        <GlobalProvider>
            <AppRouter />
        </GlobalProvider>
    );
}

export default App;