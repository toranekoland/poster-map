# poster-map用のデータセットテンプレート

## area_blocks.csv(２番目に作る)
データ構造
area_block_id,area_block_name
ブロック名(英数字),ブロック名(漢字)

## arealist.csv(area_block_nameを入れる)
area_id,area_name,area_block
市町村名id,市町村名,ブロック名(漢字)


## arealist.json
make_arealist.pyで変換して作成

## all.csv(ピンデータ)
area,name,lat,long,status,note
市町村名,任意の名称,緯度,経度,ステータス,備考
google spreadsheetに格納するデータ

## all_arealist.py
https://uedayou.net/loa/ から市区町村を再帰的に取得する
使い方
引数に"地名" 階層の深さ 出力ファイル名を指定
python3 all_arealist.py "神奈川県横浜市" 1 output.csv

子データが多い階層で指定すると重くなるので注意
