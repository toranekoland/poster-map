#!/bin/env bash
set -euo pipefail

# 定数の定義
BASE_DIR=~/poster-map/dev
DATA_DIR=public/data
GCS_URL="https://script.google.com/macros/s/AKfycbyaV4I5c6KdHMSwdBlLD-HbQM5wXPiZVlsUMEOSh__tWhlXoG621NuJrd6HIwjT_Cfn/exec"

# メイン処理
cd "$BASE_DIR"

git pull

# arealist update
curl -sL "$GCS_URL?sheetName=arealist" > "$DATA_DIR/arealist.csv"
python3 bin/arealistcsv2json.py "$DATA_DIR/arealist.csv" "$DATA_DIR/arealist.json"
cp -p "$DATA_DIR/arealist.csv" ./

# areablock update
curl -sL "$GCS_URL?sheetName=areablock" > "$DATA_DIR/areablock.csv"

# posting map block data download
curl -sL "$GCS_URL?sheetName=conquerblock" > "$DATA_DIR/conquerblock.csv"

# posting map data download
curl -sL "$GCS_URL?sheetName=conquerlist" > "$DATA_DIR/conquerlist.csv"

# ポスティングデータをblockごとに分割
python3 bin/conquercsv2json_small.py "$DATA_DIR/conquerlist.csv" "$DATA_DIR/conquerblock.csv" "$DATA_DIR"

# エリアごとに集計
python3 bin/summarize_areatotal.py "$DATA_DIR/conquerareatotal.json"

# 掲示板ピンマップデータをダウンロード
curl -sL "$GCS_URL?sheetName=test" > "$DATA_DIR/all.csv"

# all.json生成&分割
python3 bin/csv2json_small.py "$DATA_DIR/all.csv" "$DATA_DIR/arealist.csv" "$DATA_DIR/areablock.csv" "$DATA_DIR"

# summary.json
python3 summarize_progress.py "$DATA_DIR/summary.json"

# summary_absolute.json
python3 summarize_progress_absolute.py "$DATA_DIR/summary_absolute.json"

# Git 操作
git add -N .

if ! git diff --exit-code --quiet
then
    git add .
    git commit -m "Update"
    git push
    #source .env
    #npx netlify-cli deploy --prod --message "Deploy" --dir=./public --auth $NETLIFY_AUTH_TOKEN
fi
