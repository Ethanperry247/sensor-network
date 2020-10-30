// Signal power at low power mode by specification: -18dBm
// Antenna gain: 3dB

// 15' 9" with cabinets, tile, or thin metal  + wall in the way - No communication
// 25' w two doors - no communication
// 18' + wall - inconsistant communication
// 24' + glass door (two layers) - no communication
// 46' in the open - no communication
// 13' 1" - multiple walls (3)

const GAIN = 3; // dB - Antenna gain of NRF24L01+ radios.
const POWER = -18; // dBm - Power on low power mode of NRF24L01+ radios.
const FREQUENCY = 2.505; // GHz - operating frequency of the radios.
const MIN_SENSITIVITY = -82; // dBm - minimum sensitivity.
const MAX_PATH_LOSS = POWER - MIN_SENSITIVITY;

const BRICK_WALL_DISTANCE = 3; // ft - cabinets, tile + wall.
const THICK_BARRIER_DISTANCE = 15.75; // 12 // ft - cabinets, tile + wall.
const THIN_BARRIER_DISTANCE = 25; // 22 // ft - thin doors or multiple thin layers of wood.

// const THICK_BARRIER_DISTANCE = 14; // 12 // ft - cabinets, tile + wall.
// const THIN_BARRIER_DISTANCE = 22; // 22 // ft - thin doors or multiple thin layers of wood.

const GLASS_BARRIER_DISTANCE = 24; // ft - glass door (two layers).
const METAL_BARRIER_DISTANCE = 15; // Later of metal surrounding the radio.
// const SINGLE_WALL_DISTANCE = 26; // 19 // ft - gypsum wall.

const SINGLE_WALL_DISTANCE = 19; // 19 // ft - gypsum wall.

const DOUBLE_WALL_DISTANCE = 21; // 15// ft - two gypsum walls.
const TRIPLE_WALLS_DISTANCE = 13.083; // 9 // ft - three gypsum walls.
const OUTDOOR_OPEN_SPACE_DISTANCE = 46; // ft - open field.
const INDOOR_OPEN_SPACE_DISTANCE = 32; // 28// ft - open indoor space with furniture, etc.
const REFERENCE_DISTANCE = 1; // m.

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
    "Inoor Open Space": OUTDOOR_OPEN_SPACE_DISTANCE,
};

exports.toFeet = (meters) => {
    return meters / 0.3048;
};

exports.toMeters = (feet) => {
    return feet * 0.3048;
};

exports.toKilometers = (feet) => {
    return feet * 0.0003048;
};

exports.FreeSpacePathLoss = (distance, frequency, gain) => { // Assuming distance in feet, frequency in GHz, and gain in dB.
    return 20 * Math.log10(this.toKilometers(distance)) + 20 * Math.log10(frequency) - 2 * gain + 92.45;
};

exports.LogPathLoss = (refDistance, frequency, gain, pathLossExponent, distance) => {
    return this.FreeSpacePathLoss(refDistance, frequency, gain) + 10 * pathLossExponent * Math.log10(distance / refDistance);
};

exports.PathLoss = (refDistance, frequency, gain, pathLossExponent, distance, attenuation) => {
    return this.LogPathLoss(refDistance, frequency, gain, pathLossExponent, distance) + attenuation;
};

exports.PathLossExponent = (pathLoss, refDistance, frequency, gain, distance) => {
    return (pathLoss - this.FreeSpacePathLoss(refDistance, frequency, gain)) / (10 * Math.log10(distance / refDistance));
};

exports.Range = (pathLoss, pathLossExponent, refDistance, frequency, gain, attenuation) => {
    return (Math.pow(10, ((pathLoss - attenuation) - this.FreeSpacePathLoss(refDistance, frequency, gain)) / (10 * pathLossExponent))) * refDistance;
};

exports.OpenSpacePathLoss = this.PathLossExponent(MAX_PATH_LOSS, this.toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, INDOOR_OPEN_SPACE_DISTANCE);
exports.ThickBarrierPathLoss = this.PathLossExponent(MAX_PATH_LOSS, this.toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, THICK_BARRIER_DISTANCE);
exports.ThinBarrierPathLoss = this.PathLossExponent(MAX_PATH_LOSS, this.toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, THIN_BARRIER_DISTANCE);
exports.GlassBarrierPathLoss = this.PathLossExponent(MAX_PATH_LOSS, this.toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, GLASS_BARRIER_DISTANCE);
exports.SingleWallPathLoss = this.PathLossExponent(MAX_PATH_LOSS, this.toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, SINGLE_WALL_DISTANCE);
exports.TripleWallPathLoss = this.PathLossExponent(MAX_PATH_LOSS, this.toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, TRIPLE_WALLS_DISTANCE);


exports.ThickBarrierPowerLoss = this.LogPathLoss(this.toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, this.OpenSpacePathLoss, INDOOR_OPEN_SPACE_DISTANCE) - 
    this.LogPathLoss(this.toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, this.OpenSpacePathLoss, THICK_BARRIER_DISTANCE);
exports.ThinBarrierPowerLoss = this.LogPathLoss(this.toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, this.OpenSpacePathLoss, INDOOR_OPEN_SPACE_DISTANCE) - 
    this.LogPathLoss(this.toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, this.OpenSpacePathLoss, THIN_BARRIER_DISTANCE);
exports.BrickBarrierPowerLoss = this.LogPathLoss(this.toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, this.OpenSpacePathLoss, INDOOR_OPEN_SPACE_DISTANCE) - 
    this.LogPathLoss(this.toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, this.OpenSpacePathLoss, BRICK_WALL_DISTANCE);
exports.WallPowerLoss = this.LogPathLoss(this.toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, this.OpenSpacePathLoss, INDOOR_OPEN_SPACE_DISTANCE) - 
    this.LogPathLoss(this.toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, this.OpenSpacePathLoss, SINGLE_WALL_DISTANCE);



exports.powerloss = {
    "Thick Barrier": this.ThickBarrierPowerLoss,
    "Thin Barrier": this.ThinBarrierPowerLoss,
    "Brick Barrier": this.BrickBarrierPowerLoss,
    "Single Wall": this.WallPowerLoss,
};

exports.getRange = (attenuation) => {
    attenuation = attenuation || 0;
    return this.Range(MAX_PATH_LOSS, this.OpenSpacePathLoss, this.toFeet(REFERENCE_DISTANCE), FREQUENCY, GAIN, attenuation);
};