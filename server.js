const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;

function sendJSON(res, statusCode, obj) {
  res.writeHead(statusCode, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(obj));
}

http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Length': '0',
    });
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/registro') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const nuevoUsuario = JSON.parse(body);
        const usuariosPath = path.join(__dirname, 'datos', 'usuarios.json');

        fs.readFile(usuariosPath, 'utf8', (err, data) => {
          let usuarios = [];
          if (!err) {
            try {
              usuarios = JSON.parse(data);
              if (!Array.isArray(usuarios)) usuarios = [];
            } catch {
              usuarios = [];
            }
          }

          if (usuarios.find(u => u.email === nuevoUsuario.email)) {
            sendJSON(res, 400, { error: 'El email ya está registrado' });
            return;
          }

          usuarios.push(nuevoUsuario);

          fs.writeFile(usuariosPath, JSON.stringify(usuarios, null, 2), (err) => {
            if (err) {
              sendJSON(res, 500, { error: 'Error al guardar usuario' });
              return;
            }

            sendJSON(res, 200, { success: true });
          });
        });

      } catch (error) {
        sendJSON(res, 400, { error: 'JSON inválido' });
      }
    });

    return;

  } else if (req.method === 'POST' && req.url === '/login') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body);
        const usuariosPath = path.join(__dirname, 'datos', 'usuarios.json');

        fs.readFile(usuariosPath, 'utf8', (err, data) => {
          if (err) {
            sendJSON(res, 500, { error: 'Error leyendo usuarios' });
            return;
          }

          let usuarios;
          try {
            usuarios = JSON.parse(data);
          } catch {
            usuarios = [];
          }

          const user = usuarios.find(u => u.email === email && u.password === password);

          if (!user) {
            sendJSON(res, 401, { error: 'Correo o contraseña incorrectos' });
            return;
          }

          const { password: _, ...userSinPassword } = user;
          sendJSON(res, 200, userSinPassword);
        });

      } catch {
        sendJSON(res, 400, { error: 'JSON inválido' });
      }
    });

    return;
  }

  // Archivos estáticos
  const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);

  const contentType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, {
        'Access-Control-Allow-Origin': '*'
      });
      res.end('Not found');
    } else {
      const type = contentType[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': type,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    }
  });

}).listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
