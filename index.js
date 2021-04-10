const express = require('express');
const mysql = require('mysql');
const Datastore = require('nedb');
const app = express();
const fs = require('fs');
const { CONNREFUSED } = require('dns');
var coords = [];
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const con = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '12345678',
		database: 'MIDIAVOX'
});
con.connect();
app.get('/api',  (request,response) =>{
	console.log('received get request');
	con.query("SELECT * FROM TBA_DESTINATION", (err, result, fields) =>{
		if(err) {console.error(err);}
		console.log(result);
		response.json(result);
	});

})

app.get('/api/:id',  (request,response) =>{
	console.log('received get_id request');
	$query = 'SELECT * FROM TBA_DESTINATION WHERE DTN_ID = ' + request.params.id; 
	con.query($query, (err, result, fields) =>{
		if(err) {console.error(err);}
		response.json(result);
	});
})

app.get('/api/destination/:destination',  (request,response) =>{
	console.log('received get_destination request');
		$query = 'SELECT * FROM TBA_DESTINATION WHERE DTN_DESTINATION = ' + request.params.destination; 
		con.query($query, (err, result, fields) =>{
			if(err) {console.error(err);}
			console.log(result);
			response.json(result);
		});
})

app.delete('/api/:id',  (request,response) =>{
	console.log('received delete request');
	$query = 'DELETE FROM TBA_DESTINATION WHERE DTN_ID = ' + request.params.id; 
	con.query($query, (err, result, fields) =>{
		if(err) {console.error(err);}
		response.json(result);
	});
})

app.put('/api/:id',  (request,response) =>{
	console.log('received put request');
	destination = request.body;
	$query = 'UPDATE TBA_DESTINATION SET DTN_DESTINATION = ' + destination.destination + ' WHERE DTN_ID = ' +request.params.id; 
	con.query($query, (err, result, fields) =>{
		if(err) {console.error(err);}
		response.json(result);
	});
})


// app.put('/api/:id', (request, response) =>{
// 	console.log('received request');
// 	const data = request.body;

// 	con.connect(err =>{
// 		if(err) {console.error(err);}
// 		$query = "INSERT INTO TBA_DESTINATION (DTN_ID,DTN_DESTINATION) VALUES (" + data.lat + ',' + data.lon
// 		+ ')';
// 		con.query($query, (err, result, fields) =>{
// 			if(err) {console.error(err);}
// 			response.json({
// 				status:'success'
// 			});
// 		})
// 	});
// 	if(coords.length >= 10){
// 		let json = JSON.stringify(coords);
// 		fs.writeFile('coords.json', json,'utf8', err =>{
// 			if (err) {
// 				console.log('Some error occured - file either not saved or corrupted file saved.');
// 			}else{
// 				console.log('It\'s saved!');
// 			}
// 		});
// 	}
// 	console.log(coords);
// 	response.json({
// 		status: 'success',
// 		latitude: data.lat,
// 		longitude: data.lon
// 	});
// });