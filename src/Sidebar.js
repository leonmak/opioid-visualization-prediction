/**
 * Created by leonmak on 5/5/18.
 */
import React from 'react'

const options = {
  'opioidType': ['Natural & Semisynthetic', 'Synthetic', 'Methadone', 'Heroin'],
  'ageGroup': ['0-24', '25-34',	'35-44', '45-54', '55+'],
  'race': ['White Non-Hispanic', 'White Non-Hispanic', 'Black Non-Hispanic', 'Hispanic'],
};

const mockCategory = (type) => {
  return options[type][Math.floor(Math.random() * Object.keys(options).length)+1];
};

export const Sidebar = (props) => (
  <div className='viewport-full relative scroll-hidden' style={{pointerEvents: 'none'}}>
    <div className='bg-darken10 viewport-twothirds viewport-full-ml absolute top right right bottom' />
    <div className='absolute top-ml right bottom z1 w-full w240-ml px12 py12-ml'>
      <div className='flex-parent flex-parent--column viewport-third h-auto-ml hmax-full bg-white round-ml shadow-darken10'>
        <div className='px12 py12 scroll-auto'>
          <h3 className='txt-m txt-bold mb6'>{props.county.COUNTY}</h3>

          { props.active.name === 'Opioid Prescription Rate' ? <div>
            <h4 className='txt-m txt-bold'>Most common opioid type: </h4>
            <h5 className='txt-s mb6'>{props.county.opioidType || mockCategory('opioidType')}</h5>
          </div> : <div>
            <p className="txt-m txt-bold mb6">Overdose Death</p>
            <h4 className='txt-s txt-bold'>Largest age group</h4>
            <h5 className='txt-xs mb6'>{props.county.ageGroup || mockCategory('ageGroup')}</h5>
            <h4 className='txt-s txt-bold'>Modal race</h4>
            <h5 className='txt-xs mb6'>{props.county.race || mockCategory('race')}</h5>
            <h4 className='txt-s txt-bold '>Male cases</h4>
            <h5 className='txt-xs mb6'>{props.county.males || (Math.random() * 200).toFixed(0)}</h5>
            <h4 className='txt-s txt-bold'>Female cases</h4>
            <h5 className='txt-xs mb6'>{props.county.males || (Math.random() * 50).toFixed(0)}</h5>
          </div> }
        </div>
        <footer className='px12 py12 bg-gray-faint round-b-ml txt-s'>
          { props.active.name === 'Opioid Prescription Rate'
            ? <div>Estimated spending: {props.county.estimatedCost || (Math.random() * 2).toFixed(2)} Million USD </div>
            : <div>Estimated cost: {props.county.estimatedCost || (Math.random() * 2).toFixed(2)} Million USD </div>
          }
        </footer>
      </div>
    </div>
  </div>
);
