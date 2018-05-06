import React from 'react'
import MapboxGl from 'mapbox-gl/dist/mapbox-gl.js'  // Use raw source instead of wrapper

import 'mapbox-gl/dist/mapbox-gl.css'  // Adds popup css
import './Map.css'

class Map extends React.Component {
  state = {
    countyName: '',
    countyCount: 0,
    populationSum: 0
  };

  componentDidMount() {
    MapboxGl.accessToken = 'pk.eyJ1IjoibGVvbm1hayIsImEiOiJkNzQ3YWVlZDczYjMxNjhhMjVhZWI4OWFkM2I2MWUwOCJ9.uL_x_vTDIse10HSvMb6XIg';
    this.map = new MapboxGl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-98, 38.88],
      minZoom: 2,
      zoom: 3
    });

    this.map.on('load', () => {

      this.map.addSource('counties', {
        "type": "vector",
        "url": "mapbox://mapbox.82pkq93d"
      });

      this.map.addLayer({
        "id": "counties",
        "type": "fill",
        "source": "counties",
        "source-layer": "original",
        "paint": {
          "fill-outline-color": "rgba(0,0,0,0.1)",
          "fill-color": "rgba(0,0,0,0.1)"
        }
      }, 'place-city-sm'); // Place polygon under these labels.

      this.map.addLayer({
        "id": "counties-highlighted",
        "type": "fill",
        "source": "counties",
        "source-layer": "original",
        "paint": {
          "fill-outline-color": "#2a2928",
          "fill-color": "#545356",
          "fill-opacity": 0.75
        },
        "filter": ["in", "FIPS", ""]

      }, 'place-city-sm'); // Place polygon under these labels.

      let popup = new MapboxGl.Popup({ closeButton: false });

      // show popup on mouseover, remove on mouseleave
      this.map.on('mousemove', 'counties', (e) => {
        try { // query may fail

        // Change the cursor style as a UI indicator.
        this.map.getCanvas().style.cursor = 'pointer';

        // Single out the first found feature.
        let feature = e.features[0];

        // Use FIPS to get selected county (county names may be duplicated)
        const bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
        const countiesQueried = this.map.queryRenderedFeatures(bbox, { layers: ['counties'] });
        const fipsFilter = countiesQueried.reduce((acc, feature) => {
          acc.push(feature.properties.FIPS);
          return acc;
        }, ['in', 'FIPS']);
        this.map.setFilter("counties-highlighted", fipsFilter);

        if (countiesQueried.length > 0) {
          const selectedCounty = countiesQueried[0].properties;

          // TODO: Add county data uid FIPS

          this.setState({selectedCounty});
        }

        // Display a popup with the name of the county
        popup.setLngLat(e.lngLat)
          .setText(feature.properties.COUNTY)
          .addTo(this.map);

        } catch (e) {
          console.log(e)
        }
      });

      this.map.on('mouseleave', 'counties', () => {
        this.map.getCanvas().style.cursor = '';
        popup.remove();
        this.map.setFilter('counties-highlighted', ['in', 'FIPS', '']);
        this.setState({selectedCounty: {}})
      });

    })
  }

  componentWillUnmount() {
    this.map.remove();
  }

  componentDidUpdate(prevProps, prevState) {

    // TODO: Update counties based on slider year

  }

  render() {
    const style = {
      position: 'absolute',
        top: 0,
        bottom: 0,
        width: '100%'
    };

    return <div>
        <div style={style} ref={el => this.mapContainer = el} />
      </div>
  }
}

export default Map