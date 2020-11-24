let caliJson = require("./CaliBoundaries.json");
let mysql = require('mysql');
let fetch =require('node-fetch')
const sleep = require('util').promisify(setTimeout)
const dbConfig = require("../config/db.config");
let OpenWeatherApiKey='APIKEY'

let con = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

async function getOpenWeatherData(recursiveRun=false){
  console.log("start openWeatherData",caliJson,"###########")

  let openweathermap=`https://api.openweathermap.org/data/2.5/weather?q=`;
  let error=false;
  if(!recursiveRun){
    caliJson=caliJson.features.filter(row=>{
      if(row.properties.CITY!=="Unincorporated"){
        return row
      }
     
    })
  }
  
  for(let i=0;i<caliJson.length;i++){
     let fid=caliJson[i].properties.FID;
     let city=caliJson[i].properties.CITY;
     let temp,extraData;
     
     let weather=await fetch(`${openweathermap}${caliJson[i].properties.CITY},CA,US&appid=${OpenWeatherApiKey}`)
     let responseWeather=await weather.json()
     
     if(responseWeather.cod==200){
      console.log("what is the weather",responseWeather)
      temp=responseWeather.main.temp;
      extraData=JSON.stringify(responseWeather)
      
      let sql = "INSERT INTO `openweather`(`fid`, `city`, `temp`, `extraData`) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE temp = ?";
      let sqlData=[fid,city,temp,extraData,temp]
      con.query(sql,sqlData, function (err, result) {
        if (err){
         error =true;
         throw err
        };
        
      });
      
 
      await sleep(1500)
     }
     
    
  }
  if(!error){
    getOpenWeatherData(true)
  }
  
}




getOpenWeatherData()

