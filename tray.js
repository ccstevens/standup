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

module.exports.initialize = initialize;

//
// -------------------------------------------------------------------- Imports
//

const path = require('path');
const electron = require('electron');
const Tray = electron.Tray;
const Menu = electron.Menu;
const app = electron.app;
const timer = require('./timer');

//
// ------------------------------------------------------------------ Constants
//

const DEFAULT_ICON_NAME = 'img/default-icon.png';
const WINDOWS_ICON_NAME = 'img/windows-icon.png';
const TRAY_TOOL_TIP = 'Hiatus';

//
// -------------------------------------------------------------------- Globals
//

//
// Store the tray's context menu items.
//

const trayContextMenuTemplate = [
    {
        label: 'Enable',
        click: trayEnableTimer
    },

    {
        label: 'Disable',
        click: trayDisableTimer
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
// ------------------------------------------------------------------ Functions
//

function initialize ()

/*++

Routine Description:

    This routine intializes the tray menu support for the application.

Arguments:

    None.

Return Value:

    Returns true if a new tray is successfully initialized, false otherwise.

--*/

{

    var contextMenu;
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

    contextMenu = Menu.buildFromTemplate(trayContextMenuTemplate);
    if (!contextMenu) {
        return false;
    }

    trayIcon = new Tray(iconPath);
    if (!trayIcon) {
        return false;
    }

    trayIcon.setToolTip(TRAY_TOOL_TIP);
    trayIcon.setContextMenu(contextMenu);
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
