import { createGlobalStyle } from 'styled-components';

import gitHubBackground from '../assets/background.svg';

export default createGlobalStyle`

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        outline: none;
    }

    body {
        background: #F0F0F5 url(${gitHubBackground}) no-repeat 70% top;
        -webkit-font-smoothing: antialiased;
    }

    body, input, button {
        font: 16px Roboto, sans-serif;
    }

    #root {
        margin: 50px auto;
        max-width: 960px;
    }

`;
