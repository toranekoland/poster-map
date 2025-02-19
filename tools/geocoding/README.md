* 住所を元に緯度と経度を取得し、それを指定した列に記入するGoogle Apps Scriptのコードを作成します。このスクリプトは、Google マップのジオコーディング API を使って住所から緯度と経度を取得します。まず、APIキーが必要になるので、Google Cloud Consoleから取得してください。

以下のコードを、Google スプレッドシートのスクリプトエディタに貼り付けて実行してください。

## 手順
* Google スプレッドシートを開きます。
* 上部の「拡張機能」 > 「Apps Script」をクリックします。
* エディタに以下のコードを貼り付けます。
* YOUR_GOOGLE_API_KEY を、取得したGoogle Maps APIのキーに置き換えます。
* 保存して、実行します。

## サンプルコード
```
function geocodeAddresses() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // 住所が記載されている列番号（例えば、A列の場合は1）
  const addressColumn = 1;  // 住所が記入されている列（A列）
  
  // 緯度と経度を記入する列番号（緯度をB列、経度をC列に記入する場合）
  const latitudeColumn = 2;  // 緯度を記入する列（B列）
  const longitudeColumn = 3;  // 経度を記入する列（C列）
  
  // 住所が記入されている最終行を取得
  const lastRow = sheet.getLastRow();
  
  // Google Maps APIキーを設定（自分のAPIキーに変更してください）
  const apiKey = 'YOUR_GOOGLE_API_KEY';
  
  // 住所を基に緯度と経度を取得する関数
  for (let i = 2; i <= lastRow; i++) {  // 1行目がヘッダーの場合、2行目から開始
    const address = sheet.getRange(i, addressColumn).getValue();
    
    if (address) {
      const geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(address) + '&key=' + apiKey;
      
      // APIを呼び出して結果を取得
      const response = UrlFetchApp.fetch(geocodeUrl);
      const json = JSON.parse(response.getContentText());
      
      if (json.status === 'OK') {
        const lat = json.results[0].geometry.location.lat;
        const lng = json.results[0].geometry.location.lng;
        
        // 緯度と経度を指定した列に書き込む
        sheet.getRange(i, latitudeColumn).setValue(lat);
        sheet.getRange(i, longitudeColumn).setValue(lng);
      } else {
        sheet.getRange(i, latitudeColumn).setValue('Geocoding failed');
        sheet.getRange(i, longitudeColumn).setValue('Geocoding failed');
      }
    }
  }
}

```

## このコードのポイント：
* addressColumn に住所が記載されている列を指定します（例：A列は 1）。
* latitudeColumn と longitudeColumn に、それぞれ緯度と経度を記入したい列を指定します（例：B列とC列）。
* YOUR_GOOGLE_API_KEY を自分のAPIキーに置き換えてください。
* 住所が見つからなかった場合は、Geocoding failed と表示されます。
注意点
* Google Maps APIの利用には制限や料金がかかる場合があります。使用する前にGoogle Cloud Consoleで利用制限と料金を確認してください。
* APIキーを環境変数などで管理することをお勧めします。

## 環境変数を使う場合

API キーをプロパティサービスに保存

Google Apps Script のスクリプトエディタで、API キーを PropertiesService に保存します。

スクリプトエディタで、左側の「ファイル」>「プロジェクトのプロパティ」をクリックします。
「プロパティ」タブに移動し、「スクリプトのプロパティ」を選択します。
「新しいプロパティを追加」ボタンをクリックし、キー名を例えば MAPS_API_KEY として、値に取得した Google Maps API のキーを設定します。
コードを修正して環境変数を取得

次に、PropertiesService を使ってスクリプト内から API キーを取得するようにコードを修正します。

```
function geocodeAddresses() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // 住所が記載されている列番号（例えば、A列の場合は1）
  const addressColumn = 1;  // 住所が記入されている列（A列）
  
  // 緯度と経度を記入する列番号（緯度をB列、経度をC列に記入する場合）
  const latitudeColumn = 2;  // 緯度を記入する列（B列）
  const longitudeColumn = 3;  // 経度を記入する列（C列）
  
  // 住所が記入されている最終行を取得
  const lastRow = sheet.getLastRow();
  
  // Google Maps APIキーを環境変数から取得
  const apiKey = PropertiesService.getScriptProperties().getProperty('MAPS_API_KEY');
  
  if (!apiKey) {
    Logger.log('APIキーが設定されていません。');
    return;
  }
  
  // 住所を基に緯度と経度を取得する関数
  for (let i = 2; i <= lastRow; i++) {  // 1行目がヘッダーの場合、2行目から開始
    const address = sheet.getRange(i, addressColumn).getValue();
    
    if (address) {
      const geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(address) + '&key=' + apiKey;
      
      // APIを呼び出して結果を取得
      const response = UrlFetchApp.fetch(geocodeUrl);
      const json = JSON.parse(response.getContentText());
      
      if (json.status === 'OK') {
        const lat = json.results[0].geometry.location.lat;
        const lng = json.results[0].geometry.location.lng;
        
        // 緯度と経度を指定した列に書き込む
        sheet.getRange(i, latitudeColumn).setValue(lat);
        sheet.getRange(i, longitudeColumn).setValue(lng);
      } else {
        sheet.getRange(i, latitudeColumn).setValue('Geocoding failed');
        sheet.getRange(i, longitudeColumn).setValue('Geocoding failed');
      }
    }
  }
}
```
