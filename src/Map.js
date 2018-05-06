import React from 'react'
import MapboxGl from 'mapbox-gl/dist/mapbox-gl.js'  // Use raw source instead of wrapper

import 'mapbox-gl/dist/mapbox-gl.css'  // Adds popup css
import './Map.css'

import countyGeoJson from './data/us_counties.json'
import {mapOptions, mortalityRate, opioidDepRate} from './MapOptions'
import {MapLegend} from './MapLegend'

class Map extends React.Component {
  state = {
    countyName: '',
    countyCount: 0,
    populationSum: 0,
    active: mapOptions[0]
  };

  componentDidMount() {
    MapboxGl.accessToken = 'pk.eyJ1IjoibGVvbm1hayIsImEiOiJkNzQ3YWVlZDczYjMxNjhhMjVhZWI4OWFkM2I2MWUwOCJ9.uL_x_vTDIse10HSvMb6XIg';

    this.mapCountyDataId = 'mapCountyDataId';

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

      const hydratedGeoJson = this.getHydratedGeoJson(this.props.year);

      this.map.addSource(this.mapCountyDataId, {
        type: 'geojson',
        data: hydratedGeoJson
      });

      this.map.addLayer({
        "id": this.mapCountyDataId, // id to style
        "source": this.mapCountyDataId,
        "type": "fill",
        "paint": {
          "fill-outline-color": "#2a2928",
          "fill-opacity": 0.75
        },
      }, 'counties');

      this.setFill();

      let popup = new MapboxGl.Popup({ closeButton: false });

      // show popup on mouseover, remove on mouseleave
      this.map.on('mousemove', 'counties', (e) => {
        try { // query may fail

        // Change the cursor style as a UI indicator.
        this.map.getCanvas().style.cursor = 'pointer';

        // Single out the first found feature.
        let feature = e.features[0];

        // Use FIPS to get selected county (county names may be duplicated)
        const bbox = [[e.point.x - 1, e.point.y - 1], [e.point.x + 1, e.point.y + 1]];
        const countiesQueried = this.map.queryRenderedFeatures(bbox, { layers: ['counties'] });
        const fipsFilter = countiesQueried.reduce((acc, feature) => {
          acc.push(feature.properties.FIPS);
          return acc;
        }, ['in', 'FIPS']);
        this.map.setFilter("counties-highlighted", fipsFilter);

        if (countiesQueried.length > 0) {
          const selectedCounty = countiesQueried[0].properties;

          // TODO: Get county data uid FIPS to display in sidebar

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

  setFill() {
    const { property, stops } = this.state.active;
    this.map.setPaintProperty(this.mapCountyDataId, 'fill-color', { property, stops });
  }

  // Add in feature properties
  getHydratedGeoJson(year) {
    // Get mortality rate and dependency for the given year
    const copyCountyGeoJson = Object.assign({}, countyGeoJson);
    copyCountyGeoJson['features'].forEach((feature, idx, featuresArr) => {
      const countyCode = feature.properties['STATE'] + feature.properties['COUNTY'];
      featuresArr[idx]['properties'][mortalityRate] = parseInt(countyCode, 10) / 1000000 + Math.random(); // TODO: Change this
      featuresArr[idx]['properties'][opioidDepRate] = parseInt(countyCode, 10) / 2000000 + Math.random(); // TODO: Change this
    });
    return copyCountyGeoJson
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.year !== this.props.year
  }

  componentDidUpdate(prevProps) {
    // TODO: Update counties based on slider year
    console.log('year changed from', prevProps.year, 'to: ', this.props.year);
    const hydratedGeoJson = this.getHydratedGeoJson(this.props.year);
    this.map.getSource(this.mapCountyDataId).setData(hydratedGeoJson);
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
        <MapLegend active={this.state.active} />
      </div>
  }
}

export default Map