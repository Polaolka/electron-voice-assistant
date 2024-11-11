const menuTemplate = [
  // { role: 'appMenu' }

  {
    label: "app menu",
    submenu: [
      { role: "about" },
      { type: "separator" },
      { role: "services" },
      { type: "separator" },
      { role: "quit" },
    ],
  },
  //   {
  //     label: "Edit",
  //     submenu: [
  //       { role: "undo" },
  //       { role: "redo" },
  //       { type: "separator" },
  //       { role: "cut" },
  //       { role: "copy" },
  //       { role: "paste" },
  //     ],
  //   },

  //   // { role: 'viewMenu' }
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  //   // { role: 'windowMenu' }
  {
    label: "Window",
    submenu: [{ role: "minimize" }, { role: "zoom" }, { role: "close" }],
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://electronjs.org");
        },
      },
    ],
  },
];
module.exports = { menuTemplate };
