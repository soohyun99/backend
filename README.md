# 백엔드 구현 

###  패키지 다운로드 시 주의사항 
1) node  버전 : v12.13.1

2) npm 버전  : 6.12.1

### package-lock.json 의 역할

* master 브랜치에서 npm i로 노드 모듈을 새로 다운받는다

* 참고자로: [package-lock.josn에 관하여](https://medium.com/@han7096/package-lock-json-%EC%97%90-%EA%B4%80%ED%95%98%EC%97%AC-5652f90b734c)

Used 
* Node.js + Express + Google Translate API

Backend 

# 백엔드 코드 설명 

1. <b>app.js</b> : 나라별 크롤링을 실행시키는 javascript 파일
2. <b>public/main_json.js</b> : 구글 트렌드 사이트를 각 나라별로 크롤링해오고 Google Translate API를 이용해서 번역한 결과를 json 파일 형식으로 저장하는 javascript 파일
3. <b>public/json_result</b> : 백엔드에서 생성한 json파일을 포함하는 폴더. 프론트엔드에서 데이터를 보여주기 위해 참조.

## 1. app.js 

### Express 앱을 사용하기 위해 미들웨어 작성합니다. 
미들웨어 함수는 req 오브젝트, res 오브젝트 중 미들웨어 함수에 대한 권한을 갖는 함수입니다.

미들웨어 함수 호출을  get HTTP 메소드를 이용해 경로로 라우팅해서 미들웨어 함수를 작동시킵니다. Res 오브젝트는 미들웨어 함수에 대한 HTTP 응답 인수이며 req 오브젝트는 미들웨어 함수에 대한 HTTP 요청 인수이다. 

앱의 루트에 대한 요청을 실행할 때, 앱은 이제 요청이 실행시키는 미들웨어 함수를 함수를 작동시킵니다. 


```js
var express = require('express'); 
var app = express();

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

```
### 모든 국가에 대한 키워드 크롤링을 위해 국가 코드와 번역 코드를 리스트 형식으로 저장합니다.

app.js 파일을 작동시키면 지정해둔 나라별 국가코드와 그 나라의 언어를 한국어로 번역하여 json 파일을 만듭니다. 

```
/*국가명 = "미국, 아르헨티나, 오스트리아, 오스트레일리아, 벨기에, 브라질, 캐나다, 스위스, 칠레, 콜롬비아, 체코, 독일, 덴마크, 이집트, 핀란드, 프랑스, 영국, 그리스, 홍콩, 헝가리, 인도네시아, 아일랜드, 이스라엘, 인도, 이탈리아, 일본, 케냐, 한국, 멕시코, 말레이시아, 나이지리아, 네덜란드, 노르웨이, 뉴질랜드, 필리핀, 폴란드, 포르투갈, 루마니아, 러시아, 사우디아라비아, 스웨덴, 싱가포르, 태국, 터키, 대만, 우크라이나, 베트남 */

// 국가 코드 

var countries = ["US", "AR", "AT", "AU", "BE", "BR", "CA", "CH", "CL", "CO", "CZ", "DE", "DK", "EG","FI", "FR", "GB", "GR", "HK", "HU", "ID", "IE", "IL", "IN", "IT", "JP", "KE", "KR", "MX", "MY", "NG", "NL", "NO", "NZ", "PH", "PL", "PT", "RO", "RU", "SA", "SE", "SG", "TH", "TR", "TW", "UA", "VN"];

// 국가 언어 
var transLangs = ["en", "es", "de", "en", "fr", "pt", "en", "de", "es", "es", "cs", "de", "da", "ar", "fi", "fr", "en", "el", "zh-TW", "hu", "id",
"ga", "he", "hi", "it", "ja", "en", "ko", "es", "ms", "en", "nl", "no", "en", "tl", "pl", "pt", "ro", "ru", "ar", "sv", "en","th", "tr", "zh-TW", "uk", "en", "vi"];
```

### get command 를 이용해 크롤링 결과를 업데이트합니다.

1시간에 한 번씩 국가별 트렌드 키워드를 업데이트합니다. 
이를 위해 get command를 이용하며 우선 이미 만들어진 json 파일들을 삭제합니다. 그리고 get command를 이용해서 main_json.js 파일을 실행시킵니다. ` geo`  변수는 국가코드이며 `transLanguage`는 국가에서 사용하는 언어로 main_json.js에 옵션으로 전달하여 GoogleTranslate API 를 이용해 한국어로 번역하는 데 사용합니다.

``` js
setInterval(function(){
	for (var i=0;i<countries.length;i++) { // 모든 국가에 대한 키워드 크롤링 		var geo = countries[i]; 
			var transLanguage = transLangs[i]; 
			cmd.get( 
				"rm public/json_result/result_"+ geo + ".json" 
			); 		
			cmd.get(
	 			"node public/main_json.js "+ geo + " "+ 		transLanguage
 			); 
	}
}, 360000); // 1시간에 1번 실행
```

## 2. main_json.js


## 3. json_result 폴더 
