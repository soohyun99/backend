var cheerio = require('cheerio');
var request = require('request');
const translate = require('@vitalets/google-translate-api')
const fs = require('fs')

// cmd로 실행할 때 사용한 argument 가져오기
var geo = process.argv.slice(2)[0]; // 구글 트랜드에서 검색할 국가 코드
var transLanguage = process.argv.slice(2)[1]; // 번역할 언어 코드

var sourceUrl = 'https://trends.google.co.kr/trends/trendingsearches/daily/rss?geo=' + geo;
var title = new Array(),
	description = new Array(),
	date = new Array(),
	title_trans = new Array();

// 번역 함수
async function translateFn(text){
	var res = await translate(text, {from: transLanguage, to: 'ko'});
	return res.text;
}

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

		// json 파일명 설정
		var fileName = './public/json_result/result_'+geo+'.json';
		//fs.unlinkSync(fileName);

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
			
			try{
				// transContents = allContents;
				if (geo == "KR") // 한국 트랜드는 번역 안함
					transContents = allContents;
				else // 해외 트랜드 번역하기
					transContents = await translateFn(allContents);

				// 번역된 문장 배열로 저장
				var translatedContents = new Array();
				translatedContents = transContents.split('^');
			
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
				
				// 각 키워드에 대해
				for (let rank = 0; rank<(translatedContents.length/2 - 1); rank++) {
					var keywordJSON = new Object();
					keywordJSON.title = translatedContents[rank*2];
					keywordJSON.content = translatedContents[rank*2+1];
					keywordArray.push(keywordJSON); // keyword array에 키워드 추가
				}
				
				size.size = keywordArray.length;
				sizeArray.push(size);
				
				all.sizes = sizeArray;
				all.dates = dateArray;
				all.keywords = keywordArray;
				
				const resultJson = JSON.stringify(all);
				fs.writeFileSync(fileName, resultJson);
				
			} catch(e) {
				console.error(e);
			}
		} // 함수 정의 끝

		// 함수 호출
		logData(title, date, description);
	}
});
