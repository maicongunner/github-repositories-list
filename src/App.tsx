import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes';
import CreateGlobal from './styles/global';

const App: React.FC = () => (
    <BrowserRouter>
        <Routes />
        <CreateGlobal />
    </BrowserRouter>
);

export default App;
