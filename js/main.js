var pieces,
  radius,
  fft,
  analyzer,
  mapMouseX,
  mapMouseY,
  audio,
  track,
  toggleBtn,
  uploadBtn,
  uploadedAudio,
  uploadAnim;
var colorPalette = ["#02073c", "#5b0ff5", "#f50fac", "#f50fac"];
var uploadLoading = false;

function preload() {
  audio = loadSound("audio/Lost with You (feat. Ruby Chase).mp3");
}

function uploaded(file) {
  uploadLoading = true;
  uploadedAudio = loadSound(file.data, uploadedAudioPlay);
}

function uploadedAudioPlay(audioFile) {
  uploadLoading = false;

  if (audio.isPlaying()) {
    audio.pause();
  }

  audio = audioFile;
  audio.loop();
}

function setup() {
  uploadAnim = select("#uploading-animation");

  createCanvas(windowWidth, windowHeight);

  toggleBtn = createButton("Play / Pause");

  uploadBtn = createFileInput(uploaded);

  uploadBtn.addClass("upload-btn");

  toggleBtn.addClass("toggle-btn");

  toggleBtn.mousePressed(toggleAudio);

  analyzer = new p5.Amplitude();
  fft = new p5.FFT();
  audio.loop();
}

function draw() {
  // Add a loading animation for the uploaded track
  if (uploadLoading) {
    uploadAnim.addClass("is-visible");
  } else {
    uploadAnim.removeClass("is-visible");
  }

  background(colorPalette[0]);

  translate(windowWidth / 2, windowHeight / 2);

  level = analyzer.getLevel();
  fft.analyze();

  var bass = fft.getEnergy(100, 150);
  var treble = fft.getEnergy(150, 250);
  var mid = fft.getEnergy("mid");
  var mapMid = map(mid, 0, 255, -100, 200);
  var mapTreble = map(treble, 0, 255, 200, 350);
  var mapbass = map(bass, 0, 255, 50, 200);

  mapMouseX = map(mouseX, 0, width, 1, 50);
  mapMouseXbass = map(mouseX, 0, width, 1, 5);
  mapMouseY = map(mouseY, 0, height, 2, 6);

  pieces = 20;
  radius = 100;

  for (i = 0; i < pieces; i += 0.1) {
    rotate(TWO_PI / (pieces / 2));

    noFill();

    /*----------  BASS  ----------*/
    push();
    stroke(colorPalette[1]);
    rotate(frameCount * 0.002);
    strokeWeight(0.5);
    star(mapbass + i, mapbass - i, mapMouseXbass * i, 3, 2);
    pop();

    /*----------  MID  ----------*/
    push();
    stroke(colorPalette[2]);
    strokeWeight(0.2);
    line(mapMid + i / 2, mapMid - i * 2, mapMouseX * i, 7);
    pop();

    /*----------  TREMBLE  ----------*/
    push();
    stroke(colorPalette[3]);
    strokeWeight(0.6);
    scale(mouseX * 0.0005);
    rotate(mouseX * 0.002);
    ellipse(mapTreble + i / 2, mapTreble - i / 2, (mapMouseY * i) / 2, 3);
    pop();
  }
}

function toggleAudio() {
  if (audio.isPlaying()) {
    audio.pause();
  } else {
    audio.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function polygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + (cos(a) * radius) / 2;
    var sy = y + (sin(a) * radius) / 2;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
