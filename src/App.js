import { BrowserRouter } from 'react-router-dom';

import './App.css';
import Dashboard from './Component/Dashboard';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<BrowserRouter>
					<Dashboard></Dashboard>
				</BrowserRouter>
			</header>
		</div>
	);
}

export default App;