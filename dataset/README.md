# poster-map用のデータセットテンプレート

## config.json(一番最初に作る)
データ構造
prefecture,都道府県名 // 神奈川県 など
setmap,緯度経度 // サマリー地図の中心となる緯度経度

## area_blocks.csv(２番目に作る)
データ構造
area_block_id,area_block_name
ブロック名(英数字),ブロック名(漢字)

## arealist.csv(area_block_nameを入れる)
area_id,area_name,area_block
市町村名id,市町村名,ブロック名(漢字)

https://uedayou.net/loa/ から市区町村を取ると確実にマッピングされるよ

## arealist.json
make_arealist.pyで変換して作成

## all.csv(ピンデータ)
area,name,lat,long,status,note
市町村名,任意の名称,緯度,経度,ステータス,備考
google spreadsheetに格納するデータ