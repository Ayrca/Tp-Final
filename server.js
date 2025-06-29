const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;



// Función para servir archivos estáticos
const serveStaticFile = (filePath, res) => {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Access-Control-Allow-Origin': '*' });
      res.end('Not found');
    } else {
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
      const type = contentType[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*' });
      res.end(content);
    }
  });
};

// Función para servir archivos estáticos








// Función para enviar JSON
function sendJSON(res, statusCode, obj) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(obj));
}

http.createServer((req, res) => {
  try {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Length': '0',
    });
    res.end();
    return;
  }

// Función para leer publicidad
function leerPublicidad(callback) {
  const filePath = path.join(__dirname, 'datos', 'publicidad.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    const publicidad = JSON.parse(data);
    callback(null, publicidad);
  });
}

// Función para agregar publicidad
function agregarPublicidad(nombreArray, nuevoObjeto, callback) {
  const filePath = path.join(__dirname, 'datos', 'publicidad.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    const publicidad = JSON.parse(data);
    if (!publicidad[nombreArray]) {
      callback(new Error(`Array ${nombreArray} no encontrado`));
      return;
    }
    nuevoObjeto.id = publicidad[nombreArray].length + 1;
    publicidad[nombreArray].push(nuevoObjeto);
    fs.writeFile(filePath, JSON.stringify(publicidad, null, 2), (err) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null);
    });
  });
}

// Función para modificar publicidad
function modificarPublicidad(nombreArray, idObjeto, nuevosDatos, callback) {
  const filePath = path.join(__dirname, 'datos', 'publicidad.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    const publicidad = JSON.parse(data);
    if (!publicidad[nombreArray]) {
      callback(new Error(`Array ${nombreArray} no encontrado`));
      return;
    }
    const indice = publicidad[nombreArray].findIndex((obj) => obj.id === parseInt(idObjeto));
    if (indice !== -1) {
      publicidad[nombreArray][indice] = { ...publicidad[nombreArray][indice], ...nuevosDatos };
      fs.writeFile(filePath, JSON.stringify(publicidad, null, 2), (err) => {
        if (err) {
          callback(err);
          return;
        }
        callback(null);
      });
    } else {
      callback(new Error('Objeto no encontrado'));
    }
  });
}

// Función para eliminar publicidad
function eliminarPublicidad(nombreArray, idObjeto, callback) {
  const filePath = path.join(__dirname, 'datos', 'publicidad.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    const publicidad = JSON.parse(data);
    if (!publicidad[nombreArray]) {
      callback(new Error(`Array ${nombreArray} no encontrado`));
      return;
    }
    const indice = publicidad[nombreArray].findIndex((obj) => obj.id === parseInt(idObjeto));
    if (indice !== -1) {
      publicidad[nombreArray].splice(indice, 1);
      // Actualiza los IDs después de eliminar un objeto
      publicidad[nombreArray] = publicidad[nombreArray].map((obj, index) => ({ ...obj, id: index + 1 }));
      fs.writeFile(filePath, JSON.stringify(publicidad, null, 2), (err) => {
        if (err) {
          callback(err);
          return;
        }
        callback(null);
      });
    } else {
      callback(new Error('Objeto no encontrado'));
    }
  });
}

  // Rutas para usuarios y login
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

  //agregar nuevo trabajo a trabajos.json
  else if (req.method === 'POST' && req.url === '/api/trabajos') {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const nuevoTrabajo = JSON.parse(body);
      const trabajosPath = path.join(__dirname, 'datos', 'trabajos.json');
      fs.readFile(trabajosPath, 'utf8', (err, data) => {
        let trabajos = [];
        if (!err && data) {
          try {
            trabajos = JSON.parse(data);
            if (!Array.isArray(trabajos)) trabajos = [];
          } catch {
            trabajos = [];
          }
        }

        trabajos.push(nuevoTrabajo);
        fs.writeFile(trabajosPath, JSON.stringify(trabajos, null, 2), (err) => {
          if (err) {
            sendJSON(res, 500, { error: 'Error al guardar trabajo' });
          } else {
            sendJSON(res, 201, { success: true });
          }
        });
      });
    } catch (error) {
      sendJSON(res, 400, { error: 'JSON inválido' });
    }
  });
  return;
}

