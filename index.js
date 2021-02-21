const express = require('express');
const bodyParser = require('body-parser');
const cons = require('consolidate');
const puppeteer = require('puppeteer');
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

//Definicion de variables locales
require('dotenv').config({path: 'variables.env'});

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.engine('html',cons.swig);
app.set('views','./views')
app.set('view engine','html');
app.get('/saludo',(req,res) => {
    res.render('index.html');
})

app.post('/saludo',(req,res) => {
    var nombre = req.body.nombre;
    (async()=>{
        const browser = await puppeteer.launch();
        const pages = await browser.newPage();
        await pages.goto('https://www.consultamiembrodemesa.eleccionesgenerales2021.pe/#/');
        await pages.type('#mat-input-0', `${nombre}`);

        await pages.click('.container-button button');
        await pages.waitForSelector('[id="consultaDefinitiva"]');
        await pages.waitForTimeout(4000);
        await pages.click('.btn');

        const enlaces = await pages.evaluate(()=>{
            const elements = document.querySelectorAll('.info p');
            const dataVoted = document.querySelectorAll('.place p');
            const p = [];

            for(element of elements){
                p.push(element.innerText);
            }
            for(elet of dataVoted){
                p.push(elet.innerText);
            }
            return p;
        })
        getData(enlaces);
    })();
    function getData(enlaces){
        enlaces.forEach(e=>{
            console.log(e);
        })
    }
    res.send("Su informacion esta siendo procesada:"+nombre);
    console.log(typeof(nombre));
    console.log(nombre);
})
//Leer localhost de variables y puerto
 app.listen(port,host,()=>{
     console.log('Server funcionando');
 });
