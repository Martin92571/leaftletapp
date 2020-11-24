import React from "react";
import L from "leaflet";







class Map extends React.Component {

  constructor(props) {
    super(props);
    this.state = {weather:[],CaliforniaCites:{default:{features:[]}}};
  }
  
  searchWeatherData(key){
    for(let i=0;i<this.state.weather.length;i++){
      if(this.state.weather[i].fid===key){
        return this.state.weather[i]
      }
    }
    return false
  }

  mapStyle=(feature)=> {
  console.log("what is the feature",feature)
  let cityWeather="";
  let fahrenheit=0;
   if(feature.properties.CITY!=="Unincorporated"){
    cityWeather=this.searchWeatherData(feature.properties.FID)
    console.log("what is the city data",cityWeather)
    if(cityWeather){
      let kelvin=cityWeather.temp
      let celsius = kelvin - 273.15;
      fahrenheit = Math.floor(celsius * (9/5) + 32);
    }
   
    
   }
   console.log("what is the fa",fahrenheit)
  

  //  // Calculating Fahrenheit temperature to the nearest integer
  
   switch(true){
   
   case (0!==fahrenheit && fahrenheit<=55):
     fahrenheit= "#6ac6f9";
     break;
   case (fahrenheit>55 && fahrenheit<=70):
      fahrenheit= "#fbed63";
       break;
   case (fahrenheit>70 && fahrenheit<=85):
      fahrenheit= "#ffb748";
     break;
  case (fahrenheit>85 && fahrenheit<=130):
    fahrenheit= "#f0341f";
     break;
   default :

     fahrenheit="#636154";
     break
   
   }
   console.log("what is the hex",fahrenheit)
    return {
     fillColor: fahrenheit,
      weight: 1.5,
      opacity: 0.4,
      stroke: true,
      color:"#000",
      
      fillOpacity: 0.5
    };
  }

  whenClicked=(e) =>{
    // e = event
    console.log("jkdlfhdsjlhfjds",e.target.feature)
    let cityWeather="";
    let fahrenheit=0;
    let extradata="";
     if(e.target.feature.properties.CITY!=="Unincorporated"){
      cityWeather=this.searchWeatherData(e.target.feature.properties.FID)
      console.log("what is the city data",cityWeather.extraData)
      if(cityWeather){
        let kelvin=cityWeather.temp
        let celsius = kelvin - 273.15;
        extradata=JSON.parse(cityWeather.extraData);
        fahrenheit = Math.floor(celsius * (9/5) + 32);
      }else{
        return
      }
   
     let HtmlRender="<div>";
     
         HtmlRender+=`<div><b>City</b>: ${cityWeather.city}</div>
         <div><b>Tempature</b>: ${fahrenheit}&#8457;</div>
         <div><b>Wind Speed</b>: ${extradata.wind.speed}MPH</div>

         `
        
      
      HtmlRender+="</div>"
    
      let popup = L.popup()
    .setLatLng(e.latlng)
    .setContent(HtmlRender)
    .openOn(this.map);
   
    
  
   
  }else{
    return
  }
}
 onEachFeature=(feature, layer)=>{
      //bind click
      
      layer.on({
          click: this.whenClicked
      });
  }
  

  async componentDidMount() {
    // create map
    // check if data has changed
    let CalifroniaBoundaries=await fetch("https://opendata.arcgis.com/datasets/ccbaf8862171465cad234108cd098b47_0.geojson")
    console.log("what is the data",CalifroniaBoundaries)
    CalifroniaBoundaries=await CalifroniaBoundaries.json()
    console.log("after bounderaies json",CalifroniaBoundaries)
    this.usmap=L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    })

    this.map = L.map("map", {
      center: [34.05, -118.24],
      zoom: 9,
      layers: [this.usmap]
      
    });
  
     let getColor=(d)=> {
      return d > 130 ? '#FC4E2A' :
      d > 85   ? '#FD8D3C' :
      d > 70   ? '#FEB24C' :
      d >  55  ? '#FFEDA0' :
                        '#6ac6f9';
  }
    let  legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["No Data",0, 55, 70, 85, 130],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length-1; i++) {
      if(grades[i]=="No Data"){
        div.innerHTML +=
        '<div  class="legendRow"><i style="background:' + "#636154" + '"></i> ' +
       "No Data </div>";
      }else{
        div.innerHTML +=
        '<div  class="legendRow"><i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1]  : '+')+"</div>";
      }
       
    }

    return div;
};

   legend.addTo(this.map);
    // add layer
    let weatherData= await fetch("http://localhost:1555/weather/")
        console.log("waitinf")
    let responseWeather=await weatherData.json()
    console.log("waitinf",responseWeather)
    this.setState({weather:responseWeather,CaliforniaCites:CalifroniaBoundaries})

    try {
      setInterval(async()=>{
        let weatherData= await fetch("http://localhost:1555/weather/")
        console.log("waitinf")
        let responseWeather=await weatherData.json()
        this.setState({weather:responseWeather})
      },600000)
      
    } catch(e){
      console.log(e);
    }
   
    
    

    
  }
  componentDidUpdate() {
    
    
 
   
    let California=L.geoJSON(this.state.CaliforniaCites.features,{style:this.mapStyle,onEachFeature:this.onEachFeature}).addTo(this.map)
    let baseMaps = {
      "US": this.usmap,
  };
  
  let overlayMaps = {
   
      "California":California
  };
  
  // initialize up the L.control.layers
  L.control.layers(baseMaps, overlayMaps).addTo(this.map);
   
  }
  render() {
    console.log("whats thestats",this.state)
    return <div id="map">  </div>;
  }
}

export default Map;
