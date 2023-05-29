const ONE_MM = 10;
const ONE_CM = ONE_MM * 10;

// 1000 = 10 cm 
var global = {
  width: 10 * ONE_CM,
  height: 10 * ONE_CM,
  outlineMargin: 2 * ONE_MM,
  strokeWeight: 5,
}

// Generate a random number between 1-100
var seedSetting = Math.floor(Math.random() * 100);
// seedSetting = 44; // Debug override
console.log("Seed: " + seedSetting);
var seed = seedSetting;

// Generate a random number using a seed, then use that number to 
// generate a random number between min and max
// https://stackoverflow.com/a/19303725/58456
function randomSeedMinMax(seed, min, max) {
  seed += 1;
  var x = Math.sin(seed) * 10000;
  // Min/Max is inclusive  
  x = min + (x - Math.floor(x)) * (max - min);
  // Round to 1 decimal place
  // return Math.round(x * 10) / 10;
  return Math.floor(x);
}






function DrawMushroomCap(x, y, mushroom, outline = false, debug = false) {


  // Top of the mushroom cap
  // ----------------------------------------------------------
  // Left side edge of the mushroom cap
  let mushroomCap_first_anchor_point = {
    x: x - (mushroom.cap.width / 2) - mushroom.cap.ringMargin / 2,
    y: y
  }; // Red 
  let mushroomCap_first_control_point = {
    x: mushroomCap_first_anchor_point.x + (mushroom.cap.width / mushroom.cap.squash) + mushroom.cap.tilt,
    y: (global.height / 2) - mushroom.cap.tall
  }; // Green

  // Right side edge of the mushroom cap
  let mushroomCap_second_anchor_point = {
    x: x + (mushroom.cap.width / 2) + mushroom.cap.ringMargin / 2,
    y: y
  }; // Blue
  let mushroomCap_second_control_point = {
    x: mushroomCap_second_anchor_point.x - (mushroom.cap.width / mushroom.cap.squash) + mushroom.cap.tilt,
    y: mushroomCap_first_control_point.y
  }; // Light blue

  bezier(
    mushroomCap_first_anchor_point.x, mushroomCap_first_anchor_point.y, mushroomCap_first_control_point.x, mushroomCap_first_control_point.y,
    mushroomCap_second_control_point.x, mushroomCap_second_control_point.y, mushroomCap_second_anchor_point.x, mushroomCap_second_anchor_point.y
  );

  // Large bottom of the mushroom ellipse 
  // ----------------------------------------------------------
  ellipse(x, y, mushroom.cap.width + mushroom.cap.ringMargin, mushroom.cap.height + mushroom.cap.ringMargin);
  if (!outline) {
    ellipse(x, y, mushroom.cap.width, mushroom.cap.height);
  }


  // Debug 
  if (debug) {
    fill(color(255, 0, 0)); // Red 
    circle(mushroomCap_first_anchor_point.x, mushroomCap_first_anchor_point.y, 20);
    fill(color(0, 0, 255)); // Blue
    circle(mushroomCap_first_control_point.x, mushroomCap_first_control_point.y, 20);
    fill(color(0, 255, 0)); // Green
    circle(mushroomCap_second_control_point.x, mushroomCap_second_control_point.y, 20);
    fill(color(0, 255, 255)); // light blue
    circle(mushroomCap_second_anchor_point.x, mushroomCap_second_anchor_point.y, 20);
  }


}

