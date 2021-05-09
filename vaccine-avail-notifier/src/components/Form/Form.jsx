import React, { useState } from 'react';
import classes from './Form.module.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const options = {
	autoClose: 6000,
	position: toast.POSITION.BOTTOM_RIGHT,
	pauseOnHover: true,
};

const Form = () => {
	const [values, setValues] = useState({
		pincode: '',
		email: '',
		appPass: '',
		age: '',
	});

	const { pincode, email, appPass, age } = values;

	const handleChange = (name) => (e) => {
		setValues({ ...values, [name]: e.target.value });
	};

	const showError = (err) => {
		toast.error('Something went wrong. Check your console', options);
		console.error(JSON.stringify(err, null, 2));
	};

	const handleClick = async (e) => {
		e.preventDefault();
		axios
			.post(`https://vaccine-avail-notifier.herokuapp.com/addTask`, {
				...values,
			})
			.then((res) => {
				console.log(res);
				toast.success(
					'Successfully added task. You will get notified as soon as slots are available',
					options,
				);
			})
			.catch((err) => showError(err));
		try {
		} catch (err) {
			showError(err);
		}
	};

	return (
		<section className={classes.Form_Wrapper}>
			<form action=''>
				<div className={classes.Form_Control}>
					<label htmlFor='pincode'>Pincode</label>
					<input type='zipcode' id='pincode' value={pincode} onChange={handleChange('pincode')} />
				</div>
				<div className={classes.Form_Control}>
					<label htmlFor='email'>Email</label>
					<input type='email' id='email' value={email} onChange={handleChange('email')} />
				</div>
				<div className={classes.Form_Control}>
					<label htmlFor='app_pass'>Application Password</label>
					<input
						type='password'
						name='app_pass'
						id='app_pass'
						value={appPass}
						onChange={handleChange('appPass')}
					/>

					<span>
						Click{' '}
						<a
							href='https://support.google.com/accounts/answer/185833?p=InvalidSecondFactor&visit_id=637554658548216477-2576856839&rd=1'
							target='_blank'
							rel='noreferrer'>
							here
						</a>{' '}
						to generate App Password
					</span>
				</div>
				<div className={`${classes.Form_Control} ${classes.Age}`}>
					<label htmlFor='age'>Age</label>
					<input type='text' name='age' id='age' value={age} onChange={handleChange('age')} />
				</div>
				<div className={classes.Form_Control} onClick={handleClick}>
					<button type='submit'>Submit</button>
				</div>
			</form>
		</section>
	);
};

export default Form;
// noqplhfcrauwsuxo
