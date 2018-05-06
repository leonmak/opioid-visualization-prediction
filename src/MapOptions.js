/**
 * Created by leonmak on 5/5/18.
 */
export const mortalityRate = 'death_perpop';
export const opioidDepRate = 'opioid_prescribe_perc';
export const opioidSpike = 'opioid_spike';

export const mapOptions = [{
  name: 'Overdose Death Rate',
  description: 'Estimated Death Rate due to overdose per county',
  property: mortalityRate,
  stops: [
    [0, '#b2adaa'],
    [0.000100, '#ffe0b8'],
    [0.001000, '#febb94'],
    [0.005000, '#ff9676'],
    [0.010000, '#ff6862'],
    [0.050000, '#ee4355'],
    [0.100000, '#d31f47'],
    [0.500000, '#b1052c'],
    [1.000000, '#8b0104']
  ]}, {
  name: 'Opioid Prescription Percent',
  description: 'Proportion of population prescribed opioids',
  property: opioidDepRate,
  stops: [
    [0, '#b2adaa'],
    [0.0100, '#EED322'],
    [0.1000, '#E6B71E'],
    [0.5000, '#DA9C20'],
    [1.0000, '#CA8323'],
    [5.0000, '#B86B25'],
    [10, '#A25626'],
    [50, '#8B4225'],
    [100, '#723122']
  ]}, {
  name: 'Predicted Overdose Spikes (2019)',
  description: 'Predicted statistically significant increase in overdose death rate',
  property: opioidSpike,
  stops: [
    [0.02, '#6e5656'],
    [0.98, '#8b0104']
  ]}
];
