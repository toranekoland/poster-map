import json
import requests
import sys
import pandas as pd
import time
import logging
import os  # ファイルの存在チェック用

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger()

base_url = "https://uedayou.net/loa/"

visited_urls = set()  # すでに取得したURLを保持するセット
columns = ['Full URL', 'Stripped URL', 'Level']

# すでに取得したURLをCSVから読み込む関数
def load_visited_urls(output_path):
    if os.path.exists(output_path):
        df_existing = pd.read_csv(output_path, encoding='utf-8')
        return set(df_existing['Full URL'])
    return set()

# 再帰的にデータを取得する関数
def get_child_data(url, level=0, max_depth=3, output_path=None):
    if level >= max_depth:
        return

    if url in visited_urls:
        return
    
    visited_urls.add(url)  # 取得済みURLを記録
    
    target_url = f"{url}.json"
    try:
        response = requests.get(target_url, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed for {url}: {e}")
        return

    if response.status_code == 200:
        try:
            data = response.json()  # JSONデータの取得
        except json.JSONDecodeError:
            return
    else:
        return

    has_part = data.get(url, {}).get("http://purl.org/dc/terms/hasPart", [])
    
    if has_part:
        stripped_url = url.replace(base_url, "")
        df = pd.DataFrame([[url, stripped_url, level]], columns=columns)
        df.to_csv(output_path, mode='a', header=False, index=False, encoding='utf-8')
        logger.info(f"Write File {url}, {stripped_url}, {level}")

        for item in has_part:
            child_url = item["value"]
            get_child_data(child_url, level + 1, max_depth, output_path)  # 再帰的に処理
    else:
        pass

    time.sleep(1)

def main(target_str, max_depth, output_path):
    visited_urls.update(load_visited_urls(output_path))  # 既存のURLを読み込んでセットに追加

    url = f"{base_url}{target_str}"
    target_url = f"{url}.json"
    try:
        response = requests.get(target_url, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed for {url}: {e}")
        sys.exit(1)

    if response.status_code == 200:
        try:
            data = response.json()
        except json.JSONDecodeError:
            sys.exit(1)

        df = pd.DataFrame([[target_url, "", 0]], columns=columns)
        df.to_csv(output_path, mode='w', header=True, index=False, encoding='utf-8')
        logger.info(f"Write File {url}, ,0")

        has_part = data.get(url, {}).get("http://purl.org/dc/terms/hasPart", [])
        
        if has_part:
            for item in has_part:
                child_url = item["value"]
                get_child_data(child_url, level=1, max_depth=max_depth, output_path=output_path)
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
