const { app, BrowserWindow } = require("electron")

const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        title: "Phan mem quan ly chung cu",
        width: 1000,
        height: 1200
    })
}

app.on("ready", createMainWindow)

console.log("Hello World!")