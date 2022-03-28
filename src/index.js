const express = require('express');
const app = express();
const cache = require('./cache.js');
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const helmet = require('helmet');
const path = require('path');

app.use(helmet());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
  var query = "";
  if(req.query.q) query = req.query.q;
  res.render('home', { url: `/audio/${(`${query}`).split(" ").join("+")}` });
}) 

app.get('/info/:id', async (req,res) => {
  try {
    var query = req.params.id;
    if(!query)return res.send({
      title: 'Youtube Audio Player'
    });
    if(cache.get(`${query}`))return res.send(cache.get(`${query}`));
    var result = await yts(`${query} lyrics`);
    if(!result?.videos)return res.send({
      title: 'Not Found'
    });
    var video = result?.videos[0];
    if(!video || !video.url)return res.send({
      title: 'Not Found'
    });
    cache.set(`${query}`, video);
    res.send(video);
  }catch(e) {
    return res.send({
      title: 'Something Went Wrong'
    });
  }
})

app.get('/audio/:id', async (req,res) => {
  try {
    var query = req.params.id;
    if(!query)return res.send(400).send({
      message: 'Please provide a query'
    });
    if(cache.get(`${query}`))return ytdl(cache.get(`${query}`)?.url).pipe(res);
    var result = await yts(`${query} lyrics`);
    if(!result?.videos)return res.send(404).send({
      message: '404 Not Found'
    });
    var video = result?.videos[0];
    if(!video || !video.url)return res.send(404).send({
      message: '404 Not Found'
    });
   cache.set(`${query}`, video);
   ytdl(video.url).pipe(res);
      }catch(e) {
    return res.status(404).send({
      message: 'Something Went Wrong'
    })
  }
})

app.listen(3000)  
