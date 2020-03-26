var express = require('express');
var app = express();
var cmd = require('node-cmd');

app.listen(3001,function(){
    console.log('start! express server on port 3001');
});

app.use(express.static('public'));
// url routing
app.get('/',function(req,res){
    res.sendFile(__dirname+"/public/main.html");
});
app.get('/result',function(req,res){
	res.sendFile(__dirname+'/public/result/result_'+req.query.geo+'.html');
})
app.get('/crawler_result',function(req,res){
	res.sendFile(__dirname+"/public/crawler_result.html");
})
/*
var countries = ["AR", "AT", "AU"];
var trnasLangs = ["AR", "AT", "AU"]; // 이거 각 나라에 맞는 코드 찾아서 써야 되는데 못찾아서 그냥 똑같이 써놨어 ㅠㅠ //아하 오키 추가로 찾아보자

*/
var countries = ["BR","CH","SA","SE","SG","AR","IE","GB","AU","AT","UA","IL","EG","IT","IN",
"ID" , "CZ", "CL", "CA", "KE", "CO","TH",  "TR", "PT", "PL", "FR", "FI", "PH", "HU", "HK", "JP", "US", "GR", "NG", "NL", "NO", "NZ", "TW", "DK", "DE", "RU", "RO", "MY", "MX", "VN", "BE", "KR"];
var transLangs = ["BR","CH","SA","SE","SG","AR","IE","GB","AU","AT","UA","IL","EG","IT","IN",
"ID" , "CZ", "CL", "CA", "KE", "CO","TH",  "TR", "PT", "PL", "FR", "FI", "PH", "HU", "HK", "ja", "US", "GR", "NG", "NL", "NO", "NZ", "TW", "DK", "DE", "RU", "RO", "MY", "MX", "VN", "BE", "KO"];

setInterval(function(){
 for (var i=0;i<countries.length;i++) { // 모든 국가에 대한 키워드 크롤링
	var geo = countries[i];
	var transLanguage = transLangs[i];
	cmd.get(
		"node public/main.js "+ geo + " "+ transLanguage +" > public/result/result_"+geo.toLowerCase()+".html"
 	);
}
}, 360000);
