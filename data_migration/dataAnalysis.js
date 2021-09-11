const fs = require('fs');
var data = fs.readFileSync("./data.csv").toLocaleString();

var rows = data.split("\n"); // SPLIT ROWS
rows.shift()

const allCategories = [];
const countries = [];

rows.forEach(row=>{
    const columns = row.split(","); //SPLIT COLUMNS


   if(allCategories.indexOf(columns[3])==-1){
        allCategories.push(columns[3])
   }

   if(countries.indexOf(columns[0])==-1){
       countries.push(columns[0])
   }
   
})

console.log(allCategories);

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

console.log(countries);