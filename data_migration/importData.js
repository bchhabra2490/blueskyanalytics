const fs = require('fs');
const mysql = require('mysql');
const { exit } = require('process');
const dotenv = require('dotenv')
dotenv.config({path: '../.env'});

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: 3306,
})

const createCountryTableQuery = `CREATE TABLE IF NOT EXISTS Countries(
    id int AUTO_INCREMENT PRIMARY KEY,
    country varchar(50)
)`

const createCountriesDataTableQuery = `CREATE TABLE IF NOT EXISTS  CountriesData
(
id int AUTO_INCREMENT PRIMARY KEY,
countryId int,
year int,
value int,
category varchar(255),
shortenedCategory varchar(10),
FOREIGN KEY (countryId) REFERENCES Countries(id)
);`


const categoryMapping = {
    'carbon_dioxide_co2_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent': 'co2',
    'greenhouse_gas_ghgs_emissions_including_indirect_co2_without_lulucf_in_kilotonne_co2_equivalent': 'ghgs_co2',
    'greenhouse_gas_ghgs_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent': 'ghgs',
    'hydrofluorocarbons_hfcs_emissions_in_kilotonne_co2_equivalent': 'hfcs',
    'methane_ch4_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent': 'ch4',
    'nitrogen_trifluoride_nf3_emissions_in_kilotonne_co2_equivalent': 'nf3',
    'nitrous_oxide_n2o_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent': 'n2o',
    'perfluorocarbons_pfcs_emissions_in_kilotonne_co2_equivalent': 'pfcs',
    'sulphur_hexafluoride_sf6_emissions_in_kilotonne_co2_equivalent': 'sf6',
    'unspecified_mix_of_hydrofluorocarbons_hfcs_and_perfluorocarbons_pfcs_emissions_in_kilotonne_co2_equivalent': 'hfcs_pfcs'
}

connection.query(createCountryTableQuery, (err, resp)=>{
    if(err) throw err;
    connection.query(createCountriesDataTableQuery, (err1, resp1)=>{
        if (err1) throw err1;
        var data = fs.readFileSync("./data.csv").toLocaleString();

        var rows = data.split("\n"); // SPLIT ROWS
        rows.shift()
        
        const allCountries = [];

        const allInsertCountryPromises = [];
        rows.forEach(row=>{
            const columns = row.split(","); //SPLIT COLUMNS
    
            if(allCountries.indexOf(columns[0]) == -1){
                // New Country.
                allCountries.push(columns[0])  
                let query = `INSERT INTO Countries(country) VALUES ('${columns[0]}')`
    
                allInsertCountryPromises.push(new Promise((res, rej)=>{
                    connection.query(query, (err, response)=>{
                        if(err) rej(err)
                        res({id:response.insertId, country: columns[0]})
                    })
                })) 
            }
        })
    
        Promise.all(allInsertCountryPromises).then(data=>{
            console.log("Countries Created")
            console.log(data)
            const allDataPromises = [];

            rows.forEach(row=>{
                const columns = row.split(","); //SPLIT COLUMNS

                const shortenedCategory = categoryMapping[columns[3]];
                const index = data.findIndex(d=>d.country == columns[0])
                const countryId = data[index].id;
                const countryDataQuery = `INSERT INTO CountriesData(countryId, year, value, category, shortenedCategory) VALUES (${countryId}, ${parseInt(columns[1], 10)},${parseInt(columns[2], 10)},'${columns[3]}','${shortenedCategory}')`

                allDataPromises.push(new Promise((res, rej)=>{
                    connection.query(countryDataQuery, (err, rows)=>{
                        if(err) throw err;
                        res()
                    })
                }))
            })

            Promise.all(allDataPromises).then(()=>{
                console.log("Inserted Country Data");
                exit();
            }).catch(e=>console.log("Error while inserting country data: ", e))
        }).catch(e=>console.log("Error: ", e))
    })
})