//obtener todos los trabajos de trabajos.json
else if (req.method === 'GET' && req.url === '/api/trabajos') {
  const trabajosPath = path.join(__dirname, 'datos', 'trabajos.json');
  fs.readFile(trabajosPath, 'utf8', (err, data) => {
    if (err) {
      sendJSON(res, 200, []); // Devuelve array vacío si no existe o error
      return;
    }
    try {
      const trabajos = JSON.parse(data);
      sendJSON(res, 200, trabajos);
    } catch {
      sendJSON(res, 200, []);
    }
  });
  return;
}
 
  // Rutas para publicidad  
  else if (req.method === 'GET' && req.url === '/datos/publicidad') {
    leerPublicidad((err, publicidad) => {
      if (err) {
        sendJSON(res, 500, { error: 'Error leyendo publicidad' });
      } else {
        sendJSON(res, 200, publicidad);
      }
    });

  }else if (req.method === 'POST' && req.url.startsWith('/publicidad/')) {
    console.log('Ruta alcanzada:', req.url);
  const urlParts = req.url.split('/');
  if (urlParts.length < 3) {
    sendJSON(res, 400, { error: 'Nombre del array no proporcionado' });
    return;
  }
  const nombreArray = urlParts[2];
  console.log('Nombre del array:', nombreArray);
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    try {
      const objeto = JSON.parse(body);
      agregarPublicidad(nombreArray, objeto, (err) => {
        if (err) {
          sendJSON(res, 500, { error: 'Error agregando publicidad' });
        } else {
          sendJSON(res, 201, objeto);
        }
      });
    } catch (err) {
      sendJSON(res, 400, { error: 'Cuerpo de la solicitud inválido' });
    }
  });

  } else if (req.method === 'PUT' && req.url.startsWith('/publicidad/')) {
  const urlParts = req.url.split('/');
  const nombreArray = urlParts[2];
  const idObjeto = urlParts[3];
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const nuevosDatos = JSON.parse(body);
      modificarPublicidad(nombreArray, idObjeto, nuevosDatos, (err) => {
        if (err) {
          sendJSON(res, 500, { error: 'Error modificando publicidad' });
        } else {
          sendJSON(res, 200, { success: true });
        }
      });
    } catch {
      sendJSON(res, 400, { error: 'JSON inválido' });
    }
  });
}
  
    else if (req.method === 'DELETE' && req.url.startsWith('/publicidad/')) {
  const urlParts = req.url.split('/');
  const nombreArray = urlParts[2];
  const idObjeto = urlParts[3];
  eliminarPublicidad(nombreArray, idObjeto, (err) => {
    if (err) {
      sendJSON(res, 500, { error: 'Error eliminando publicidad' });
    } else {
      sendJSON(res, 200, { success: true });
    }
  });
}


//leer oficios de datos.json
else if (req.method === 'GET' && req.url === '/datos/oficios') {
  const filePath = path.join(__dirname, 'datos', 'datos.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      sendJSON(res, 500, { error: 'Error leyendo datos.json' });
      return;
    }
    try {
      const datos = JSON.parse(data);
      sendJSON(res, 200, datos.oficios || []);
    } catch {
      sendJSON(res, 500, { error: 'Error procesando JSON' });
    }
  });
}

//Actualizar datos del profesional
else if (req.method === 'POST' && req.url === '/actualizarPerfil') {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
    const {
      emailOriginal,
      email,
      descripcion,
      estado,
      imagenes,
      telefono,
      direccion,
      empresa,
      rubros,
      avatar 
    } = JSON.parse(body);


      const usuariosPath = path.join(__dirname, 'datos', 'usuarios.json');
      fs.readFile(usuariosPath, 'utf8', (err, data) => {
        if (err) {
          sendJSON(res, 500, { error: 'Error leyendo usuarios' });
          return;
        }

        let usuarios = JSON.parse(data);
        const index = usuarios.findIndex(u => u.email === emailOriginal);
        if (index === -1) {
          sendJSON(res, 404, { error: 'Usuario no encontrado' });
          return;
        }

        // Verificar que el nuevo email no esté siendo usado por otro usuario
        if (email !== emailOriginal && usuarios.some(u => u.email === email)) {
          sendJSON(res, 409, { error: 'El nuevo email ya está en uso' });
          return;
        }

        // Actualizar campos
        usuarios[index].email = email;
        usuarios[index].descripcion = descripcion;
        usuarios[index].estado = estado;
        usuarios[index].imagenes = imagenes;
        usuarios[index].telefono = telefono || usuarios[index].telefono;
        usuarios[index].direccion = direccion || usuarios[index].direccion;
        usuarios[index].empresa = empresa || usuarios[index].empresa;
        usuarios[index].rubros = rubros || usuarios[index].rubros;
        usuarios[index].avatar = avatar || usuarios[index].avatar;

        fs.writeFile(usuariosPath, JSON.stringify(usuarios, null, 2), (err) => {
          if (err) {
            sendJSON(res, 500, { error: 'Error al guardar cambios' });
            return;
          }

          const { password, ...usuarioSinPassword } = usuarios[index];
          sendJSON(res, 200, usuarioSinPassword);
        });
      });
    } catch {
      sendJSON(res, 400, { error: 'JSON inválido' });
    }
  });
  return;
}

