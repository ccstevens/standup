/*++

Copyright (c) 2017 Chris Stevens

Module Name:

    tray.js

Abstract:

    This module implements the tray icon support for the application.

Author:

    Chris Stevens 10-Sept-2017

--*/

//
// -------------------------------------------------------------------- Exports
//

module.exports.initialize = trayInitialize;

//
// -------------------------------------------------------------------- Imports
//

const path = require('path');
const electron = require('electron');
const Tray = electron.Tray;
const Menu = electron.Menu;
const app = electron.app;
const timer = require('./timer')

//
// ------------------------------------------------------------------ Constants
//

const DEFAULT_ICON_NAME = 'img/default-icon.png';
const WINDOWS_ICON_NAME = 'img/windows-icon.png';
const TRAY_TOOL_TIP = 'Stand Up!';
const TRAY_ENABLE_INDEX = 0;
const TRAY_DISABLE_INDEX = 1;

//
// -------------------------------------------------------------------- Globals
//

//
// Store the tray's context menu items.
//

const trayContextMenuTemplate = [
    {
        label: 'Enable',
        click: trayEnableTimer,
        visible: false
    },

    {
        label: 'Disable',
        click: trayDisableTimer,
        visible: true
    },

    {
        label: 'Exit',
        click: trayExitApplication
    },
];

//
// Store a reference to the application tray.
//

let trayIcon;

//
// Store the tray's context menu so it can be updated on refresh.
//

var trayContextMenu;

//
// ------------------------------------------------------------------ Functions
//

function trayInitialize ()

/*++

Routine Description:

    This routine intializes the tray menu support for the application.

Arguments:

    None.

Return Value:

    Returns true if a new tray is successfully initialized, false otherwise.

--*/

{

    var iconName;
    var iconPath;

    iconName = DEFAULT_ICON_NAME;
    if (process.platform === 'win32') {
        iconName = WINDOWS_ICON_NAME;
    }

    iconPath = path.join(__dirname, iconName);
    if (!iconPath) {
        return false;
    }

    trayContextMenu = Menu.buildFromTemplate(trayContextMenuTemplate);
    if (!trayContextMenu) {
        return false;
    }

    trayIcon = new Tray(iconPath);
    if (!trayIcon) {
        return false;
    }

    trayIcon.setToolTip(TRAY_TOOL_TIP);
    trayIcon.setContextMenu(trayContextMenu);
    return true;
}

function trayEnableTimer ()

/*++

Routine Description:

    This routine starts the periodic timer.

Arguments:

    None.

Return Value:

    None.

--*/

{

    timer.start();
    trayRefresh();
    return;
}

function trayDisableTimer ()

/*++

Routine Description:

    This routine stops the periodic timer.

Arguments:

    None.

Return Value:

    None.

--*/

{

    timer.stop();
    trayRefresh();
    return;
}

function trayExitApplication ()

/*++

Routine Description:

    This routine responds to a tray menu request to exit the application.

Arguments:

    None.

Return Value:

    None.

--*/

{

    app.quit();
    return;
}

function trayRefresh ()

/*++

Routine Description:

    This routine refreshes the tray context menu items to display the most
    up to date information.

Arguments:

    None.

Return Value;

    None.

--*/

{

    var timerEnabled;

    timerEnabled = timer.isEnabled();
    trayContextMenu.items[TRAY_ENABLE_INDEX].visible = !timerEnabled;
    trayContextMenu.items[TRAY_DISABLE_INDEX].visible = timerEnabled;
    trayIcon.setContextMenu(trayContextMenu);
    return;
}
