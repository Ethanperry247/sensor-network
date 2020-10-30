"use strict";

var _this = void 0;

// Signal power at low power mode by specification: -18dBm
// Antenna gain: 3dB
// 15' 9" with cabinets, tile, or thin metal  + wall in the way - No communication
// 25' w two doors - no communication
// 18' + wall - inconsistant communication
// 24' + glass door (two layers) - no communication
// 46' in the open - no communication
// 13' 1" - multiple walls (3)
var GAIN = 3; // dB - Antenna gain of NRF24L01+ radios.

var POWER = -18; // dBm - Power on low power mode of NRF24L01+ radios.

var FREQUENCY = 2.505; // GHz - operating frequency of the radios.

var MIN_SENSITIVITY = -82; // dBm - minimum sensitivity.

var MAX_PATH_LOSS = POWER - MIN_SENSITIVITY;
var BRICK_WALL_DISTANCE = 3; // ft - cabinets, tile + wall.

var THICK_BARRIER_DISTANCE = 15.75; // 12 // ft - cabinets, tile + wall.

var THIN_BARRIER_DISTANCE = 25; // 22 // ft - thin doors or multiple thin layers of wood.
// const THICK_BARRIER_DISTANCE = 14; // 12 // ft - cabinets, tile + wall.
// const THIN_BARRIER_DISTANCE = 22; // 22 // ft - thin doors or multiple thin layers of wood.

var GLASS_BARRIER_DISTANCE = 24; // ft - glass door (two layers).

var METAL_BARRIER_DISTANCE = 15; // Later of metal surrounding the radio.
// const SINGLE_WALL_DISTANCE = 26; // 19 // ft - gypsum wall.

var SINGLE_WALL_DISTANCE = 19; // 19 // ft - gypsum wall.

var DOUBLE_WALL_DISTANCE = 21; // 15// ft - two gypsum walls.

var TRIPLE_WALLS_DISTANCE = 13.083; // 9 // ft - three gypsum walls.

var OUTDOOR_OPEN_SPACE_DISTANCE = 46; // ft - open field.

var INDOOR_OPEN_SPACE_DISTANCE = 32; // 28// ft - open indoor space with furniture, etc.

var REFERENCE_DISTANCE = 1; // m.

exports.obstruction = {
  "Brick Wall": BRICK_WALL_DISTANCE,
  "Thick Barrier": THICK_BARRIER_DISTANCE,
  "Thin Barrier": THIN_BARRIER_DISTANCE,
  "Glass Barrier": GLASS_BARRIER_DISTANCE,
  "Metal Barrier": METAL_BARRIER_DISTANCE,
  "Single Wall": SINGLE_WALL_DISTANCE,
  "Double Wall": DOUBLE_WALL_DISTANCE,
  "Triple Wall": TRIPLE_WALLS_DISTANCE,
  "Outdoor Open Space": INDOOR_OPEN_SPACE_DISTANCE,
  "Inoor Open Space": OUTDOOR_OPEN_SPACE_DISTANCE
};

exports.toFeet = function (meters) {
  return meters / 0.3048;
};

exports.toMeters = function (feet) {
  return feet * 0.3048;
};

exports.toKilometers = function (feet) {
  return feet * 0.0003048;
};

exports.FreeSpacePathLoss = function (distance, frequency, gain) {
  // Assuming distance in feet, frequency in GHz, and gain in dB.
  return 20 * Math.log10(_this.toKilometers(distance)) + 20 * Math.log10(frequency) - 2 * gain + 92.45;
};

exports.LogPathLoss = function (refDistance, frequency, gain, pathLossExponent, distance) {
  return _this.FreeSpacePathLoss(refDistance, frequency, gain) + 10 * pathLossExponent * Math.log10(distance / refDistance);
};

exports.PathLoss = function (refDistance, frequency, gain, pathLossExponent, distance, attenuation) {
  return _this.LogPathLoss(refDistance, frequency, gain, pathLossExponent, distance) + attenuation;
};

exports.PathLossExponent = function (pathLoss, refDistance, frequency, gain, distance) {
  return (pathLoss - _this.FreeSpacePathLoss(refDistance, frequency, gain)) / (10 * Math.log10(distance / refDistance));
};

exports.Range = function (pathLoss, pathLossExponent, refDistance, frequency, gain, attenuation) {
  return Math.pow(10, (pathLoss - attenuation - _this.FreeSpacePathLoss(refDistance, frequency, gain)) / (10 * pathLossExponent)) * refDistance;
};

exports.OpenSpacePathLoss = (void 0).PathLossExponent(MAX_PATH_LOSS, (void 0).toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, INDOOR_OPEN_SPACE_DISTANCE);
exports.ThickBarrierPathLoss = (void 0).PathLossExponent(MAX_PATH_LOSS, (void 0).toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, THICK_BARRIER_DISTANCE);
exports.ThinBarrierPathLoss = (void 0).PathLossExponent(MAX_PATH_LOSS, (void 0).toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, THIN_BARRIER_DISTANCE);
exports.GlassBarrierPathLoss = (void 0).PathLossExponent(MAX_PATH_LOSS, (void 0).toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, GLASS_BARRIER_DISTANCE);
exports.SingleWallPathLoss = (void 0).PathLossExponent(MAX_PATH_LOSS, (void 0).toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, SINGLE_WALL_DISTANCE);
exports.TripleWallPathLoss = (void 0).PathLossExponent(MAX_PATH_LOSS, (void 0).toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, TRIPLE_WALLS_DISTANCE);
exports.ThickBarrierPowerLoss = (void 0).LogPathLoss((void 0).toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, (void 0).OpenSpacePathLoss, INDOOR_OPEN_SPACE_DISTANCE) - (void 0).LogPathLoss((void 0).toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, (void 0).OpenSpacePathLoss, THICK_BARRIER_DISTANCE);
exports.ThinBarrierPowerLoss = (void 0).LogPathLoss((void 0).toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, (void 0).OpenSpacePathLoss, INDOOR_OPEN_SPACE_DISTANCE) - (void 0).LogPathLoss((void 0).toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, (void 0).OpenSpacePathLoss, THIN_BARRIER_DISTANCE);
exports.BrickBarrierPowerLoss = (void 0).LogPathLoss((void 0).toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, (void 0).OpenSpacePathLoss, INDOOR_OPEN_SPACE_DISTANCE) - (void 0).LogPathLoss((void 0).toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, (void 0).OpenSpacePathLoss, BRICK_WALL_DISTANCE);
exports.WallPowerLoss = (void 0).LogPathLoss((void 0).toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, (void 0).OpenSpacePathLoss, INDOOR_OPEN_SPACE_DISTANCE) - (void 0).LogPathLoss((void 0).toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, (void 0).OpenSpacePathLoss, SINGLE_WALL_DISTANCE);
exports.powerloss = {
  "Thick Barrier": (void 0).ThickBarrierPowerLoss,
  "Thin Barrier": (void 0).ThinBarrierPowerLoss,
  "Brick Barrier": (void 0).BrickBarrierPowerLoss,
  "Single Wall": (void 0).WallPowerLoss
};

exports.getRange = function (attenuation) {
  attenuation = attenuation || 0;
  return _this.Range(MAX_PATH_LOSS, _this.OpenSpacePathLoss, _this.toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, attenuation);
};