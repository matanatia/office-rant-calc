//imports
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const readCsv = require('./modules/read-csv');

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Cors Middleware - with this all http req get hendel no matter the sorce of the req 
app.use(cors());

let rent_data = [];

const get_csv_data = async () => {
    let csv = await readCsv();
    rent_data = csv.data;
}

const calc_revenue = (year, month) => {
    //days in each month
    let months = { 1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31 };
    let rev = 0;
    let calc = 0;
    for (const record of rent_data) {
        let start_year = record["Start Day"].year;
        let start_month = record["Start Day"].month;
        let start_day = record["Start Day"].day;
        let month_days = months[month];

        if (start_year === year && start_month === month) {
            if (record["End Day"] === null || record["End Day"].month !== start_month) {
                //calc from start day to the end of the month
                calc = ((month_days - start_day) / month_days) * record["Monthly Price"];
                rev += calc;
            }
            else {//calc with the rent days in the month according the start and the end date
                calc = ((record["End Day"].day - start_day) / month_days) * record["Monthly Price"];
                rev += calc;
            }
        }
        else if (record["End Day"] !== null && record["End Day"].year === year && record["End Day"].month === month) {
            //calc from the start of the month till the end day
            calc = (record["End Day"].day / month_days) * record["Monthly Price"];
            rev += calc;
        }
    }

    return Math.round(rev);
}

const calc_unreserved = (year, month) => {
    let unreserved = 0;
    for (const record of rent_data) {
        let input_d = `${year}-${month}`;
        let start_d = `${record["Start Day"].year}-${record["Start Day"].month}`;
        let end_d = '';
        if (record["End Day"] !== null) {
            end_d = `${record["End Day"].year}-${record["End Day"].month}`;
        }
        let not_same = (input_d !== end_d) && (input_d !== start_d);
        if (not_same) {
            unreserved += record["Capacity"];

        }
    }

    return Math.round(unreserved);
}

rent_data = get_csv_data();




setTimeout(() => {
    console.log('revenue -----', calc_revenue(2014, 7));
    console.log('unreserved-----', calc_unreserved(2014, 7));
}, 1000);