#!/bin/env bash
set -euo pipefail

# 神奈川県の地名リストを出力（負荷が高いので、一回だけね）

python3 all_arealist.py "神奈川県" 1 kanagawa.csv
python3 all_arealist.py "神奈川県横浜市" 1 kanagawa-yokohama.csv
python3 all_arealist.py "神奈川県川崎市" 1 kanagawa-kawasaki.csv
python3 all_arealist.py "神奈川県相模原市" 1 kanagawa-sagamihara.csv

# csvを加工してarealist.csvを作るのです
# area_id,area_name,area_block area_blockは任意にグルーピングしてください
