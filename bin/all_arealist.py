import json
import requests

# 基本URL
base_url = "https://uedayou.net/loa/神奈川県横浜市"

# すでに取得したURLを保持して、重複リクエストを防ぐ
visited_urls = set()

# 再帰的にデータを取得する関数
def get_child_data(url):
    # すでにこのURLを取得している場合はスキップ
    if url in visited_urls:
        return
    
    visited_urls.add(url)  # 取得済みURLを記録
    
    print(f"Requesting data from: {url}")
    response = requests.get(url)
    
    # ステータスコードの確認
    if response.status_code == 200:
        try:
            data = response.json()  # JSONデータの取得
        except json.JSONDecodeError:
            print(f"Failed to decode JSON from {url}. Response: {response.text[:200]}")  # JSONでないレスポンス
            return
    else:
        return
        
    # "hasPart"があれば、その部分のデータを取得
    has_part = data.get("http://purl.org/dc/terms/hasPart", [])
    
    if has_part:
        # 子供のデータを再帰的に取得
        for item in has_part:
            child_url = item["value"] + ".json"
            print(f"Found child part: {child_url}")
            get_child_data(child_url)  # 再帰的に処理
    else:
        print(f"No 'hasPart' found in: {url}")

# 初期データ取得
target_url = f"{base_url}.json"
response = requests.get(target_url)

# ステータスコードの確認
if response.status_code == 200:
    try:
        data = response.json()
    except json.JSONDecodeError:
        print(f"Failed to decode JSON from {target_url}. Response: {response.text[:200]}")  # JSONでないレスポンス
        exit(1)

    # 'hasPart'に該当する部分を抽出
    has_part = data.get(base_url, {}).get("http://purl.org/dc/terms/hasPart", [])

    # hasPartが空でない場合はその内容を表示し、再帰的にデータを取得
    if has_part:
        for item in has_part:
            child_url = item["value"] + ".json"
            print(f"Starting recursive fetching from: {child_url}")
            get_child_data(child_url)
    else:
        print("No 'hasPart' found in the initial data.")
else:
    print(f"データの取得に失敗しました。ステータスコード: {response.status_code}")
    print(f"Response Headers: {response.headers}")
