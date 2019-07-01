const readCsv = require('./read-csv');

const calc_revenue = (year, month) => {
    return new Promise(async (resolve, reject) => {
        //get data from csv
        const rent_data = await readCsv();
        //days in each month
        let months = { 1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31 };
        let rev = 0;
        let calc = 0;
        //calc month revenue 
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

        resolve(Math.round(rev));
    });
}

const calc_unreserved = (year, month) => {
    return new Promise(async (resolve, reject) => {
        //get data from csv
        const rent_data = await readCsv();
        //calc unreserved offices
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
        resolve(Math.round(unreserved));
    });
}

module.exports = { calc_unreserved, calc_revenue };