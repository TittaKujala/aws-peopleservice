var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var fs=require('fs');
var cors = require('cors')
app.use(cors())
var parser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json());
app.use(express.static('public'));

var uusi_id;

router.route('/people').get(function (req, res){
    console.log("Kutsuit restpalvelua");
    //res.send({msg:"Moro, Keilaranta!"});
    res.json(people);
}).post(function (req, res){
    console.dir(req.body);
    let newPerson=req.body;
    newPerson.id=uusi_id;
    people.push(newPerson);
    tallenna();
    uusi_id++;
    console.log("Henkilö luotu...");
    res.status(201).send(newPerson);
});
router.route('/people/:id').get(function (req, res){
    console.log(req.params.id);
    for(let p of people){
        if(p.id==req.params.id){
            res.json(p);
            return;
        }
    }
    res.status(400).json({error: "Ei löydy"});
}).delete(function (req, res){
    console.log(req.params.id);
    for(let i=0;i<people.length;i++){
        if(people[i].id==req.params.id){
            people.splice(i,1)
            res.json({msg: 'Person removed'}); 
            tallenna();
            return;
        }
    }
    res.status(400).json({error: "Ei löydy"});
}).put(function (req, res){
    console.dir(req.body);
    for(let i=0;i<people.length;i++){
        if(people[i].id==req.params.id){
            people[i]=req.body;
            res.json(people[i]); 
            tallenna();
            return;
        }
    }
    res.status(400).json({error: "Ei löydy"});
})

function tallenna(){
    fs.writeFile("henkilot.json", JSON.stringify(people), function(){
        console.log("Tallennettu tiedostoon");
    });
}
app.use('/api', router);
var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    fs.readFile("henkilot.json",function(err, data){
        people=JSON.parse(data);
        uusi_id=Math.max.apply(null, people.map(function(p) { return p.id; }))+1;
        console.log("Uusi id: " + uusi_id);
        });
    
    console.log("Now listening at http://%s:%s", host, port)
})
/*
[{"id":1,"name":"Anna Malli","email":"anna@malli.fi"}, {"id":2,"name":"Timo Malli","email":"timo@malli.fi"}, {"id":3,"name":"Teemu Malli","email":"teemu@malli.fi"}]
*/
