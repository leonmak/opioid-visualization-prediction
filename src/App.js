import React, { Component } from 'react';
import Map from './Map'
import Slider from 'react-rangeslider'

import 'react-rangeslider/lib/index.css'

class App extends Component {
  state = {
    year: 2011,
  };

  componentDidMount() {
    // TODO: Get year data

  }


  render() {
    return (
      <div className="App">
        <Map year={this.state.year} />
        <Slider
          min={2011}
          max={2015}
          tooltip={true}
          value={this.state.year}
          onChange={this.handleChangeYear}
        />

      </div>
    );
  }
}

export default App;
