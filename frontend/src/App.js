import React from 'react';
import { render } from 'react-dom';
import Map from './Map';


class App extends React.Component {
  
  render() {
    
    return (
      <div className="App">
       
        <Map/>
        <div class="loader">Loading...</div>
      </div>
    );
  }
}

export default App;
