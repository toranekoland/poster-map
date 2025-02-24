#!/bin/env bash
set -euo pipefail

# 神奈川県の地名リストを出力（負荷が高いので、一回だけね）

#python3 all_arealist.py "神奈川県" 1 kanagawa.csv
#python3 all_arealist.py "神奈川県横浜市" 1 kanagawa-yokohama.csv
#python3 all_arealist.py "神奈川県川崎市" 1 kanagawa-kawasaki.csv
#python3 all_arealist.py "神奈川県相模原市" 1 kanagawa-sagamihara.csv

# csvを加工してarealist.csvを作るのです
# area_id,area_name,area_block area_blockは任意にグルーピングしてください

python3 all_arealist.py "神奈川県川崎市多摩区" 3 "kanagawa/tama.csv"
python3 all_arealist.py "神奈川県川崎市宮前区" 3 "kanagawa/miyamae.csv"
python3 all_arealist.py "神奈川県川崎市幸区" 3 "kanagawa/saiwai.csv"
python3 all_arealist.py "神奈川県川崎市中原区" 3 "kanagawa/nakahara.csv"

#失敗してやり直す分
#python3 all_arealist.py "神奈川県鎌倉市" 3 "kanagawa/kamakura.csv"
#python3 all_arealist.py "神奈川県横浜市戸塚区" 3 "kanagawa/totsuka.csv"
#python3 all_arealist.py "神奈川県川崎市川崎区" 3 "kanagawa/kawasaki.csv"

#成功した分
#python3 all_arealist.py "神奈川県川崎市高津区" 3 "kanagawa/takatsu.csv"
#python3 all_arealist.py "神奈川県横浜市都筑区" 3 "kanagawa/tsuzuki.csv"
