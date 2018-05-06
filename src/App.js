import React, { Component } from 'react';
import Map from './Map'

class App extends Component {
  state = {
    year: '2011',
  };

  componentDidMount() {
    // TODO: Get year data

  }
  render() {
    return (
      <div className="App">
        <Map year={this.state.year} />
      </div>
    );
  }
}

export default App;
