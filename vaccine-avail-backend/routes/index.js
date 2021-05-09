const express = require('express');
const router = express.Router();
const { checkAvailability } = require('./helpers/availHelper.js');

router.post('/addTask', (req, res, next) => {
	try {
		setInterval(() => {
			checkAvailability({ ...req.body });
		}, 60000);
		// cron.schedule('* * * * *', async () => {
		// 	await checkAvailability({ ...req.body });
		// });

		// return res.status(200).send('Success');
	} catch (e) {
		console.log('an error occured: ' + JSON.stringify(e, null, 2));
		return res.status(500).send('Error occurred: ', e);
	}
});

module.exports = router;
