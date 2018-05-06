/**
 * Created by leonmak on 5/5/18.
 */
export const mortalityRate = 'OPIOID_MORTALITY_RATE';
export const opioidDepRate = 'OPIOID_DEPENDENCY_RATE';

export const mapOptions = [{
  name: 'Mortality Rate',
  description: 'Estimated Mortality',
  property: mortalityRate,
  stops: [
    [0, '#F2F12D'],
    [0.000100, '#EED322'],
    [0.001000, '#E6B71E'],
    [0.005000, '#DA9C20'],
    [0.010000, '#CA8323'],
    [0.050000, '#B86B25'],
    [0.100000, '#A25626'],
    [0.500000, '#8B4225'],
    [1.000000, '#723122']
  ]}, {
  name: 'Dependency Rate',
  description: 'Estimate Dependency Rate',
  property: opioidDepRate,
  stops: [
    [0, '#F2F12D'],
    [0.000100, '#EED322'],
    [0.001000, '#E6B71E'],
    [0.005000, '#DA9C20'],
    [0.010000, '#CA8323'],
    [0.050000, '#B86B25'],
    [0.100000, '#A25626'],
    [0.500000, '#8B4225'],
    [1.000000, '#723122']
  ]
}];
