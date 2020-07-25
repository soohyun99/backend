var express = require('express');
var app = express();
var cmd = require('node-cmd');

app.listen(3001,function(){
    console.log('start! express server on port 3001');
});

app.use(express.static('public'));
// url routing
app.get('/',function(req,res){
    res.sendFile(__dirname + "/public/main.html");
});
app.get('/result',function(req,res){	
	res.sendFile(__dirname+'/public/result/result_' + req.query.geo+'.html');
});

app.get('/json_result',function(req,res){	
	res.sendFile(__dirname+'/public/json_result/result_' + req.query.geo+'.json');
});

/*국가명 = "미국, 아르헨티나, 오스트리아, 오스트레일리아, 벨기에, 브라질, 캐나다, 스위스, 칠레, 콜롬비아, 체코
독일, 덴마크, 이집트, 핀란드, 프랑스, 영국, 그리스, 홍콩, 헝가리, 인도네시아
아일랜드, 이스라엘, 인도, 이탈리아, 일본, 케냐, 한국, 멕시코, 말레이시아, 나이지리아
네덜란드, 노르웨이, 뉴질랜드, 필리핀, 폴란드, 포르투갈, 루마니아, 러시아, 사우디아라비아, 스웨덴
싱가포르, 태국, 터키, 대만, 우크라이나, 베트남 
*/
var countries = ["US", "AR", "AT", "AU", "BE", "BR", "CA", "CH", "CL", "CO", "CZ",
				"DE", "DK", "EG","FI", "FR", "GB", "GR", "HK", "HU", "ID",
				"IE", "IL", "IN", "IT", "JP", "KE", "KR", "MX", "MY", "NG", 
				"NL", "NO", "NZ", "PH", "PL", "PT", "RO", "RU", "SA", "SE", 
				"SG", "TH", "TR", "TW", "UA", "VN"];

var transLangs = ["en", "es", "de", "en", "fr", "pt", "en", "de", "es", "es", "cs",
				"de", "da", "ar", "fi", "fr", "en", "el", "zh-TW", "hu", "id", 
				"ga", "he", "hi", "it", "ja", "en", "ko", "es", "ms", "en", "nl",
				"no", "en", "tl", "pl", "pt", "ro", "ru", "ar", "sv", "en", 
				"th", "tr", "zh-TW", "uk", "en", "vi"];

//setInterval(function(){ 
	for (var i=0;i<countries.length;i++) { // 모든 국가에 대한 키워드 크롤링
		var geo = countries[i];
		var transLanguage = transLangs[i];
		// cmd.get(
		// 	"rm public/json_result/result_"+ geo + ".json"
		// );
		cmd.get(
			"node public/main_json.js "+ geo + " "+ transLanguage
		);
	}
//}, 360000); // 1시간에 1번 실행
