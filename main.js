import { colourNameToHex } from './utils.js';
import TuyApi from 'tuyapi'
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs'
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const device = new TuyApi({
  id: '',
  key: ''});

let stateHasChanged = false;
let fileContent = fs.readFileSync('last', 'utf8')
let lastColor = fileContent.trim()
console.log(lastColor)

let fileContentLast = fs.readFileSync('lastS', 'utf8')
let lastSlider = fileContentLast.trim()
console.log(lastSlider)


const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// Find device on network
device.find().then(() => {
  // Connect to device
  device.connect();
});

// Add event listeners
device.on('connected', () => {
  console.log('Connected to device!');
});

device.on('disconnected', () => {
  console.log('Disconnected from device.');
});

device.on('error', error => {
  console.log('Error!', error);
});

device.on('data', async data => {
  console.log('Data from device:', data);

  console.log(`Boolean status of default property: ${data.dps['1']}.`);

  if (!stateHasChanged) {

    stateHasChanged = true;
  }
  
});


// Helper function to convert RGB to HSV
function rgbToHue(r, g, b) {
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h;
  let diff = max - min;
  if (max === min) {
      h = 0; // achromatic
  } else {
      switch (max) {
          case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
          case g: h = (b - r) / diff + 2; break;
          case b: h = (r - g) / diff + 4; break;
      }
      h /= 6;
  }
  return h * 360;
}
function hexToTuya(hexColor, brightness) {
  let r = parseInt(hexColor.slice(0, 2), 16) / 255;
  let g = parseInt(hexColor.slice(2, 4), 16) / 255;
  let b = parseInt(hexColor.slice(4, 6), 16) / 255;

  let hsv = rgbToHue(r, g, b);

  let h = Math.round(hsv).toString(16).padStart(4, '0');
  const brightnessValue = Math.round(brightness * 1000).toString(16);
  return h + '03e80' + brightnessValue;
}


// Function to set color on device
async function setColor(colorName, brightness) {
    // Get RGB values for this color
    const rgb = colourNameToHex(colorName)
    console.log(rgb)
    
    const tuyaHsvParsed = hexToTuya(rgb, brightness)
    console.log(tuyaHsvParsed)
    // Set color on device
    device.set({dps: '24', set: tuyaHsvParsed}).then(() => console.log('Changed color.'));
  }


app.post('/get_color', async (req, res) => {
  res.send({color: lastColor, slider: lastSlider})
});

app.post('/change_color', async (req, res) => {
  console.log(req.body)
  lastColor = req.body.color;
  fs.writeFileSync('last', lastColor);
  console.log('Received color:', lastColor);
  await setColor(lastColor.replace(' ', ''), lastSlider)
  res.sendStatus(200);
});


app.post('/change_slider', async (req, res) => {
  console.log(req.body)
  lastSlider = req.body.slider
  fs.writeFileSync('lastS', lastSlider);
  console.log('Received color:', lastSlider);
  await setColor(lastColor.replace(' ', ''), lastSlider)
  res.sendStatus(200);
});
