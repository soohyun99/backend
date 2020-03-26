var cheerio = require('cheerio');
var request = require('request');
const translate = require('@vitalets/google-translate-api')

// cmd로 실행할 때 사용한 argument 가져오기
var geo = process.argv.slice(2)[0]; // 구글 트랜드에서 검색할 국가 코드
var transLanguage = process.argv.slice(2)[1]; // 번역할 언어 코드

var sourceUrl = 'https://trends.google.co.kr/trends/trendingsearches/daily/rss?geo='+geo;
var title = new Array(),
  description = new Array(),
  views = new Array(),
  date = new Array(),
  url = new Array();
  title_trans = new Array();

  // 번역 코드
  async function translateFn(text){
      var res = await translate(text, {from: transLanguage, to: 'ko'});
      return res.text;
  }


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
    return (arr[3] + " " + MONTHS[arr[2]] + " " + arr[1] + " " + convertWeekDaysByKorean(arr[0]));
  }
  else {
    return "";
  }
}


request(sourceUrl, function(error, response, html){
  if (!error) {
    var $ = cheerio.load(html, {xmlMode : true});

    $('item').each(function () {
      title.push($(this).children('title').text());
    });


    $('item').each(function () {
      let pubDate = $(this).children('pubDate').text();
      date.push(getDataFormat(pubDate));
    });

    $('item').each(function () {
      description.push($(this).children('ht\\:news_item').children('ht\\:news_item_title').text());
    });

    $('item').each(function () {
      views.push($(this).children('ht\\:approx_traffic').text());
    });


    async function logData(title, date, description, views){
      let tempDate, rank = 1;
      let dateCount = 0;
      for (let i = 0; i < 10; i++) { // 오늘의 content 10위까지 보이게
        if (tempDate != date[i]) {
            if(dateCount<2) dateCount++;
            if(dateCount==2) break;
            tempDate = date[i];
            rank = 1;
            console.log("<br><b>" + "<span style=\"color:red\">" + tempDate + "</span></b><br>");
        }
       if (dateCount == 2) break;
         //검색결과 보여줌
         let transTitle, transDescription;
          try{
              transTitle =  await translateFn(title[i]);
              transDescription = await translateFn(description[i]);
              console.log("<br>" + rank + ". <b> <a href="+
              "https://search.naver.com/search.naver?&where=news&query="+transTitle+"&sm=tab_tmr&frm=mr&nso=so:r,p:all,a:all&sort=0>" +
               transTitle + "</a></b>  조회수 : " + views[i] + "<br>");
              console.log(transDescription +'<br>');

			  console.log("finished Translation <br>");
          } catch(e) {
          }
              rank++;
      }
    }

    logData(title, date, description, views);
  }
});
