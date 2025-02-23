# https://uedayou.net/loa/神奈川県　からjsonを取ってきて再帰的に全エリアのリストを取る
#
#

import json
import requests

# https://uedayou.net/loa/神奈川県
base_url = "https://uedayou.net/loa/神奈川県"

# データ取得
target_url = f"{base_url}.json"
response = requests.get(target_url)

if response.status_code == 200:
    data = response.json()
    # 'hasPart'に該当する部分を抽出
    has_part = data.get('http://purl.org/dc/terms/hasPart', [])
    print(has_part)
    
    # 'hasPart'の内容を一覧表示
    for index, part in enumerate(has_part, start=1):
        print(f"{index}. {part}")
else:
    print(f"データの取得に失敗しました。ステータスコード: {response.status_code}")

# 提供されたJSONデータ（response）の一部
data = {
    "https://uedayou.net/loa/神奈川県": {
        "http://purl.org/dc/terms/hasPart": [
            {
                "type": "uri",
                "value": "https://uedayou.net/loa/神奈川県愛甲郡愛川町"
            },
            {
                "type": "uri",
                "value": "https://uedayou.net/loa/神奈川県愛甲郡清川村"
            },
            {
                "type": "uri",
                "value": "https://uedayou.net/loa/神奈川県綾瀬市"
            },
            {
                "type": "uri",
                "value": "https://uedayou.net/loa/神奈川県伊勢原市"
            },
            {
                "type": "uri",
                "value": "https://uedayou.net/loa/神奈川県横須賀市"
            },
            {
                "type": "uri",
                "value": "https://uedayou.net/loa/神奈川県横浜市"
            },
            {
                "type": "uri",
                "value": "https://uedayou.net/loa/神奈川県海老名市"
            },
            {
                "type": "uri",
                "value": "https://uedayou.net/loa/神奈川県鎌倉市"
            },
            {
                "type": "uri",
                "value": "https://uedayou.net/loa/神奈川県茅ケ崎市"
            },
            {
                "type": "uri",
                "value": "https://uedayou.net/loa/神奈川県厚木市"
            },
            # 他のURLもここに追加
        ]
    }
}

# 'hasPart'の内容を抽出して一覧表示
#has_part = data["https://uedayou.net/loa/神奈川県"].get('http://purl.org/dc/terms/hasPart', [])

# 'hasPart'の内容を一覧表示
#for index, part in enumerate(has_part, start=1):
#    print(f"{index}. {part['value']}")
