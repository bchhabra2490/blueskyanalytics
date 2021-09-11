## To Run Locally

- Run `docker-compose up -d` in the root folder. It will start `mysql`, `phpmyadmin` and `redis`
- Run `npm i`
- Go To data_migration and run `node importData.js` and it will create the tables and import the data.
- Go to root folder back and run `npm run dev` and the app will be up on PORT `3000`

## APIs

- /countries - Return all countries
- /country/id?startYear=<startYear>&endYear=<endYear>&category=<category>. Possible values for category are given below.

Add `&noCache=true` in query params of both APIs to pass through cache.

### Possible values of Categories

-    'carbon_dioxide_co2_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent': 'co2'
-    'greenhouse_gas_ghgs_emissions_including_indirect_co2_without_lulucf_in_kilotonne_co2_equivalent': 'ghgs_co2'
-    'greenhouse_gas_ghgs_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent': 'ghgs'
-    'hydrofluorocarbons_hfcs_emissions_in_kilotonne_co2_equivalent': 'hfcs'
-    'methane_ch4_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent': 'ch4'
-    'nitrogen_trifluoride_nf3_emissions_in_kilotonne_co2_equivalent': 'nf3'
-    'nitrous_oxide_n2o_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent': 'n2o'
-    'perfluorocarbons_pfcs_emissions_in_kilotonne_co2_equivalent': 'pfcs'
-    'sulphur_hexafluoride_sf6_emissions_in_kilotonne_co2_equivalent': 'sf6'
-    'unspecified_mix_of_hydrofluorocarbons_hfcs_and_perfluorocarbons_pfcs_emissions_in_kilotonne_co2_equivalent': 'hfcs_pfcs'


### Example Get Calls.

- `http://localhost:3000/countries` - To get countries.
- `http://localhost:3000/country/5?startYear=2008&endYear=2011&category=sf6` - To get a particular country data.

