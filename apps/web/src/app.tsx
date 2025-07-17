/* @refresh reload */
import { render } from 'solid-js/web';
import App from './routes/index';

import './app.css';

render(() => <App />, document.getElementById('root') as HTMLElement);
