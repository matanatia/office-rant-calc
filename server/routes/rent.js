const express = require('express');
const { calc_unreserved, calc_revenue } = require('../modules/rent-calc');

const router = express.Router();

const send_results = async(res, year, month) => {
    const results = { revenue : 0, unreserved : 0};
    results.revenue = await calc_revenue(year, month);
    results.unreserved = await calc_unreserved(year, month);
    res.status(200).send(results);
}

const responseWithStatus = (status, response, message) => {
    response.status(status).send({
        message
    });
}

//calc the revenue from the offices rent and the unreserved offices for the month the client sends in the url
//use - /rent?year=2017&month=7
router.get('/', (req, res) => {
    const { year, month } = req.query;
    if (!year || !month ) responseWithStatus(500, res, `Missing Data: year - ${year}, month - ${month}`);
    let current_year = new Date().getFullYear();
    if (isNaN(year) || isNaN(month) || Number(month) < 1 || Number(month) > 12 || Number(year) < 1980 || Number(year) > current_year) {
        responseWithStatus(500, res, `Invalid Data: year - ${year}, month - ${month}`);
    }
    send_results(res, Number(year), Number(month));
});

module.exports = router;
