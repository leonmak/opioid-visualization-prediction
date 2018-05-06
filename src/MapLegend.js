import React from 'react'
import {opioidSpike} from './MapOptions'

export const MapLegend = (props) => {
  const { name, description, stops } = props.active;
  const renderLegendKeys = (stop, i) => {
    return (
      <div key={i} className='txt-s'>
        <span className='mr6 round-full w12 h12 inline-block align-middle' style={{ backgroundColor: stop[1] }} />
        <span>{`${props.active.property !== opioidSpike
          ? (stop[0] ? stop[0] :'No data available')
          : (stop[0] === 0.98 ? 'At risk of spike': 'Below threshold')}`}</span>
      </div>
    );
  };

  return (
    <div>
      <div className="bg-white absolute bottom right mr12 mb24 py12 px12 shadow-darken10 round z1 wmax180">
        <div className='mb6'>
          <h2 className="txt-bold txt-s block">{name}</h2>
          <p className='txt-s color-gray'>{description}</p>
        </div>
        {stops.map(renderLegendKeys)}
      </div>
    </div>
  );
};
