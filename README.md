# 백엔드 

## 프로그램 개발 시 버전 설명
1) node 버전 : v12.13.1

2) npm 버전  : 6.12.1

### 백엔드 패키지 다운로드 시 주의사항 
* master 브랜치에서 npm i로 노드 모듈을 새로 다운받는다
	* package-lock.json 파일 다운로드 시 참고 자료: [package-lock.josn에 관하여](https://medium.com/@han7096/package-lock-json-%EC%97%90-%EA%B4%80%ED%95%98%EC%97%AC-5652f90b734c)

* package-lock.json 의 역할: 백엔드 작동을 위해 필요한 모듈 리스트로 `npm install (모듈이름)` 를 터미널해서 작동하면 원하는 모듈들을 로컬 컴퓨터에 설치 가능하다. 

### 

## 백엔드 코드 설명 

1. <b>app.js</b> : 나라별 크롤링을 실행시키는 javascript 파일
2. <b>public/main_json.js</b> : 구글 트렌드 사이트를 각 나라별로 크롤링해오고 Google Translate API를 이용해서 번역한 결과를 json 파일 형식으로 저장하는 javascript 파일
3. <b>public/json_result</b> : 백엔드에서 생성한 json파일을 포함하는 폴더. 프론트엔드에서 데이터를 보여주기 위해 참조.

## 1. app.js 

### Express 앱을 사용해 원하는 경로로 웹사이트 페이지를 이동합니다.
Express 앱을 사용하기 위해 미들웨어 작성합니다. 
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
### [Google Trends 웹 사이트](https://trends.google.com/trends/trendingsearches/daily?geo=KR)에서 원하는 데이터 웹 크롤링합니다.
Node.js 내장 모듈인 Request 모듈을 이용해 인터넷에 요청을 보내고 요청에 해당하는 페이지를 가져온다. Cheerio 모듈을 이용해 받아온 페이지를 파싱하여 전체 페이지 중에서 필요한 부분의 정보만 가져옵니다. 
```javascript
var cheerio = require('cheerio');
var request = require('request');
```
[구글 트렌드 웹 페이지](https://trends.google.com/trends/trendingsearches/daily)에서 가져올 국가 코드 및 번역할 언어 코드 변수에 저장합니다. 
cmd로 실행할 때 사용한 `geo`가 US, `transLanguage`가 en라면  `sourceUrl`은 변수 값은 https://trends.google.com/trends/trendingsearches/daily?geo=US이 될 것입니다. 

``` js
// cmd로 실행할 때 사용한 argument 가져오기
var geo = process.argv.slice(2)[0]; // 구글 트랜드에서 검색할 국가 코드
var transLanguage = process.argv.slice(2)[1]; // 번역할 언어 코드

var sourceUrl = 'https://trends.google.co.kr/trends/trendingsearches/daily/rss?geo=' + geo;
var title = new Array(),
	description = new Array(),
	date = new Array(),
	title_trans = new Array();
```

웹사이트에서 크롤링해오는 트렌드 뉴스의 날짜와 요일을 한국어로 번역하여 반환하는 `convertWeekDaysByKorean()`함수 `getDataFormat()`함수를 정의합니다. 
```
// 요일 번역
function convertWeekDaysByKorean(weekday) {
	if (weekday.length < 1) {
    	return "";
	}

    weekday = weekday.substring(0, weekday.length-1);
    switch (weekday) {
    	case "Mon" :
    		return "월요일";
    	case "Tue" :
        	return "화요일";
    	case "Wed" :
        	return "수요일";
    	case "Thu" :
        	return "목요일";
    	case "Fri" :
        	return "금요일";
    	case "Sat" :
        	return "토요일";
    	case "Sun" :
        	return "일요일";
	}
    return "";
}

function getDataFormat(date) {
	let MONTHS = {Jan : "1", Feb : "2", Mar : "3", Apr : "4", May : "5", Jun : "6", Jul : "7", Aug : "8", Sep : "9", Oct : "10", Nov : "11", Dec : "12"}
	let arr = date.split(' ');

	if (arr.length >= 4) {
    	return (arr[3] + "년 " + MONTHS[arr[2]] + "월 " + arr[1] + "일 " + convertWeekDaysByKorean(arr[0]));
	}
	else {
    	return "";
	}
}
```
request 모듈을 이용해서 cheerio로 불러오고 $에 cheerio.load를 합니다. 
```js
// 크롤링하기
request(sourceUrl, function(error, response, html){
	if (!error) {
		var $ = cheerio.load(html, {xmlMode : true});

		// 키워드
		$('item').each(function () {
		  title.push($(this).children('title').text());
		});

		// 날짜
		$('item').each(function () {
		  let pubDate = $(this).children('pubDate').text();
		  date.push(getDataFormat(pubDate));
		});

		// 키워드 설명
		$('item').each(function () {
			description.push($(this).children('ht\\:news_item').children('ht\\:news_item_title').text());
		});
		
```

번역할 문장을 생성합니다. 
``` JAVASCRIPT
// 번역 및 출력 함수 정의
		async function logData(title, date, description){
			let tempDate, rank = 1;
			let dateCount = 0;

			var allContents = "";
			var transContents = "";
			for (let i = 0; i < 10; i++) { // 번역할 전체 문장 생성
				if (tempDate != date[i]) { // 오늘의 keyword 10위까지만 보이게 제한
					if(dateCount<2) dateCount++;
					if(dateCount==2) break; // 다른 날짜 keyword인 경우 중지
					tempDate = date[i];
				}
				allContents = allContents + title[i] + "^" + description[i] + "^";
			}
```

### [Google Translate Api 모듈](https://github.com/vitalets/google-translate-api)을 이용해 크롤링 결과를 한국어로 번역합니다.
```javascript
const translate = require('@vitalets/google-translate-api')

// 번역 함수
async function translateFn(text){
	var res = await translate(text, {from: transLanguage, to: 'ko'});
	return res.text;
}
```

크롤링 결과 번역하는 `translateFn`함수 호출하여 배열에 저장합니다.
``` JAVASCRIPT
// transContents = allContents;
if (geo == "KR") // 한국 트랜드는 번역 안함
	transContents = allContents;
else // 해외 트랜드 번역하기
	transContents = await translateFn(allContents);

// 번역된 문장 배열로 저장
	var translatedContents = new Array();
	translatedContents = transContents.split('^');
```




### 크롤링 후 번역을 끝낸 데이터를 json 형식의 파일로 저장합니다. 
```javascript
const fs = require('fs')
```
``` js
// json 파일명 설정
var fileName = './public/json_result/result_'+geo+'.json';
		
const resultJson = JSON.stringify(all);
				fs.writeFileSync(fileName, resultJson);
```

크롤링 및 번역 결과를 JSON 파일형식으로 저장하기 위해 size, date, keyword라는 이름의 json array 및 json object 정의합니다.
``` JS
// 최상위 json array 정의
const all = {
	sizes: new Array(),
	dates: new Array(),
	keywords: new Array()
}

var sizeArray = new Array();
var dateArray = new Array();
var keywordArray = new Array();

// size json object 정의
const size = {
	size: 0
}

// date json object 정의
const date = {
	date: tempDate
}
dateArray.push(date);

// keyword json object 정의
const keyword = {
	title: "",
	content: ""
}
```
각 키워드에 대해서 번역하여 배열에 저장해 두었던 결과를 `keywordArray` 배열에 추가합니다. 
```js
// 각 키워드에 대해
for (let rank = 0; rank<(translatedContents.length/2 - 1); rank++) {
	var keywordJSON = new Object();
	keywordJSON.title = translatedContents[rank*2];
	keywordJSON.content = translatedContents[rank*2+1];
	keywordArray.push(keywordJSON); // keyword array에 키워드 추가
}
```

각 나라별 트렌드의 개수를 의미하는 `sizeArray` 배열과, 날짜를 의미하는 `dateArray'배열, `keywordArray`배열을 json 배열 `all`에 저장합니다.
```js
size.size = keywordArray.length;
sizeArray.push(size);

all.sizes = sizeArray;
all.dates = dateArray;
all.keywords = keywordArray;
````
`resultJson`은 `JSON.stringify()`를 이용해 all 객체를 Json 문자열로 변환한 결과값이다. `fileName`이름의 json 파일로 resultJson 값을 저장해줍니다.
```javascript
const resultJson = JSON.stringify(all);
fs.writeFileSync(fileName, resultJson);
```

## 3. json_result 폴더 

크롤링 및 번역 결과 생성된 파일들이 `result_(국가코드).json` 형식으로 저장되어 있습니다. 

