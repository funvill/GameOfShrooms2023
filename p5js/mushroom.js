
const ONE_MM = 10;
const ONE_CM = ONE_MM * 10;



// 1000 = 10 cm 
var global = {
  width: 10 * ONE_CM,
  height: 10 * ONE_CM,
  strokeWeight: 5,
}

var mushroom = {
  cap: {
    width: 6 * ONE_CM,
    height: 2 * ONE_CM,
    length: 5 * ONE_CM,
    tilt: -6 * ONE_MM,
  },
  stem: {
    height: 4* ONE_CM,
    tilt: -10 * ONE_MM,
  },
  gills: 50,
}


function DrawMushroomCap(x, y, mushroomWidth, mushroomHeight, mushroomLength, mushroomTilt) {

  // Top of the mushroom cap
  // ----------------------------------------------------------
  // Left side edge of the mushroom cap
  let mushroomCap_first_anchor_point = {
    x: x - (mushroomWidth / 2),
    y: y
  }; // Red 
  let mushroomCap_first_control_point = {
    x: mushroomCap_first_anchor_point.x + (mushroomWidth / 5) + mushroomTilt,
    y: (global.height / 2) - mushroomLength
  }; // Green

  // Right side edge of the mushroom cap
  let mushroomCap_second_anchor_point = {
    x: x + (mushroomWidth / 2),
    y: y
  }; // Blue
  let mushroomCap_second_control_point = {
    x: mushroomCap_second_anchor_point.x - (mushroomWidth / 5) + mushroomTilt,
    y: mushroomCap_first_control_point.y
  }; // Light blue

  bezier(
    mushroomCap_first_anchor_point.x, mushroomCap_first_anchor_point.y, mushroomCap_first_control_point.x, mushroomCap_first_control_point.y,
    mushroomCap_second_control_point.x, mushroomCap_second_control_point.y, mushroomCap_second_anchor_point.x, mushroomCap_second_anchor_point.y
  );

  // Large bottom of the mushroom ellipse 
  // ----------------------------------------------------------
  ellipse(x, y, mushroomWidth, mushroomHeight);

  // Smaller circle on the bottom of the mushroom cap
  // ----------------------------------------------------------
  fill(color(255, 255, 255)); // White 
  ellipse(x, y, mushroomWidth / 3, mushroomHeight / 3);
}

// Starting from the mushroomStem cycle outwards to the mushroom cap with bezier curves
function DrawMushroomGills(x, y, mushroomCapWidth, mushroomCapHeight, mushroomStemWidth, mushroomStemHeight, gillCount) {
  for (let gillOffset = 0; gillOffset < gillCount; gillOffset++) {

    // Find a point on a ellipse of the mushroom cap. Each gill should be evenly spaced around the mushroom cap
    mushroomStemEllipsePoint = {
      x: x + (mushroomStemWidth / 2) * cos(gillOffset * TWO_PI / gillCount),
      y: y + (mushroomStemHeight / 2) * sin(gillOffset * TWO_PI / gillCount)
    };

    const mushroomCapEllipsePointOffset = .3;
    let mushroomCapEllipsePoint = {
      x: x + (mushroomCapWidth / 2) * cos(gillOffset * TWO_PI / gillCount + mushroomCapEllipsePointOffset),
      y: y + (mushroomCapHeight / 2) * sin(gillOffset * TWO_PI / gillCount + mushroomCapEllipsePointOffset)
    };


    // The control point should be in the center of the two other points
    mushroomCapEllipseControlPoint = {
      x: (x + (mushroomCapWidth / 2) * cos(gillOffset * TWO_PI / gillCount) + mushroomStemEllipsePoint.x) / 2,
      y: (y + (mushroomCapHeight / 2) * sin(gillOffset * TWO_PI / gillCount) + mushroomStemEllipsePoint.y) / 2
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

function DrawMushroomStem2(x, y, mushroomStemWidth, mushroomStemHeight, mushroomStemTilt) {

  // Stem length
  // ----------------------------------------------------------
  let MushroomBase_Top_Offset_y = 0;

  // Stem bottom
  // ----------------------------------------------------------
  // Left side edge of the mushroom cap
  let MushroomBase_first_anchor_point = {
    x: (x) - ((mushroomStemWidth) / 2),
    y: y + MushroomBase_Top_Offset_y
  }; // Red 
  let MushroomBase_first_control_point = {
    x: MushroomBase_first_anchor_point.x + mushroomStemTilt,
    y: y + mushroomStemHeight
  }; // Green

  // Right side edge of the mushroom cap
  let MushroomBase_second_anchor_point = {
    x: (x) + ((mushroomStemWidth) / 2),
    y: y + MushroomBase_Top_Offset_y
  }; // Blue
  let MushroomBase_second_control_point = {
    x: MushroomBase_first_anchor_point.x + (mushroomStemWidth) + mushroomStemTilt,
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

  
  // Outline 
  stroke(color(255, 0, 0)) ; // Black
  strokeWeight(1);
  noFill();
  const margin = .5 * ONE_CM ; 

  DrawMushroomCap(global.width / 2, global.height / 2, mushroom.cap.width + margin, mushroom.cap.height + margin, mushroom.cap.length + margin, mushroom.cap.tilt);
  DrawMushroomStem2(global.width / 2, global.height / 2, mushroom.cap.width / 3  + margin, mushroom.stem.height + margin, mushroom.stem.tilt );
  
  stroke(color(0, 0, 0)) ; // Black
  strokeWeight(global.strokeWeight);
  fill(color(255, 255, 255)); // White 

  DrawMushroomCap(global.width / 2, global.height / 2, mushroom.cap.width, mushroom.cap.height, mushroom.cap.length, mushroom.cap.tilt);
  DrawMushroomGills(global.width / 2, global.height / 2, mushroom.cap.width, mushroom.cap.height, mushroom.cap.width / 3, mushroom.cap.height / 3, mushroom.gills);

  fill(color(255, 255, 255)); // White 
  DrawMushroomStem2(global.width / 2, global.height / 2, mushroom.cap.width / 3, mushroom.stem.height, mushroom.stem.tilt );

  noLoop();
}