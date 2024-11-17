const pem = require('pem');
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
                fs.rmSync(itemPath, { recursive: true, force: true });
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

console.log('Generating RSA key pair for SSL...');
pem.createPrivateKey(2048, (err, key) => {
    if (err) {
        console.error('Error generating private key:', err);
        return;
    }
    pem.createCSR({ key: key.key, commonName: process.env.APP_SSL_COMMON_NAME }, (err, csr) => {
        if (err) {
            console.error('Error generating CSR:', err);
            return;
        }
        pem.createCertificate({ csr: csr.csr, key: key.key, days: 365 }, (err, cert) => {
        if (err) {
            console.error('Error generating certificate:', err);
            return;
        }
        fs.writeFileSync('./build/server-key.pem', key.key);
        fs.writeFileSync('./build/server-csr.pem', csr.csr);
        fs.writeFileSync('./build/server-cert.pem', cert.certificate);
        });
    });
});

console.log("Copying server files...");

function copyFiles(srcPattern, destDir) {
    const files = glob.globSync(srcPattern);
    files.forEach(file => {
        const destPath = path.join(destDir, path.basename(file));
        if (!fs.existsSync(destPath)) {
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
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

console.log("Installing production packages...");
child_process.execSync("npm install --omit=dev", {cwd: path.resolve("./build")});

console.log("Build complete!\nNext steps:\n  set 'API_SERVER_ENV = production' in ../.env\n  run docker compose up -d");