// Starting from the mushroomStem cycle outwards to the mushroom cap with bezier curves
// DrawMushroomGills(x, y, mushroomCapWidth, mushroomCapHeight, mushroomStemWidth, mushroomStemHeight, gills) {
function DrawMushroomGills(x, y, mushroom) {

  // Smaller circle on the bottom of the mushroom cap
  // ----------------------------------------------------------
  fill(color(255, 255, 255)); // White 
  ellipse(x, y, mushroom.stem.width, mushroom.cap.height / 3);

  for (let gillOffset = 0; gillOffset < mushroom.gills.count; gillOffset++) {
    const mushroomCapEllipsePointOffset = (mushroom.gills.curveAmount / 10) * mushroom.gills.direction;


    // Find a point on a ellipse of the mushroom cap. 
    // Each gill should be evenly spaced around the mushroom cap
    mushroomStemEllipsePoint = {
      x: x + (mushroom.stem.width / 2) * cos(gillOffset * TWO_PI / mushroom.gills.count),
      y: y + (mushroom.cap.height / 3 / 2) * sin(gillOffset * TWO_PI / mushroom.gills.count)
    };

    let mushroomCapEllipsePoint = {
      x: x + (mushroom.cap.width / 2) * cos(gillOffset * TWO_PI / mushroom.gills.count + mushroomCapEllipsePointOffset),
      y: y + (mushroom.cap.height / 2) * sin(gillOffset * TWO_PI / mushroom.gills.count + mushroomCapEllipsePointOffset)
    };

    // The control point should be in the center of the two other points
    mushroomCapEllipseControlPoint = {
      x: (x + (mushroom.cap.width / 2) * cos(gillOffset * TWO_PI / mushroom.gills.count) + mushroomStemEllipsePoint.x) / 2,
      y: (y + (mushroom.cap.height / 2) * sin(gillOffset * TWO_PI / mushroom.gills.count) + mushroomStemEllipsePoint.y) / 2
    };

    mushroomStemEllipseControlPoint = {
      x: mushroomCapEllipseControlPoint.x,
      y: mushroomCapEllipseControlPoint.y
    }

    noFill();
    bezier(
      mushroomCapEllipsePoint.x, mushroomCapEllipsePoint.y, mushroomCapEllipseControlPoint.x, mushroomCapEllipseControlPoint.y,
      mushroomStemEllipseControlPoint.x, mushroomStemEllipseControlPoint.y, mushroomStemEllipsePoint.x, mushroomStemEllipsePoint.y
    );

    // // Debug 
    // fill(color(255, 0, 0)); // Red 
    // circle(mushroomCapEllipsePoint.x, mushroomCapEllipsePoint.y, 20);
    // fill(color(0, 0, 255)); // Blue
    // circle(mushroomStemEllipsePoint.x, mushroomStemEllipsePoint.y, 20);
    // fill(color(0, 255, 0)); // Green
    // circle(mushroomCapEllipseControlPoint.x, mushroomCapEllipseControlPoint.y, 20);
    // fill(color(0, 255, 255)); // light blue
    // circle(mushroomStemEllipseControlPoint.x, mushroomStemEllipseControlPoint.y, 20);
  }
}

function DrawMushroomStem2(x, y, mushroom) {

  // Stem length
  // ----------------------------------------------------------
  const mushroom_stem_width = mushroom.stem.width * .85;

  // Stem bottom
  // ----------------------------------------------------------
  // Left side edge of the mushroom cap
  let MushroomBase_first_anchor_point = {
    x: (x) - ((mushroom_stem_width) / 2),
    y: y
  }; // Red 
  let MushroomBase_first_control_point = {
    x: MushroomBase_first_anchor_point.x + mushroom.stem.tilt,
    y: y + mushroom.stem.height
  }; // Green

  // Right side edge of the mushroom cap
  let MushroomBase_second_anchor_point = {
    x: (x) + ((mushroom_stem_width) / 2),
    y: y
  }; // Blue
  let MushroomBase_second_control_point = {
    x: MushroomBase_first_anchor_point.x + (mushroom_stem_width) + mushroom.stem.tilt,
    y: MushroomBase_first_control_point.y
  }; // Light blue

  bezier(
    MushroomBase_first_anchor_point.x, MushroomBase_first_anchor_point.y, MushroomBase_first_control_point.x, MushroomBase_first_control_point.y,
    MushroomBase_second_control_point.x, MushroomBase_second_control_point.y, MushroomBase_second_anchor_point.x, MushroomBase_second_anchor_point.y
  );

  // Debug 
  // fill(color(255, 0, 0)); // Red 
  // circle(MushroomBase_first_anchor_point.x, MushroomBase_first_anchor_point.y, 20);
  // fill(color(0, 255, 0)); // Green
  // circle(MushroomBase_first_control_point.x, MushroomBase_first_control_point.y, 20);
  // fill(color(0, 0, 255)); // Blue
  // circle(MushroomBase_second_anchor_point.x, MushroomBase_second_anchor_point.y, 20);
  // fill(color(0, 255, 255)); // Light blue 
  // circle(MushroomBase_second_control_point.x, MushroomBase_second_control_point.y, 20);
}





