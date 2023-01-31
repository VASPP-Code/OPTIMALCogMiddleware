var express = require('express');
var bodyParser = require('body-parser')
var https = require('https');
const fs = require('fs');
var path = require('path');
var pdf = require("pdf-creator-node");
var request = require('request');
var phantomjs = require('phantomjs');
var nodemailer = require('nodemailer');
var app = express();
/* app.use(express.static('./'));
app.use(express.static('optimalcog')); */
app.use( bodyParser.json({limit: '10mb', extended: true}) );
app.use(bodyParser.urlencoded({limit: '10mb', extended: true, parameterLimit: 1000000})); 


// var html = fs.readFileSync("report template.html", "utf8");

const baseURL = "http://127.0.0.1:1337"

app.get("^(\/OptimalCog)?\/uploads/*", function(req, res){
	
	console.log(req.url)
	console.log(req.url.split("OptimalCog"))
	var len = req.url.split("OptimalCog").length

	
	request(baseURL+req.url.split("OptimalCog")[len-1],{headers:req.headers})
    .on('response', function(response) {
      if (response.headers['content-length'] > 10*1024*1024) {
        res.send('Image too large.');
      } else if (!~[200, 304].indexOf(response.statusCode)) {
		console.log(response.statusCode);
        res.send('Received an invalid status code.');
      } else if (!response.headers['content-type'].match(/image/)) {
        callback(new Error('Not an image.'))
      } else {
        var body = ''
        response.setEncoding('binary')
        response
          .on('error', function(err) {
            callback(err)
          })
          .on('data', function(chunk) {
			console.log(typeof(chunk))
            body += chunk
          })
          .on('end', function() {
				// res.setHeader('content-type', response.headers['content-type'])
				// res = body.toString("binary");
				res.write(new Buffer(body.toString('binary'), "binary"))
				res.end()
          })
      }
	})
	// request(baseURL+req.url.split("OptimalCog")[1]).pipe(fs.createReadStream()).on('close', res.send("Success"));
})

app.get("^(\/OptimalCog)?\/*", function(req, res){
	
	console.log(req.url)
	console.log(req.url.split("OptimalCog"))
	var len = req.url.split("OptimalCog").length
	request.get(baseURL+req.url.split("OptimalCog")[len-1],{headers:req.headers}, (error, response, body) => {
		if(error){
			res.end(JSON.stringify({'status':'Error', 'message':error.toString()}))
		}
		else{
			// try{
				// body = JSON.stringify(body)
			// }
			// catch (e){
				// console.log(e.toString())
			// }
			res.end(body)
		}
	});
})


// app.post("^(\/OptimalCog)?\/sendMail", function(req, res){
	// /* req.body.data.quotItems.forEach(function(i){
		// console.log(i['image']
	// }) */
	// var html = fs.readFileSync("report template.html", "utf8");
	// var options = {
		// phantomPath: "/home/ec2-user/danao_ui5/node_modules/phantomjs/bin/phantomjs",
        // format: "LETTER",
        // orientation: "portrait",
        // border: "10mm",
        // /* header: {
            // height: "45mm",
            // contents: ''
        // },
        // footer: {
            // height: "28mm",
            // contents: {
                // first: 'Cover page',
                // 2: 'Second page', // Any page number is working. 1-based index
                // default: '', // fallback value
                // last: 'Last Page'
            // }
        // } */
		// localUrlAccess: true,
    // };
	// for(var i=0; i<req.body.data.quotItems.length; i++){
		// // console.log(req.body.data.quotItems[i].image);
		// req.body.data.quotItems[i].image1 = req.body.data.quotItems[i].image;
	// }
	// var document = {
	  // html: html,
	  // phantomPath : "./node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs",
	  // data: req.body.data,
	  // path: "./output.pdf",
	  // type: "stream",
	// };
	// // By default a file is created but you could switch between Buffer and Streams by using "buffer" or "stream" respectively.


	// pdf
	  // .create(document, options)
	  // .then((resp) => {
		
		
		// // create reusable transporter object using the default SMTP transport
		// var transporter = nodemailer.createTransport({
		  // service: 'Gmail',
			// /* auth: {
				// user: 'ehs.managementsystem@gmail.com',
				// pass: 'ubrrgkgayeqlmbnp'
			// }, */
			// auth:{
				// user:'danaoproapsys@gmail.com',
				// pass:'ybwdkbbyskinfufm'
			// },
		  // secure: true, // use TLS
		  // tls: {
			// // do not fail on invalid certs
			// rejectUnauthorized: false,
		  // },
		// });
		
		// // send mail with defined transport object
		// transporter.sendMail({
			// from: 'ehs.managementsystem@gmail.com', // sender address
			// to: req.body.to, // list of receivers
			// cc: req.body.cc,
			// bcc: req.body.bcc,
			// subject: req.body.subject, // Subject line
			// text: req.body.body, // plain text body
			// html: req.body.html, // html body
			// attachments: [{"filename": "quotation.pdf",
			// "contentType": 'application/pdf',
            // "content":resp}], // attachments
		// }, function(error, info) {
			// console.log("Mail");
			// if(error) {
				// console.log(error)
				// res.end(JSON.stringify({'status':'Error', 'message':error }))
			// } else {
				// console.log(info.response)
				// res.end(JSON.stringify({'status':'Success', 'message':info.response }))
			// }
		// });
	  // });
		

// })

app.post("^(\/OptimalCog)?\/*", function(req, res){
	console.log(req.url.split("OptimalCog"))
	var len = req.url.split("OptimalCog").length
	request.post(baseURL+req.url.split("OptimalCog")[len-1], {
		json: req.body
	}, (error, response, body) => {
		if (error) {
			res.end(JSON.stringify({'status':'Error', 'message':error.toString()}))
		}else{
			try{
				body = JSON.stringify(body)
			}catch(e){
				res.end(e.toString())
			}
			res.end(body)
		}
	})
})

app.put("^(\/OptimalCog)?\/*", function(req, res){
	
	var len = req.url.split("OptimalCog").length
	request.put(baseURL+req.url.split("OptimalCog")[len-1],{headers:req.headers}, {
		json: req.body
	}, (error, response, body) => {
		if (error) {
			res.end(JSON.stringify({'status':'Error', 'message':error.toString()}))
		}else{
			try{
				body = JSON.stringify(body)
			}catch(e){
				res.end(e.toString())
			}
			res.end(body)
		}
	})
})

app.delete("^(\/OptimalCog)?\/*", function(req, res){
	
	var len = req.url.split("OptimalCog").length
	request.delete(baseURL+req.url.split("OptimalCog")[len-1], {
		json: req.body,
		headers:request.headers
	}, (error, response, body) => {
		if (error) {
			res.end(JSON.stringify({'status':'Error', 'message':error.toString()}))
		}else{
			try{
				body = JSON.stringify(body)
			}catch(e){
				res.end(e.toString())
			}
			res.end(body)
		}
	})
})



/* const sslServer = https.createServer({
	key: fs.readFileSync(path.join(__dirname, 'cert', 'private.key')),
	cert: fs.readFileSync(path.join(__dirname, 'cert', 'certificate.crt'))
}, app);


sslServer.listen(3050, function(){
	console.log('Secure Server on port 3050');
}); */

// The app listens on port 3010 and prints the endpoint URI in console window.
var server = app.listen(3060,'0.0.0.0', function () {
    console.log('Server running at http://0.0.0.0:3060/');
});
