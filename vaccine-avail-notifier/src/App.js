import './App.css';
import Form from './components/Form/Form';
import { ToastContainer } from 'react-toastify';

const App = () => {
	return (
		<>
			<div className='App'>
				<h1>Vaccine Availability Notifier</h1>
				<Form />
			</div>
			<ToastContainer />
		</>
	);
};

export default App;
