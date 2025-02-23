import json
import requests
import sys
import pandas as pd  # pandasのインポート
import time  # timeモジュールのインポート
import logging  # ロギング用モジュールのインポート

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger()

# 基本URL
base_url = "https://uedayou.net/loa/神奈川県鎌倉市寺分"

# すでに取得したURLを保持して、重複リクエストを防ぐ
visited_urls = set()

# 初期データの列名を設定
columns = ['Full URL', 'Stripped URL', 'Level']

# 取得したURLを保持するリストを作成（pandasのDataFrame用）
#all_urls = []

# 再帰的にデータを取得する関数
def get_child_data(url, level=0):  # levelパラメータを追加して再帰階層を追跡
    # すでにこのURLを取得している場合はスキップ
    if url in visited_urls:
        return
    
    visited_urls.add(url)  # 取得済みURLを記録
    
    target_url = f"{url}.json"
    response = requests.get(target_url)

    # ステータスコードの確認
    if response.status_code == 200:
        try:
            data = response.json()  # JSONデータの取得
        except json.JSONDecodeError:
            return
    else:
        return
    
    # "hasPart"があれば、その部分のデータを取得
    has_part = data.get(url, {}).get("http://purl.org/dc/terms/hasPart", [])
    
    if has_part:
        # **has_partが存在した場合のみURLをall_urlsに追加**
        stripped_url = url.replace(base_url, "")
        #all_urls.append([url, stripped_url, level])

        df = pd.DataFrame([[url, stripped_url, level]], columns=columns)
        df.to_csv('urls_output.csv', mode='a', header=False, index=False, encoding='utf-8')
        logger.info(f"Appended URL: {url}, stripped_url: {stripped_url},Level: {level}")
        with open('urls_output.csv', mode='a', encoding='utf-8') as file:
            file.flush()  # ファイルにデータを即座に書き込む

        # 子供のデータを再帰的に取得
        for item in has_part:
            child_url = item["value"] + ".json"
            get_child_data(child_url)  # 再帰的に処理
    else:
        pass

    # **リクエスト後に1秒待機**（過負荷を避けるため）
    time.sleep(1)  # 1秒待機

# 初期データ取得
target_url = f"{base_url}.json"
response = requests.get(target_url)

# ステータスコードの確認
if response.status_code == 200:
    try:
        data = response.json()
    except json.JSONDecodeError:
        exit(1)

    # **初期データ部分もall_urlsに追加**（階層0として追加）
    df = pd.DataFrame([[target_url, "", 0]], columns=columns)
    df.to_csv('urls_output.csv', mode='a', header=False, index=False, encoding='utf-8')
    logger.info(f"Appended Initial URL: {target_url}, Level: 0")
    with open('urls_output.csv', mode='a', encoding='utf-8') as file:
        file.flush()  # ファイルにデータを即座に書き込む

    # 'hasPart'に該当する部分を抽出
    has_part = data.get(base_url, {}).get("http://purl.org/dc/terms/hasPart", [])

    # hasPartが空でない場合はその内容を表示し、再帰的にデータを取得
    if has_part:
        for item in has_part:
            child_url = item["value"]
            get_child_data(child_url, level=1)
    else:
        pass
else:
    print(f"データの取得に失敗しました。ステータスコード: {response.status_code}")
    print(f"Response Headers: {response.headers}")

# pandasでCSVに出力する部分
# pandasのDataFrameにURLリストを渡してCSV出力
#df = pd.DataFrame(all_urls, columns=['Full URL', 'Stripped URL', 'Level'])  # 'Full URL', 'Stripped URL', 'Level'の3列
#df.to_csv('urls_output.csv', index=False, encoding='utf-8')  # CSVファイルに保存
print("CSVファイルにURLを書き込みました。")