//Subir imagen de trabajos y publicidad
else if (req.method === 'POST' && req.url === '/subirImagen') {
  const formidable = require('formidable');
  const { v4: uuidv4 } = require('uuid');
  const form = new formidable.IncomingForm({ multiples: false });
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error al parsear con formidable:', err);
      sendJSON(res, 500, { error: 'Error al procesar archivo' });
      return;
    }

    console.log('Valor de tipo:', fields.tipo); // Verificar que se cargue la variable patrocinio


  const uploadDir = fields.tipo && fields.tipo[0] === 'patrocinio'
  ? path.join(__dirname, 'assets', 'imagenesPatrocinio')
  : path.join(__dirname, 'assets', 'imagenesProfesionales');

    console.log('Carpeta de subida:', uploadDir); // Verificar la carpeta de subida

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    form.uploadDir = uploadDir;

    let file = files.imagen;
    if (Array.isArray(file)) file = file[0];
    if (!file || !file.originalFilename) {
      sendJSON(res, 400, { error: 'No se recibió ninguna imagen válida' });
      return;
    }

    const ext = path.extname(file.originalFilename);
    const newFileName = uuidv4() + ext;
    const newPath = path.join(uploadDir, newFileName);
    fs.rename(file.filepath, newPath, (err) => {
      if (err) {
        console.error('Error al mover archivo:', err);
        sendJSON(res, 500, { error: 'Error al guardar imagen' });
        return;
      }
      sendJSON(res, 200, { success: true, filename: newFileName });
    });
  });
  return;
}

/*
//Subir imagen de trabajos anteriores
else if (req.method === 'POST' && req.url === '/subirImagen') {
  const formidable = require('formidable');
  const { v4: uuidv4 } = require('uuid');
  const form = new formidable.IncomingForm({ multiples: false });
  const uploadDir = path.join(__dirname, 'assets', 'imagenesProfesionales');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  form.uploadDir = uploadDir;
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error al parsear con formidable:', err);
      sendJSON(res, 500, { error: 'Error al procesar archivo' });
      return;
    }

    let file = files.imagen;
    if (Array.isArray(file)) file = file[0];

    if (!file || !file.originalFilename) {
      sendJSON(res, 400, { error: 'No se recibió ninguna imagen válida' });
      return;
    }

    const ext = path.extname(file.originalFilename);
    const newFileName = uuidv4() + ext;
    const newPath = path.join(uploadDir, newFileName);

    fs.rename(file.filepath, newPath, (err) => {
      if (err) {
        console.error('Error al mover archivo:', err);
        sendJSON(res, 500, { error: 'Error al guardar imagen' });
        return;
      }

      sendJSON(res, 200, { success: true, filename: newFileName });
    });
  });

  return;
}
*/
// Eliminar imagen del servidor
else if (req.method === 'POST' && req.url === '/eliminarImagen') {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    try {
      const { filename } = JSON.parse(body);
      if (!filename) throw new Error('Falta filename');

      // Sanitizar filename para evitar path traversal
      const safeFilename = path.basename(filename);
      const imgPath = path.join(__dirname, 'assets', 'imagenesProfesionales', safeFilename);

      fs.unlink(imgPath, (err) => {
        if (err) {
          console.error('Error eliminando imagen:', err);
          sendJSON(res, 500, { error: 'No se pudo eliminar la imagen' });
          return;
        }
        sendJSON(res, 200, { success: true });
      });
    } catch (err) {
      sendJSON(res, 400, { error: 'JSON inválido o filename inválido' });
    }
  });
  return;
}



  // Archivos estáticos
  
  else {
  if (req.url.startsWith('/assets/imagenesPatrocinio/')) {
    const filePath = path.join(__dirname, req.url);
    serveStaticFile(filePath, res);
  } else {
    const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    serveStaticFile(filePath, res);
  }
}
  /*
  else {

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
        res.writeHead(404, { 'Access-Control-Allow-Origin': '*' });
        res.end('Not found');
      } else {
        const type = contentType[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*' });
        res.end(content);
      }
    });
  }
*/
  
  } catch (error) {
    console.error('Error en el servidor:', error);
    sendJSON(res, 500, { error: 'Error interno del servidor' });
  }
}).listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});