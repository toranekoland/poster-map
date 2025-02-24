import json
import requests
import sys
import pandas as pd  # pandasのインポート
import time  # timeモジュールのインポート
import logging  # ロギング用モジュールのインポート
import os

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger()

# 基本URL
base_url = "https://uedayou.net/loa/"

# すでに取得したURLを保持して、重複リクエストを防ぐ
visited_urls = set()

# 初期データの列名を設定
columns = ['Full URL', 'Stripped URL', 'Level']

# すでに取得したURLをCSVから読み込む関数
def load_visited_urls(output_path):
    if os.path.exists(output_path):
        df_existing = pd.read_csv(output_path, encoding='utf-8')
        return set(df_existing['Full URL'])
    return set()

# 再帰的にデータを取得する関数
def get_child_data(url, level=0, max_depth=3, output_path=None):  # levelパラメータを追加して再帰階層を追跡
    #logger.info(f"Processing URL: {url}, Level: {level}, Max Depth: {max_depth}")

    if level >= max_depth:
        #logger.info(f"Max depth reached for URL: {url}, Level: {level}")
        return

    #visited_urls.add(url)  # 取得済みURLを記録
    
    target_url = f"{url}.json"
    try:
        response = requests.get(target_url, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed for {url}: {e}")
        return

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
        # 子供のデータを再帰的に取得
        for item in has_part:
            child_url = item["value"]
            if child_url in visited_urls:
                logger.info(f"再帰処理しない {child_url}")
            else:
                logger.info(f"再帰処理 {child_url}")
                get_child_data(child_url, level + 1, max_depth, output_path)  # 再帰的に処理
        stripped_url = url.replace(base_url, "")
        if url in visited_urls:
            # すでにデータに存在する場合はファイルへの書き込みをスキップする
            logger.info(f"Exist File {url}, {stripped_url},{level}")
        else:
            # なければ追記する
            df = pd.DataFrame([[url, stripped_url, level]], columns=columns)
            df.to_csv(output_path, mode='a', header=False, index=False, encoding='utf-8')
            logger.info(f"Write File {url}, {stripped_url},{level}")
    else:
        pass

    # **リクエスト後に1秒待機**（過負荷を避けるため）
    time.sleep(1)  # 1秒待機

def main(target_str, max_depth, output_path):
    visited_urls.update(load_visited_urls(output_path))  # 既存のURLを読み込んでセットに追加
    if not visited_urls:
        df = pd.DataFrame(columns=columns)
        df.to_csv(output_path, mode='w', header=True, index=False, encoding='utf-8')
        logger.info(f"Write File {output_path}")

    # 初期データ取得
    url = f"{base_url}{target_str}"
    target_url = f"{url}.json"
    try:
        response = requests.get(target_url, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed for {url}: {e}")
        sys.exit(1)

    # ステータスコードの確認
    if response.status_code == 200:
        try:
            data = response.json()
        except json.JSONDecodeError:
            sys.exit(1)

        # 'hasPart'に該当する部分を抽出
        has_part = data.get(url, {}).get("http://purl.org/dc/terms/hasPart", [])

        # hasPartが空でない場合はその内容を表示し、再帰的にデータを取得
        if has_part:
            for item in has_part:
                child_url = item["value"]
                get_child_data(child_url, level=1, max_depth=max_depth, output_path=output_path)
            if url in visited_urls:
                # すでにデータに存在する場合はファイルへの書き込みをスキップする
                logger.info(f"Exist File {url}, "",{level}")
            else:
                df = pd.DataFrame([[url, "", 0]], columns=columns)
                df.to_csv(output_path, mode='w', header=True, index=False, encoding='utf-8')
                logger.info(f"Write File {url}, ,0")



        else:
            pass



    else:
        print(f"データの取得に失敗しました。ステータスコード: {response.status_code}")
        print(f"Response Headers: {response.headers}")

    print("CSVファイルにURLを書き込みました。")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python script.py <target_str> <max_depth> <output_path>")
        sys.exit(1)

    target_str = sys.argv[1]
    max_depth = int(sys.argv[2])
    output_path = sys.argv[3]

    main(target_str, max_depth, output_path)

