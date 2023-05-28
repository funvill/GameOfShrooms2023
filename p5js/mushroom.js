const ONE_MM = 10;
const ONE_CM = ONE_MM * 10;

// 1000 = 10 cm 
var global = {
  width: 10 * ONE_CM,
  height: 10 * ONE_CM,
  outlineMargin: .5 * ONE_CM,
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
  var x = Math.sin(seed++) * 10000;
  // Min/Max is inclusive  
  x =  min + (x - Math.floor(x)) * (max - min);
  // Round to 1 decimal place
  // return Math.round(x * 10) / 10;
  return Math.floor(x) ;
}



// Use the random number to change the characteristics of the mushroom
var mushroomSetting = {
  cap: {
    width: randomSeedMinMax(seed, 4, 6) * ONE_CM,     // Bottom circle width
    height: randomSeedMinMax(seed, 1.5, 3) * ONE_CM,  // Bottom circle height
    tall: randomSeedMinMax(seed, 3, 5.5) * ONE_CM,    // How tall the mushroom is
    tilt: randomSeedMinMax(seed, -5, 5) * ONE_MM,     // How much the mushroom cap is tilted right or left
    squash: randomSeedMinMax(seed, 1, 10),            // 1 is pointy, 10 is round
  },
  stem: {
    height: randomSeedMinMax(seed, 2, 6) * ONE_CM,
    tilt: randomSeedMinMax(seed, -10, 10) * ONE_MM,
    width: randomSeedMinMax(seed, 10, 25)/10 * ONE_CM ,
  },
  gills: {
    count: randomSeedMinMax(seed, 20, 30),
    direction: randomSeedMinMax(seed, -1, 1), // -1 = right, 0 left
    curveAmount: randomSeedMinMax(seed, 3, 10),
  }  
}
if( mushroomSetting.gills.direction >= 0 ) mushroomSetting.gills.direction = 1; // We don't want strait gills


// mushroom.cap.width = 5 * ONE_CM;
// mushroom.cap.height = 5 * ONE_CM;
// mushroom.cap.tall = 5.5 * ONE_CM;
// mushroom.gills.count = 30;
// mushroom.gills.direction = 1;
// mushroom.gills.curveAmount = 6;

console.log(mushroomSetting);
console.log(mushroomSetting.gills.count);




function DrawMushroomCap(x, y, mushroom, debug = false) {

  // Top of the mushroom cap
  // ----------------------------------------------------------
  // Left side edge of the mushroom cap
  let mushroomCap_first_anchor_point = {
    x: x - (mushroom.cap.width / 2),
    y: y
  }; // Red 
  let mushroomCap_first_control_point = {
    x: mushroomCap_first_anchor_point.x + (mushroom.cap.width / mushroom.cap.squash) + mushroom.cap.tilt,
    y: (global.height / 2) - mushroom.cap.tall
  }; // Green

  // Right side edge of the mushroom cap
  let mushroomCap_second_anchor_point = {
    x: x + (mushroom.cap.width / 2),
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
  ellipse(x, y, mushroom.cap.width, mushroom.cap.height);
 

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
  ellipse(x, y, mushroom.stem.width, mushroom.cap.height /3);
  
  for (let gillOffset = 0; gillOffset < mushroom.gills.count; gillOffset++) {
    const mushroomCapEllipsePointOffset = (mushroom.gills.curveAmount / 10) * mushroom.gills.direction ;


    // Find a point on a ellipse of the mushroom cap. 
    // Each gill should be evenly spaced around the mushroom cap
    mushroomStemEllipsePoint = {
      x: x + (mushroom.stem.width / 2) * cos(gillOffset * TWO_PI / mushroom.gills.count),
      y: y + (mushroom.cap.height /3 / 2) * sin(gillOffset * TWO_PI / mushroom.gills.count)
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







function setup() {
  createCanvas(global.width, global.height, SVG); // Create SVG Canvas
}

function draw() {

  // Print the seed number on the canvas
  fill(color(0, 0, 0)); // Black
  textSize(32);
  text("Seed: " + seedSetting, 10, 30);

  // Debug 
  // Print the mushroom object on the canvas
  fill(color(0, 0, 0)); // Black
  textSize(12);
  text("Cap:   " + JSON.stringify(mushroomSetting.cap), 10, 50);
  text("Gills: " + JSON.stringify(mushroomSetting.gills), 10, 62);
  text("Stem:  " + JSON.stringify(mushroomSetting.stem), 10, 74);


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
  DrawMushroomCap(global.width / 2, global.height / 2, mushroomObjectCopy, false);
  DrawMushroomStem2(global.width / 2, global.height / 2, mushroomObjectCopy);

  // Mushroom
  // ----------------------------------------------------------
  stroke(color(0, 0, 0)); // Black
  strokeWeight(global.strokeWeight);
  fill(color(255, 255, 255)); // White 

  DrawMushroomCap(global.width / 2, global.height / 2, mushroomSetting, false);
  DrawMushroomGills(global.width / 2, global.height / 2, mushroomSetting );

  fill(color(255, 255, 255)); // White 
  DrawMushroomStem2(global.width / 2, global.height / 2, mushroomSetting);

  noLoop();
}