function DrawMushroomStem2(x, y, mushroom) {

  // Stem length
  // ----------------------------------------------------------
  const mushroom_stem_width = mushroom.stem.width * .85;

  // Stem bottom
  // ----------------------------------------------------------
  // Left side edge of the mushroom cap
  let MushroomBase_first_anchor_point = {
    x: (x) - ((mushroom_stem_width) / 2),
    y: y
  }; // Red 
  let MushroomBase_first_control_point = {
    x: MushroomBase_first_anchor_point.x + mushroom.stem.tilt,
    y: y + mushroom.stem.height
  }; // Green

  // Right side edge of the mushroom cap
  let MushroomBase_second_anchor_point = {
    x: (x) + ((mushroom_stem_width) / 2),
    y: y
  }; // Blue
  let MushroomBase_second_control_point = {
    x: MushroomBase_first_anchor_point.x + (mushroom_stem_width) + mushroom.stem.tilt,
    y: MushroomBase_first_control_point.y
  }; // Light blue

  bezier(
    MushroomBase_first_anchor_point.x, MushroomBase_first_anchor_point.y, MushroomBase_first_control_point.x, MushroomBase_first_control_point.y,
    MushroomBase_second_control_point.x, MushroomBase_second_control_point.y, MushroomBase_second_anchor_point.x, MushroomBase_second_anchor_point.y
  );

  // Debug 
  // fill(color(255, 0, 0)); // Red 
  // circle(MushroomBase_first_anchor_point.x, MushroomBase_first_anchor_point.y, 20);
  // fill(color(0, 255, 0)); // Green
  // circle(MushroomBase_first_control_point.x, MushroomBase_first_control_point.y, 20);
  // fill(color(0, 0, 255)); // Blue
  // circle(MushroomBase_second_anchor_point.x, MushroomBase_second_anchor_point.y, 20);
  // fill(color(0, 255, 255)); // Light blue 
  // circle(MushroomBase_second_control_point.x, MushroomBase_second_control_point.y, 20);
}

function DrawMushroomStem3(x, y, mushroom, outlineMargin = 0, debug = false) {
  noFill();
  // let pointArray = [[10, 30], [5, 100], [25, 60]];
  let pointArray = [];
  let stepSize = mushroom.stem.height / 4;
  let mushroom_stem_margin = mushroom.stem.width * .10;

  // #1 
  // starting location, left side on the cap 
  pointArray.push([x - outlineMargin - (mushroom.stem.width / 2) + mushroom_stem_margin, y]);

  // #2 
  // The second point is the bottom of the cap 
  pointArray.push([x - outlineMargin - (mushroom.stem.width / 2) + mushroom_stem_margin, y + mushroom.cap.height / 2]);
  pointArray.push([x - outlineMargin - (mushroom.stem.width / 2) + mushroom_stem_margin, y + mushroom.cap.height / 2 + mushroom.cap.ringMargin + stepSize]);

  // #3 
  // Vary the X axis by a random amount
  let xVariance = mushroom.stem.variance * mushroom.stem.direction;
  // Add 1mm to the Y axis. Allways gets longer at the same rate
  pointArray.push([pointArray[pointArray.length - 1][0] + xVariance, pointArray[pointArray.length - 1][1] + stepSize]);

  // #4
  // The forth point down 
  // Add 1mm to the Y axis. Allways gets longer at the same rate
  pointArray.push([pointArray[pointArray.length - 1][0], pointArray[pointArray.length - 1][1] + stepSize / 2 + outlineMargin]);

  // #5
  // The fifth goes across the bottom mid way to the other side of the stem
  pointArray.push([pointArray[pointArray.length - 1][0] + mushroom.stem.width / 2 - mushroom_stem_margin + outlineMargin, pointArray[pointArray.length - 1][1]]);

  // #6
  // The start of the bottom of the stem on the right side
  pointArray.push([pointArray[pointArray.length - 1][0] + mushroom.stem.width / 2 - mushroom_stem_margin * 2 + outlineMargin, pointArray[pointArray.length - 1][1]]);

  // #7-10
  // We need to go back up the stem on the right side
  pointArray.push([
    pointArray[3][0] + (outlineMargin * 2) + mushroom.stem.width / 2 + mushroom_stem_margin * 2,
    pointArray[3][1]]);
  pointArray.push([
    pointArray[2][0] + (outlineMargin * 2) + mushroom.stem.width / 2 + mushroom_stem_margin * 3,
    pointArray[2][1]]);
  pointArray.push([
    pointArray[1][0] + (outlineMargin * 2) + mushroom.stem.width / 2 + mushroom_stem_margin * 3,
    pointArray[1][1]]);
  pointArray.push([
    pointArray[0][0] + (outlineMargin * 2) + mushroom.stem.width / 2 + mushroom_stem_margin * 3,
    pointArray[0][1]]);

  // Draw 
  if (!debug) {
    fill(color(255, 255, 255)); // White 
  }
  p5bezier.newBezier(pointArray);

  if (debug) {
    // Debug 
    for (let i = 0; i < pointArray.length; i++) {
      let point = pointArray[i];
      fill(color(0, 255, 0)); // Black
      textSize(12);
      text(i, point[0], point[1]);
    }
    // fill(color(255, 255, 255)); // White 
  }
}







