#!/bin/env bash
set -euo pipefail

cd ~/poster-map/dev/ #Path to the folder

git pull

# arealist update
curl -sL "https://script.google.com/macros/s/AKfycbyaV4I5c6KdHMSwdBlLD-HbQM5wXPiZVlsUMEOSh__tWhlXoG621NuJrd6HIwjT_Cfn/exec?sheetName=arealist" > public/data/arealist.csv
python3 bin/arealistcsv2json.py public/data/arealist.csv public/data/arealist.json

# posting map block data download
curl -sL "https://script.google.com/macros/s/AKfycbyaV4I5c6KdHMSwdBlLD-HbQM5wXPiZVlsUMEOSh__tWhlXoG621NuJrd6HIwjT_Cfn/exec?sheetName=conquerblock" > public/data/conquerblock.csv

# posting map data download
curl -sL "https://script.google.com/macros/s/AKfycbyaV4I5c6KdHMSwdBlLD-HbQM5wXPiZVlsUMEOSh__tWhlXoG621NuJrd6HIwjT_Cfn/exec?sheetName=conquerlist" > public/data/conquerlist.csv

# blockごとに分割
python3 bin/conquercsv2json_small.py public/data/conquerlist.csv public/data/conquerblock.csv public/data/

# 掲示板ピンマップデータをダウンロード
curl -sL "https://script.google.com/macros/s/AKfycbyaV4I5c6KdHMSwdBlLD-HbQM5wXPiZVlsUMEOSh__tWhlXoG621NuJrd6HIwjT_Cfn/exec?sheetName=test" > public/data/all.csv

# all.json生成&分割
python3 csv2json_small.py public/data/all.csv public/data/

# summary.json
python3 summarize_progress.py ./public/data/summary.json

# summary_absolute.json
python3 summarize_progress_absolute.py ./public/data/summary_absolute.json



git add -N .

if ! git diff --exit-code --quiet
then
    git add .
    git commit -m "Update"
    git push
    #source .env
    #npx netlify-cli deploy --prod --message "Deploy" --dir=./public --auth $NETLIFY_AUTH_TOKEN
fi
