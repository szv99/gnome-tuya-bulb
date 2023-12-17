# gnome-tuya-bulb

## Description
This suite, which might be outdated, consists of two components: a Node.js server application and a Gnome Shell extension. The server application controls a Tuya smart device's color and brightness, and the Gnome extension provides a desktop UI for color control. 
You may need to adjust the code to be compatible with your Tuya bulb model and the latest Tuya API.
## Components

### 1. Tuya Smart Device Server
- **Function**: Control color and brightness of a Tuya smart device via HTTP requests.
- **Technologies**: Node.js, Express.js
- **Features**: Remote color control, brightness adjustment, state persistence.

### 2. Gnome Shell Color Control Extension
- **Function**: Desktop UI for sending color change requests to the server.
- **Dependencies**: Gnome Shell, Soup library.

## Installation & Usage

### Tuya Server
1. Clone the repository and install dependencies:
   ```bash
   git clone [https://github.com/szv99/gnome-tuya-bulb.git]
   cd [gnome-tuya-bulb]
   npm install
   ```
2. Add your id & key in `main.js`
3. Start the server: `node main`

### Gnome Extension
1. Copy to Gnome extensions directory and restart Gnome Shell.
2. Enable the extension via Gnome Tweaks.