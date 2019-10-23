import React from "react";
import L from "leaflet";
import * as Usoutline from "./us_outline.json"
import * as States from "./states.json";
import * as County from "./county.json";
import * as Congressional from "./congressional.json";
import axios from 'axios';




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
    let state,county,url;
    state=e.target.feature.properties.STATE;
    if(e.target.feature.properties.COUNTY!==undefined){
      county=e.target.feature.properties.COUNTY;
      
    url=`https://api.census.gov/data/2013/language?get=EST,LAN7,LANLABEL,NAME&for=county:${county}&in=state:${state}&key=c6b213357c951f788c3eb1916c6d718c59b55a8d`
    }else{

    url=`https://api.census.gov/data/2013/language?get=EST,LAN7,LANLABEL,NAME&for=state:${state}&key=c6b213357c951f788c3eb1916c6d718c59b55a8d`
    
    }
   
    axios.defaults.headers.post['Content-Type'] = 'application/json';

    axios.get(url)
   
    .then(res => {
      const census= res.data;
      let HtmlRender='<div>No Languages Results Found!</div>'
      if(res.data!==""){
      
      HtmlRender="<div>";
      for(let i=0;i<census.length;i++){
        if(i!==0){
         HtmlRender+=`<ol><li>EST Population:${census[i][0]}</li>
         <li>LAN7:${census[i][1]}</li>
         <li>LANLABEL:${census[i][2]}</li>
         <li>NAME:${census[i][3]}</li>
         <li>LOCATION:${census[i][4]}</li>
         </ol>
         <hr>
         `
        }
      }
      HtmlRender+="</div>"
    }
      let popup = L.popup()
    .setLatLng(e.latlng)
    .setContent(HtmlRender)
    .openOn(this.map);
   
    
  }) 
   
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
