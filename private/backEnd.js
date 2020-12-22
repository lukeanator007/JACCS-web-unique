const http = require('http');
const fs = require('fs');
const express = require('express');
const { url } = require('inspector');
const app= express();
const hostname = '127.0.0.1';
//const port = 3000; //local
const port = process.env.PORT; //heroku
const URL = require('url');
const database = require('./loadDataBase.js');



module.exports=
{
  main: function()
  {
    server.listen(process.env.PORT, "0.0.0.0", function() {
    //server.listen(3000, "127.0.0.1", function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
    });
  }
}


const server = http.createServer((req, res) => {
  console.log(req.url);
  if (req.url === '/') 
  {
    fs.readFile('index.html', function(err, data)
    {
      res.writeHead(200, {});
      res.write(data);

      return res.end();

    }); 
  }
  else if(req.url.startsWith("/server"))
  {
    res.writeHead(200,{});
    return res.end(database.getServers());
  }
  else if(req.url.startsWith("/search?"))
  {
    var search = URL.parse(req.url, true).query;

    res.writeHead(200, {});
    database.getCards(search.server).then(cards => {
      res.end(database.filterCards(cards, search));
    });

    return;

  }
  else if(req.url.startsWith("/dataBase"))
  {
    //verify user
  }
  else if (req.url.indexOf('.')>-1) 
  {
    if(!req.url.startsWith("/"))
    {
      res.writeHead(403,{});
      return res.end();
    }
    if(req.url.startsWith("/private"))
    {
      res.writeHead(403,{});
      return res.end();
    }
    try {
      let path=req.url.substring(1, req.url.length);
      if(fs.existsSync(path)) {
        fs.readFile(path, function(err, data) 
        {
          if (err) throw err;
          res.statusCode=200;
          res.write(data);
          res.end();
        });  

      } 

    } catch (err) {
        console.error(err);
    }

    
  }
  else 
  {
    
    console.log(req.url);
    console.log(req.data);

  }

});






