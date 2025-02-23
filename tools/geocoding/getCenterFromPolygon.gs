function doGet() {
  Logger.log('doGet')
  return HtmlService.createHtmlOutputFromFile('index');  // クライアントサイドのHTMLを表示
}

function getGeoJsonDataFromSheet() {
  Logger.log('getGeoJsonDataFromSheet')
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('中心地算出ツール');  // シート名を指定
  var data = sheet.getDataRange().getValues();  // スプレッドシートの全データを取得

  Logger.log('データ: ' + JSON.stringify(data));  // デバッグログ
  var geoJsonData = {};

  // 最初の行（ヘッダー）をスキップして、データを処理
  for (var i = 1; i < data.length; i++) {
    var placeName = data[i][0];  // 地名
    var geoJsonUrl = data[i][1]; // GeoJSON URL
    geoJsonData[placeName] = geoJsonUrl;  // geoJsonData に地名と URL を対応させる
  }
  Logger.log('GeoJSONデータ: ' + JSON.stringify(geoJsonData));  // デバッグログ
  return geoJsonData;  // geoJsonData オブジェクトを返す
}

function saveToSheet(results) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('中心地算出ツール');  // シート名を指定
  var range = sheet.getRange(2, 3, results.length, 2);  // 結果を書き込む範囲
  var values = results.map(function(result) {
    var parts = result.split(',');  // カンマで分割して緯度と経度を取得
    var lat = parts[1].trim();  // 緯度
    var lng = parts[2].trim();  // 経度
    return [lat, lng];  // 緯度、経度を別々の列に挿入
  });
  range.setValues(values);
}
