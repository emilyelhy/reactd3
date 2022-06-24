import { BrowserRouter } from 'react-router-dom';

import './App.css';
import Dashboard from './Component/Dashboard';

function App() {
	return (
		<div className="App">
				<BrowserRouter>
					<Dashboard></Dashboard>
				</BrowserRouter>
		</div>
	);
}

export default App;