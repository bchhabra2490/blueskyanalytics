const db = require('../models');
const responseStatus = require('../helpers/responseStatus.js');
const redisClient = require('../redisSetup');

const getAll = (req, res)=>{
    const cacheKey = 'allCountries';
    const noCache=req.query.noCache == 'true'?true:false;
    redisClient.get(cacheKey, async(err, data)=>{
        if(data && !noCache){
            responseStatus.success.reason.data = JSON.parse(data);
            responseStatus.success.reason.source = "Cache";
    	    res.status(responseStatus.success.code).json(responseStatus.success.reason);
        }else{
            db.sequelize.query('SELECT c.id, c.country,  MIN(cd.year) as startYear, MAX(cd.year) as endYear FROM CountriesData cd INNER JOIN Countries c ON c.id=cd.countryId GROUP BY cd.countryId', { type: db.Sequelize.QueryTypes.SELECT }).then((rows)=>{
                responseStatus.success.reason.data = rows;
                responseStatus.success.reason.source = "DB";
                redisClient.setex(cacheKey, 100, JSON.stringify(rows))
                res.status(responseStatus.success.code).json(responseStatus.success.reason);
            }).catch(err=>{
                responseStatus.Parked.reason.error = err;
                res.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
            })
        }
    })
    
}

const getCountry = (req, res)=>{
    console.log("Working Get Country", req.params.id)

    const startYear = parseInt(req.query.startYear, 10);
    const endYear = parseInt(req.query.endYear, 10);
    const category = req.query.category;
    const noCache=req.query.noCache == 'true'?true:false;
    let whereQuery = `cd.countryId=${req.params.id}`;


    if(startYear && startYear != 'NaN'){
        whereQuery += ` AND cd.year >= ${startYear}`
    }
    if(endYear && endYear!= 'NaN'){
        whereQuery += ` AND cd.year <= ${endYear}`
    }
    if(category && category != ''){
        whereQuery += ` AND cd.shortenedCategory = '${category.toLowerCase()}'`
    }
    let cacheKey = 'countryData_'+whereQuery;

    redisClient.get(cacheKey, async(err, data)=>{
        if(data && !noCache){
            responseStatus.success.reason.data = JSON.parse(data);
            responseStatus.success.reason.source = "Cache";
    	    res.status(responseStatus.success.code).json(responseStatus.success.reason);
        }else{
            const query = `SELECT cd.countryId, cd.year, cd.value, cd.category, c.country as country FROM CountriesData cd INNER JOIN Countries c ON cd.countryId=c.id WHERE ${whereQuery} ORDER BY cd.year ASC`;
            console.log("Executing: ", query)
            db.sequelize.query(query, { type: db.Sequelize.QueryTypes.SELECT }).then((rows)=>{
                console.log(rows)
                responseStatus.success.reason.data = rows;
                responseStatus.success.reason.source = "DB";
                redisClient.setex(cacheKey, 100, JSON.stringify(rows))
                res.status(responseStatus.success.code).json(responseStatus.success.reason);
            }).catch(err=>{
                responseStatus.Parked.reason.error = err;
                res.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
            })
        }
    })
}

module.exports = {
    getAll: getAll,
    getCountry: getCountry,
}