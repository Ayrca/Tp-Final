const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;

http.createServer((req, res) => {
  const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const contentType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png', // Agrega tipos de archivo según sea necesario
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      const type = contentType[ext] || 'application/octet-stream'; // Valor predeterminado
      res.writeHead(200, { 'Content-Type': type });
      res.end(content);
    }
  });
}).listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});