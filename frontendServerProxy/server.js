const express = require('express');
const path = require('path');
const app = express();
const https = require('https');
const fs = require('fs');

app.use((req, res, next) => {
    if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
        next();
    } else {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    }
});

app.use(express.static(path.join(__dirname, 'dist')));

const httpsServer = https.createServer({
  key: fs.readFileSync(' /etc/letsencrypt/live/levelup-2024.xyz/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/levelup-2024.xyz/fullchain.pem'),
}, app);

httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});
