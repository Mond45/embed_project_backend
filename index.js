import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'
import { initializeApp } from 'firebase/app';
import { addDoc, collection, getDocs, getFirestore, orderBy, query, limit } from 'firebase/firestore'
import cors from 'cors';

dotenv.config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "embed-final-project.firebaseapp.com",
    projectId: "embed-final-project",
    storageBucket: "embed-final-project.appspot.com",
    messagingSenderId: "941469027783",
    appId: "1:941469027783:web:b656108bab75676c6b5de2"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp)

const app = express();

const corsOption = { origin: true, credentials: true };
app.use(cors(corsOption));

app.use(bodyParser.json());

app.get('/', async (req, res) => {
    const data = [];
    const q = query(collection(db, "data"), orderBy("date", "desc"), limit(60 * 24));
    const doc = await getDocs(q);
    doc.forEach((d) => {
        const { humidity, soil, light, date } = d.data();
        data.push({ humidity: humidity, soil: soil, light: light, date: date });
    });
    res.send(JSON.stringify(data));
});

app.post('/', async (req, res) => {
    const data = { ...req.body, date: Date.now() };
    const docRef = await addDoc(collection(db, "data"), data)
    res.send(`added data to db: {${data}} with id ${docRef.id}`);
});

app.listen(5000);

module.exports = app;