// This never worked well because of the bezier curve mushroom cap
function DrawMushroomCapDots(x, y, mushroom) {

  stroke(color(255, 0, 0)); // Black
  fill(color(0, 0, 255)); // Blue
  strokeWeight(1);

  // There is a bezier curve that makes the top of the mushroom cap
  // This means that ther is some math that needs to be done to see if the dot 
  // is inside of the mushroom cap or not.  

  // Draw some dots on the top of the mushroom cap 
  // just in the bezier for the top of the mushroom cap
  dotsize = randomSeedMinMax(seed, mushroom.cap.dots.sizeMin, mushroom.cap.dots.sizeMax);
  locationX = x + randomSeedMinMax(seed,
    (-1) * (mushroom.cap.width / 2.5 - dotsize / 2),
    (mushroom.cap.width / 2.5 - dotsize / 2));
  locationY = y - randomSeedMinMax(seed,
    mushroom.cap.height + dotsize / 2,
    (mushroom.cap.tall * 0.75) - (mushroom.cap.height / 2) - dotsize);

  // Location 
  // console.log(locationX, locationY, dotsize);
  ellipse(locationX, locationY, dotsize, dotsize);


  // console.log("count:" + mushroom.cap.dots.count);
}

var gui;
var cap_width = 0 ;
var cap_height = 0 ;
var cap_tall = 0 ;
var cap_tilt = 0 ;
var cap_squash = 0 ;
var cap_ringMargin = 0 ;
var stem_height = 0 ;
var stem_width = 0 ;
var stem_direction = 0 ;
var stem_variance = 0 ;
var gills_count = 0 ;
var gills_direction = 0 ;
var gills_curveAmount = 0 ;


// Use the random number to change the characteristics of the mushroom
var mushroomSetting = {
  cap: {
    width: randomSeedMinMax(seed, 4, 6) * ONE_CM,     // Bottom circle width
    height: randomSeedMinMax(seed, 1.5, 3) * ONE_CM,  // Bottom circle height
    tall: randomSeedMinMax(seed, 3, 5.5) * ONE_CM,    // How tall the mushroom is
    tilt: randomSeedMinMax(seed, -5, 5) * ONE_MM,     // How much the mushroom cap is tilted right or left
    squash: randomSeedMinMax(seed, 1, 10),            // 1 is pointy, 10 is round
    ringMargin: randomSeedMinMax(seed, 2, 4) * ONE_MM,                           // How far the ring is from the edge of the mushroom cap
    dots: {
      count: randomSeedMinMax(seed, 10, 20),      // Not used yet
      sizeMin: randomSeedMinMax(seed, 3, 7) * ONE_MM,
      sizeMax: randomSeedMinMax(seed, 7, 10) * ONE_MM,
    }
  },
  stem: {
    tilt: randomSeedMinMax(seed, -10, 10) * ONE_MM,
    height: randomSeedMinMax(seed, 2, 6) * ONE_CM,
    width: randomSeedMinMax(seed, 10, 25) / 10 * ONE_CM,
    direction: randomSeedMinMax(seed, -1, 1) >= 0 ? 1 : -1,
    variance: randomSeedMinMax(seed, 4, 25) * ONE_MM // Vary the X axis by a random amount  
  },
  gills: {
    count: randomSeedMinMax(seed, 20, 30),
    direction: randomSeedMinMax(seed, -1, 1), // -1 = right, 0 left
    curveAmount: randomSeedMinMax(seed, 3, 10),
  }
}
if (mushroomSetting.gills.direction >= 0) mushroomSetting.gills.direction = 1; // We don't want strait gills


function UpdateMushroomSettingsFromGuiGlobals() {
  mushroomSetting.cap.width = cap_width;
  mushroomSetting.cap.height = cap_height;
  mushroomSetting.cap.tall = cap_tall;
  mushroomSetting.cap.tilt = cap_tilt;
  mushroomSetting.cap.squash = cap_squash;
  mushroomSetting.cap.ringMargin = cap_ringMargin;
  
  mushroomSetting.stem.height = stem_height;
  mushroomSetting.stem.width = stem_width;
  mushroomSetting.stem.direction = stem_direction;
  mushroomSetting.stem.variance = stem_variance;
  mushroomSetting.gills.count = gills_count;
  mushroomSetting.gills.direction = gills_direction;
  mushroomSetting.gills.curveAmount = gills_curveAmount;
}

