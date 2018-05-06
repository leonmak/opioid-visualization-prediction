import React from 'react'
import MapboxGl from 'mapbox-gl/dist/mapbox-gl.js'  // Use raw source instead of wrapper
import Slider from 'react-rangeslider'

import 'mapbox-gl/dist/mapbox-gl.css'  // Adds popup css
import './Map.css'

import countyGeoJson from './data/us_counties.json'
import {mapOptions, mortalityRate, opioidDepRate} from './MapOptions'
import {MapLegend} from './MapLegend'
import {Sidebar} from './Sidebar'

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: mapOptions[0]
    };
  }

  componentDidMount() {
    MapboxGl.accessToken = 'pk.eyJ1IjoibGVvbm1hayIsImEiOiJkNzQ3YWVlZDczYjMxNjhhMjVhZWI4OWFkM2I2MWUwOCJ9.uL_x_vTDIse10HSvMb6XIg';

    this.mapCountyDataId = 'mapCountyDataId';

    this.map = new MapboxGl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [-98, 38.88],
      minZoom: 2,
      zoom: 3
    });

    this.map.on('load', () => {

      this.map.addSource('counties', {
        "type": "vector",
        "url": "mapbox://mapbox.82pkq93d"
      });

      const hydratedGeoJson = this.getHydratedGeoJson(this.state.year);
      this.map.addSource(this.mapCountyDataId, {
        type: 'geojson',
        data: hydratedGeoJson
      });

      this.data = hydratedGeoJson;

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

      this.map.addLayer({
        "id": this.mapCountyDataId, // id to style
        "source": this.mapCountyDataId,
        "type": "fill",
        "paint": {
          "fill-outline-color": "#2a2928",
          "fill-opacity": 0.75
        },
      }, 'place-city-sm');

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
          const county = countiesQueried[0].properties;

          // TODO: Get county data uid FIPS to display in sidebar
          this.setState({county});

          // Display a popup with the name of the county and data
          const fips = feature.properties.FIPS.toString();
          const countyData = this.data.features.filter((feat) => {
            const fipsCode = feat.properties['STATE'] + feat.properties['COUNTY'];
            return fipsCode === fips
          }).pop();
          if (!!countyData){
            const data = countyData.properties[this.state.active.property];
            const isMortalityRate = this.state.active.property === mortalityRate;
            const dataRounded = isMortalityRate ? data.toFixed(5) : data.toFixed(2);
            const dataText = `${dataRounded}. Acc: ${(Math.random()*100).toFixed(2)}%`;
            popup.setLngLat(e.lngLat)
              .setText(`${feature.properties.COUNTY}: ${data ? dataText : 'No Data'}`)
              .addTo(this.map);
          }
        }

        } catch (e) {
          console.log(e)
        }
      });

      this.map.on('mouseleave', 'counties', () => {
        this.map.getCanvas().style.cursor = '';
        popup.remove();
        this.map.setFilter('counties-highlighted', ['in', 'FIPS', '']);
        this.setState({county: null})
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
      // TODO: Replace random with data[this.state.year].mortality[countyCode]
      const random = Math.random();
      featuresArr[idx]['properties'][mortalityRate] = random / 100 < 0.001 ? 0 : random / 100;
      featuresArr[idx]['properties'][opioidDepRate] = parseInt(countyCode, 10) / 10000;
    });
    return copyCountyGeoJson
  }

  shouldComponentUpdate(nextProps, nextState) {
    const newCounty = !!nextState.county && !!this.state.county
      && nextState.county.COUNTY !== this.state.county.COUNTY;
    const newData = !!nextState.active && !!this.state.active
      && nextState.active.name !== this.state.active.name;
    const newYear = nextState.year !== this.state.year;
    return newYear || newCounty || newData
  }

  componentDidUpdate(prevProps, prevState) {
    // TODO: Update counties based on slider year
    const selectedNewYear = prevState.year !== this.state.year;
    if (selectedNewYear) {
      // console.log('year changed from', prevState.year, 'to: ', this.state.year);
      const hydratedGeoJson = this.getHydratedGeoJson(this.state.year);
      this.map.getSource(this.mapCountyDataId).setData(hydratedGeoJson);
    }
    !!prevState.active && !!this.state.active
      && prevState.active.name !== this.state.active.name
      && this.setFill()
  }

  handleChangeYear = year => this.setState({year});

  render() {
    const style = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%'
    };

    const renderOptions = (option, i) => {
      return (
        <label key={i} className="toggle-container">
          <input onChange={() => this.setState({ active: mapOptions[i] })}
                 checked={option.name === this.state.active.name}
                 name="toggle" type="radio" />
          <div className="toggle txt-s py3 toggle--active-white">{option.name}</div>
        </label>
      );
    };

    const yearLabels = (min=2011, max=2016) => {
      const labels = {};
      for (let i = 2011; i <= max; i++) {
        labels[i] = i
      }
      return labels
    };

    return (
      <div>
        <div style={style} ref={el => this.mapContainer = el} />

        <div className="map-title align-center">
          <h1 className="bg-white absolute top txt-m txt-bold mr12 mb24 py12 px12 shadow-darken10 round z1 wmax240">
            Opioid Crisis Predictor
          </h1>
        </div>

        <div className="toggle-group absolute top left ml12 mt12 border border--2 border--white bg-white shadow-darken10 z1">
          {mapOptions.map(renderOptions)}
        </div>

        <div className="slider-container shadow-darken10 round z1">
          <Slider min={2011} max={2016}
                  labels={yearLabels()}
                  value={this.state.year}
                  onChange={this.handleChangeYear}
          />
        </div>

        <MapLegend active={this.state.active} />
        {!!this.state.county &&
          <Sidebar county={this.state.county}
                   active={this.state.active} />
        }
      </div>
    )
  }
}

export default Map