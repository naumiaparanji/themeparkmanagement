const fs = require('fs');
const path = require('path');
const glob = require('glob');
const child_process = require('child_process');

require('dotenv').config({path: '../../.env'});

console.log("Preparing server for deployment...");

console.log("Preparing build directory...");
if (fs.existsSync("./build")) {
    fs.readdirSync("./build").forEach((item) => {
        const itemPath = path.join("./build", item);
        if (item === "node_modules") return;
        try {
            if (fs.statSync(itemPath).isDirectory()) {
                fs.rmSync(itemPath, {recursive: true, force: true});
            } else {
                fs.unlinkSync(itemPath);
            }
        } catch (err) {
            console.error(`Error removing ${itemPath}:`, err.message);
        }
    });
} else {
    fs.mkdirSync("./build");
}

console.log("Copying server files...");

function copyFiles(srcPattern, destDir) {
    const files = glob.globSync(srcPattern);
    files.forEach(file => {
        const destPath = path.join(destDir, path.basename(file));
        if (!fs.existsSync(destPath)) {
            fs.mkdirSync(path.dirname(destPath), {recursive: true});
            fs.copyFile(file, destPath, (err) => {
                if (err) console.error('Error copying file:', err);
            });
        }
    });
}

copyFiles("./main.js", "./build");
copyFiles("./package.json", "./build");
copyFiles("./routes/*.js", "./build/routes");
copyFiles("./utils/*.js", "./build/utils");
copyFiles("./*.pem", "./build");

console.log("Installing production packages...");
child_process.execSync("npm install --omit=dev", {cwd: path.resolve("./build")});

console.log("Build complete!\nNext steps:\n  set 'API_SERVER_ENV = production' in ../.env\n  run docker compose up -d");