function UpdateGuiGlobalsFromSeed() {
  cap_width = randomSeedMinMax(seed, 4, 6) * ONE_CM;     // Bottom circle width
  cap_height = randomSeedMinMax(seed, 1.5, 3) * ONE_CM;  // Bottom circle height
  cap_tall = randomSeedMinMax(seed, 3, 5.5) * ONE_CM;    // How tall the mushroom is
  cap_tilt = randomSeedMinMax(seed, -5, 5) * ONE_MM;     // How much the mushroom cap is tilted right or left
  cap_squash = randomSeedMinMax(seed, 1, 10);            // 1 is pointy, 10 is round
  cap_ringMargin = randomSeedMinMax(seed, 2, 4) * ONE_MM;                           // How far the ring is from the edge of the mushroom cap
  
  stem_height = randomSeedMinMax(seed, 2, 6) * ONE_CM;
  stem_width = randomSeedMinMax(seed, 10, 25) / 10 * ONE_CM;
  stem_direction = randomSeedMinMax(seed, -1, 1) >= 0 ? 1 : -1;
  stem_variance = randomSeedMinMax(seed, 4, 25) * ONE_MM; // Vary the X axis by a random amount  
  gills_count = randomSeedMinMax(seed, 20, 30);
  gills_direction = randomSeedMinMax(seed, -1, 1); // -1 = right, 0 left
  gills_curveAmount = randomSeedMinMax(seed, 3, 10);

  UpdateMushroomSettingsFromGuiGlobals();
}

function setup() {
  let canvas = createCanvas(global.width, global.height, SVG); // Create SVG Canvas
  p5bezier.initBezier(canvas)

  UpdateGuiGlobalsFromSeed();

  // Create the GUI
  gui = createGui('Mushroom Settings');

  sliderRange(200, 920, 10);
  gui.addGlobals('cap_width');

  sliderRange(1, 10, 1);
  gui.addGlobals('cap_squash');

  sliderRange(-300, 300, 1);
  gui.addGlobals('cap_tilt');

  sliderRange(-1, 1, 1);
  gui.addGlobals('stem_direction');

  sliderRange(-300, 300, 10);
  gui.addGlobals('stem_variance');  
  
  sliderRange(-1, 1, 1);
  gui.addGlobals('gills_direction');

  sliderRange(1, 50, 1);
  gui.addGlobals('gills_count');

  sliderRange(1, 20, 1);
  gui.addGlobals('gills_curveAmount');  

  sliderRange(0, 1000, 10);
  gui.addGlobals('cap_height', 'cap_tall', 'stem_height', 'stem_width');

  gui.setPosition(10, 50);

  // Only call draw when then gui is changed
  noLoop();

  console.log(mushroomSetting);
}



function draw() {

  console.log("Draw event triggered");
  UpdateMushroomSettingsFromGuiGlobals();

  // clear all
  clear();

  // Print the seed number on the canvas
  fill(color(0, 0, 0)); // Black
  textSize(32);
  text("Seed: " + seedSetting, 10, 30);

  // Outline 
  // ----------------------------------------------------------
  stroke(color(255, 0, 0)); // Black
  strokeWeight(1);
  noFill();

  // Make a copy of the mushrooms 
  let mushroomObjectCopy = JSON.parse(JSON.stringify(mushroomSetting));
  mushroomObjectCopy.cap.width += global.outlineMargin;
  mushroomObjectCopy.cap.height += global.outlineMargin;
  mushroomObjectCopy.cap.tall += global.outlineMargin;
  mushroomObjectCopy.stem.width += global.outlineMargin;
  mushroomObjectCopy.stem.height += global.outlineMargin;
  fill(color(255, 255, 255)); // White 
  DrawMushroomCap(global.width / 2, global.height / 2, mushroomObjectCopy, true, false);
  DrawMushroomStem3(global.width / 2, global.height / 2, mushroomSetting, global.outlineMargin, false);



  // Mushroom
  // ----------------------------------------------------------
  stroke(color(0, 0, 0)); // Black
  strokeWeight(global.strokeWeight);
  fill(color(255, 255, 255)); // White 

  DrawMushroomCap(global.width / 2, global.height / 2, mushroomSetting, false, false);
  DrawMushroomGills(global.width / 2, global.height / 2, mushroomSetting);

  // DrawMushroomStem2(global.width / 2, global.height / 2, mushroomSetting);
  DrawMushroomStem3(global.width / 2, global.height / 2, mushroomSetting, 0, false);


  // DrawMushroomCapDots(global.width / 2, global.height / 2, mushroomSetting, false);



  noLoop();
}