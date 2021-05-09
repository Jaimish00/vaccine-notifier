const moment = require('moment');
const axios = require('axios');
const nodemailer = require('nodemailer');
const fs = require('fs');

module.exports.checkAvailability = async ({ pincode, email, appPass, age }) => {
	console.log('Fetching next days info');
	let datesArray = await fetchNext10Days();
	datesArray.forEach((date) => {
		getSlotsForDate({ pincode, email, appPass, age, date });
	});
};

const getSlotsForDate = ({ pincode, email, appPass, age, date }) => {
	let config = {
		method: 'get',
		url:
			'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=' +
			pincode +
			'&date=' +
			date,
		headers: {
			accept: 'application/json',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
		},
	};
	console.log('Checking for slots on ', date);
	axios(config)
		.then((slots) => {
			let sessions = slots.data.sessions;
			let validSlots = sessions.filter(
				(slot) => slot.min_age_limit <= age && slot.available_capacity > 0,
			);
			console.log({ date: date, validSlots: validSlots.length });
			if (validSlots.length > 0) {
				notifyMe({ validSlots, email, appPass });
			}
		})
		.catch(function (error) {
			console.error(error);
		});
};

async function fetchNext10Days() {
	let dates = [];
	let today = moment();
	for (let i = 0; i < 10; i++) {
		let dateString = today.format('DD-MM-YYYY');
		dates.push(dateString);
		today.add(1, 'day');
	}
	return dates;
}

const notifyMe = ({ validSlots, email, appPass }) => {
	let slotDetails = ''

	validSlots.forEach((slot, index) => {
		slotDetails += '<section>'
		slotDetails += `<span>${index + 1}.</span>`
		slotDetails += `<div style={display:flex; flex-direction:column}>`
		slotDetails += `<span>Name: ${slot.name}</span>`
		slotDetails += `<span>Vaccine: ${slot.vaccine}</span>`
		slotDetails += `<span>Available Capacity: ${slot.available_capacity}</span>`
		slotDetails += `<span>Date: ${slot.date}</span>`
		slotDetails += `<span>Block Name: ${slot.block_name}</span>`
		slotDetails += `<span>District Name: ${slot.district_name}</span>`
		slotDetails += `<span>State: ${slot.state}</span>`
		slotDetails += `<span>Fee Type: ${slot.fee_type}</span>`
		slotDetails += `<span>Fee: ${slot.fee}</span>`
		slotDetails += `</div>`
		slotDetails += '</section>'
	});


	const callback = (err, result) => {
		if (err) {
			console.error(err);
		}
		console.log(result);
	};

	mailDetails({ email, appPass, slotDetails, callback });
};

const mailDetails = ({ email, appPass, slotDetails, callback }) => {
	const nodemailerTransporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: String(email),
			pass: String(appPass),
		},
	});
	const htmlString = fs.readFileSync('../templates/email.html', 'utf-8');

	htmlString.replace('{{{ slotDetails }}}', slotDetails);

	const htmlBuff = Buffer.from(htmlString, 'utf-8');
	
	const message = {
		from: String(`Vaccine Availability Notifier: ${email}`),
		to: email,
		subject: 'Vaccine Slots Available',
		html: htmlBuff,
	};

	nodemailerTransporter.sendMail(message, (err, info) => {
		if (err) return callback(err);
		callback(err, info);
	});
};
