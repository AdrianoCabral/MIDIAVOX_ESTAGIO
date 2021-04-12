const express = require('express');
const mysql = require('mysql');
const fetch = require('node-fetch');
const app = express();
const fs = require('fs');
const { CONNREFUSED } = require('dns');
var flag = false;
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
app.get('/destination?',  (request,response) =>{
	console.log('received get request');
	id = request.query.id;
	destination = request.query.destination;
	$query = "";
	if(id.length == 0){
		if(destination.length == 0){
			$query = "SELECT * FROM TBA_DESTINATION";
		}else{
			$query = 'SELECT * FROM TBA_DESTINATION WHERE DTN_DESTINATION = ' + destination;
		}
	}else{
		if(destination.length == 0){
			$query = 'SELECT * FROM TBA_DESTINATION WHERE DTN_ID = ' + id
		}else{
			$query = 'SELECT * FROM TBA_DESTINATION WHERE DTN_ID = ' + id + ' AND DTN_DESTINATION = ' + destination;
		}
	}	
	con.query($query, (err, result, fields) =>{
		if(err) {console.error(err);}
		response.json(result);
	});

})

app.delete('/destination/:id',  (request,response) =>{
	console.log('received delete request');
	$query = 'DELETE FROM TBA_DESTINATION WHERE DTN_ID = ' + request.params.id; 
	con.query($query, (err, result, fields) =>{
		if(err) {
			response.status(404).send({message: "Not Found"});
		}else{
			response.status(204).send({message: "No Content"});
		}
	});
})

app.put('/destination/:id',  async (request,response) =>{
	console.log('received put request');
	id = request.params.id;
	const destination = request.body.destination;
	url = 'http://localhost:3000/destination/?id='+id+'&destination='
	await fetch(url,{method: 'GET'})
	.then(response =>{
		return response.json();
	}).then(response =>{
		if(response.length > 0){flag = true};
	})
	.catch(err =>{
		console.error(err);
	});
	if(flag){
		flag = false;
		$query = 'UPDATE TBA_DESTINATION SET DTN_DESTINATION = ' + destination + ' WHERE DTN_ID = ' + id; 
		con.query($query, (err, result, fields) =>{
			if(err) {console.error(err);}
			response.status(204).send({message: 'No Content'});
		});
	}else{
		$query = "INSERT INTO TBA_DESTINATION (DTN_ID,DTN_DESTINATION) VALUES (" + id + ', ' + destination + ')';
		con.query($query, (err, result, fields) =>{
			if(err) {console.error(err);}
			response.status(204).send({message: 'No Content'});
		});
	}

		

})

// app.post('/destination',   (request,response) =>{
// 	console.log('received post request');
// 	data = request.body;
// 	console.log(data);
		
// 	$query = "INSERT INTO TBA_DESTINATION (DTN_ID,DTN_DESTINATION) VALUES (" + data.id + ', ' + data.destination + ')';
// 	con.query($query, (err) =>{
// 		if(err) {
// 			response.status(409).send({message: 'id already exists'});
// 		}else{
// 			response.status(204).send({message: 'No Content'});
// 		}
// 	})
// })


// app.put('/destination/:id', (request, response) =>{
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