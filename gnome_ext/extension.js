const St = imports.gi.St;
const Main = imports.ui.main;
const Soup = imports.gi.Soup;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const HttpHelper = Me.imports.httpHelper;

let colorWindow;

function init() {
    colorWindow = null;
}

function enable() {
    createColorWindow();
}

function disable() {
    destroyColorWindow();
}

function createColorWindow() {
    if (colorWindow)
        return;

    colorWindow = new St.Bin({
        style_class: 'color-window',
        reactive: true,
        can_focus: true,
        track_hover: true
    });

    const colors = ["#FF0000", "#00FF00", "#0000FF"];
    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];
        const colorButton = new St.Button({
            style: `background-color: ${color}; width: 50px; height: 50px;`,
            reactive: true,
            can_focus: true,
            track_hover: true
        });
        colorButton.connect('button-press-event', () => {
            sendColorRequest(color);
        });
        colorWindow.add_actor(colorButton);
    }

    Main.uiGroup.add_actor(colorWindow);
}

function destroyColorWindow() {
    if (!colorWindow)
        return;

    Main.uiGroup.remove_actor(colorWindow);
    colorWindow = null;
}

function sendColorRequest(color) {
    const url = "/change_color";
    const data = { "color": color };

    HttpHelper.post(url, data)
        .then(response => {
            log(`Request sent: ${JSON.stringify(data)}`);
        })
        .catch(error => {
            logError(`Error: ${error}`);
        });
}
