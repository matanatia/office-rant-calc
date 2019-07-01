//imports
const fs = require('fs');
const readline = require('readline');

const csv_path = 'rent_data.csv';
const csv_columns = ['Capacity', 'Monthly Price', 'Start Day', 'End Day'];
const csv_data = [];

const readCsv = () => {
    return new Promise( (resolve) => {

        const rd = readline.createInterface({
            input: fs.createReadStream(csv_path)
        });
    
        //get the info from the csv file - put in the array for farther use
        rd.on('line', function (line) {
            let line_obj = {};
            let record = line.split(",");
    
            for (let i = 0; i < csv_columns.length; i++) {
                if (!csv_columns.includes(record[i])) {
                    let key = csv_columns[i];
                    line_obj[key] = record[i];
                }
    
                let key = csv_columns[i];
                let value = record[i];
                let check_value = true;
                let date = [];
    
                switch (key) {
                    case 'Capacity':
                        check_value = !isNaN(value);
                        if (check_value) {
                            line_obj[key] = Number(value);
                        }
                        break;
                    case 'Monthly Price':
                        check_value = !isNaN(value);
                        if (check_value) {
                            line_obj[key] = Number(value);
                        }
                        break;
                    case 'Start Day':
                        check_value = (new Date(value) !== "Invalid Date");
                        if (check_value) {
                            if (value) {
                                date = value.split("-");
                                line_obj[key] = { year: Number(date[0]), month: Number(date[1]), day: Number(date[2])};
                            }
                            else {
                                line_obj[key] = null;
                            }
                        }
                        break;
                    case 'End Day':
                        check_value = (new Date(value) !== "Invalid Date");
                        if (check_value) {
                            if (value) {
                                date = value.split("-");
                                line_obj[key] = { year: Number(date[0]), month: Number(date[1]), day: Number(date[2])};
                            }
                            else {
                                line_obj[key] = null;
                            }
                        }
                        break;
    
                    default:
                        line_obj[key] = null;
                        break;
                }
            }
    
            csv_data.push(line_obj);
        });
    
        rd.on('close', () => {
            //remove the headers from the array
            csv_data.splice(0, 1);
            resolve({data : csv_data});
        });

    });

}

module.exports = readCsv;