import React from 'react';
import { render } from 'react-dom';
import Map from './Map';

class App extends React.Component {
  state = {
    markersData: [
      { latLng: { lat: 49.8419, lng: 24.0315 }, title: 1 }
    ]
  };
  addMarker = () => {
    const { markersData } = this.state;
    const lastMarker = markersData[markersData.length - 1];

    this.setState({
      markersData: [
        ...markersData,
        {
          title: +lastMarker.title + 1,
          latLng: {
            lat: lastMarker.latLng.lat + 0.0001,
            lng: lastMarker.latLng.lng + 0.0001,
          }
        }
      ]
    });
  };
  render() {
    const { markersData } = this.state;
    return (
      <div className="App">
        <Map markersData={markersData} />
               
      </div>
    );
  }
}

export default App;
