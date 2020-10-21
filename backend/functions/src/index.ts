
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as express from 'express'
import * as cors from 'cors';
// Configura la base de datos
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://firestoregrafics.firebaseio.com"

});

const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {

  response.json({
    msg: 'Hello world desde funciones!',
    valor: 10,
    error: 'error'
  }
  );
});

//el async regresa una promesa
export const getGoty = functions.https.onRequest(async (request, response) => {
  // const nombre = request.query.nombre;

  const gotyRef = db.collection('goty');
  // awair dice que espere a que async devuelva algo 
  const docSnap = await gotyRef.get();// Esto es la referencia a la base de datos,cuidado con enviar esto

  //obtiene toda la informacion de la base de datos
  const juegos = docSnap.docs.map(doc => doc.data());

  response.json(juegos);

}

);

//Express

const app = express();
app.use(cors({ origin: true }));

app.get('/goty', async (req, res) => {

  const gotyRef = db.collection('goty');

  const docSnap = await gotyRef.get();//  
  const juegos = docSnap.docs.map(doc => doc.data());

  res.json(juegos);
});

app.post('/goty/:id', async (req, res) => {

  const id = req.params.id;
  const gameRef = db.collection('goty').doc(id);

  const gameSnap = await gameRef.get();

  if (!gameSnap.exists) {
    res.status(404).json({
      ok: false,
      mensaje:'No existe ese id '+id
    });
  } else {
    const antes = gameSnap.data() || {votos:0};
    gameRef.update({
      votos: antes.votos + 1
    });


    res.json({
      ok: true,
      mensaje:`Gracias por tu voto a: ${antes.name}` 
    });
  }

});

export const api = functions.https.onRequest(app);
