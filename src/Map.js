import React from 'react'
import MapboxGl from 'mapbox-gl/dist/mapbox-gl.js'

class Map extends React.Component {
  componentDidMount() {
    MapboxGl.accessToken = 'pk.eyJ1IjoibGVvbm1hayIsImEiOiJkNzQ3YWVlZDczYjMxNjhhMjVhZWI4OWFkM2I2MWUwOCJ9.uL_x_vTDIse10HSvMb6XIg';
    this.map = new MapboxGl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    const style = {
      position: 'absolute',
        top: 0,
        bottom: 0,
        width: '100%'
    };

    return <div style={style} ref={el => this.mapContainer = el} />;
  }
}

export default Map