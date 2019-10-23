import React from "react";
import L from "leaflet";
import * as Usoutline from "./us_outline.json"
import * as States from "./states.json";
import * as County from "./county.json";
import * as Congressional from "./congressional.json";



class Map extends React.Component {

  mapStyle=(mapType,weight)=> {
  
    let mapTypeColor;
    switch(mapType){

       case "USA":
       mapTypeColor="#8dd3c7";
       break;    
       case "state":
       mapTypeColor='#7fc97f';
       break;
       case "county":
       mapTypeColor='#bebada';
       break;
       case "congressional":
       mapTypeColor='#FD8D3C';
       break;
       default :
       mapTypeColor='#FFF';
      
         
      
      

    }

    return {
     fillColor: mapTypeColor,
      weight: weight,
      opacity: 1,
      stroke: true,
      color:mapTypeColor,
      dashArray: '2',
      fillOpacity: 0.2
    };
  }
  
  whenClicked=(e) =>{
    // e = event
    console.log(e.target.feature);
    // You can make your ajax call declaration here
    //$.ajax(... 
  }
  
 onEachFeature=(feature, layer)=>{
      //bind click
      
      layer.on({
          click: this.whenClicked
      });
  }
 

  componentDidMount() {
    // create map
    let usmap=L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    })

    this.map = L.map("map", {
      center: [39.73, -104.99],
      zoom: 4,
      layers: [usmap]
      
    });

    // add layer
   
    let county= L.geoJSON(County.default.features,{style:this.mapStyle("county",2),onEachFeature: this.onEachFeature}).addTo(this.map)
    let congressional= L.geoJSON(Congressional.default.features,{style:this.mapStyle("congressional",2)}).addTo(this.map)
    let state= L.geoJSON(States.default.features,{style:this.mapStyle("state",2), onEachFeature: this.onEachFeature}).addTo(this.map)
    let country=L.geoJSON(Usoutline.default.features,{style:this.mapStyle("USA",4)}).addTo(this.map)
    let baseMaps = {
      "US": usmap,
  };
  
  let overlayMaps = {
      "Congressional":congressional,
      "County":county,
      "State":state,
      "Country": country,
  };
  
  // initialize up the L.control.layers
  L.control.layers(baseMaps, overlayMaps).addTo(this.map);
   
  }
  componentDidUpdate() {
    // check if data has changed
   
  }
  render() {
   
    return <div id="map"/>;
  }
}

export default Map;
