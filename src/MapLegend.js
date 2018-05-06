import React from 'react'
import {mapOptions as options} from './MapOptions'

export const MapLegend = (props) => {
  const { name, description, stops, property } = props.active;
  const renderLegendKeys = (stop, i) => {
    return (
      <div key={i} className='txt-s'>
        <span className='mr6 round-full w12 h12 inline-block align-middle' style={{ backgroundColor: stop[1] }} />
        <span>{`${stop[0].toLocaleString()}`}</span>
      </div>
    );
  }

  const renderOptions = (option, i) => {
    return (
      <label key={i} className="toggle-container">
        <input onChange={() => this.setState({ active: options[i] })} checked={option.property === property} name="toggle" type="radio" />
        <div className="toggle txt-s py3 toggle--active-white">{option.name}</div>
      </label>
    );
  }

  return (
    <div>
      <div className="toggle-group absolute top left ml12 mt12 border border--2 border--white bg-white shadow-darken10 z1">
        {options.map(renderOptions)}
      </div>
      <div className="bg-white absolute bottom right mr12 mb24 py12 px12 shadow-darken10 round z1 wmax180">
        <div className='mb6'>
          <h2 className="txt-bold txt-s block">{name}</h2>
          <p className='txt-s color-gray'>{description}</p>
        </div>
        {stops.map(renderLegendKeys)}
      </div>
    </div>
  );
}


