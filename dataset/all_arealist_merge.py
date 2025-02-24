import os
import pandas as pd
import sys

def merge_csv(input_path, output_file):
    # 入力パス内の全てのCSVファイルを取得
    all_files = [f for f in os.listdir(input_path) if f.endswith('.csv')]
    
    # CSVファイルを読み込んでデータフレームに追加
    combined_df = pd.DataFrame()
    for file in all_files:
        file_path = os.path.join(input_path, file)
        df = pd.read_csv(file_path)
        df = df[['Stripped URL']]
        df = df[df['Stripped URL'] != '']
        df.columns = ['area_name']
        combined_df = pd.concat([combined_df, df], ignore_index=True)
    
    # 結果を指定された出力ファイル名で保存
    combined_df.to_csv(output_file, index=False)
    print(f'CSVファイルが{output_file}として保存されました。')

if __name__ == "__main__":
    # コマンドライン引数から入力パスと出力ファイル名を取得
    if len(sys.argv) != 3:
        print("使用方法: python3 program.py <CSVファイルのディレクトリ> <出力ファイル名>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_file = sys.argv[2]
    
    merge_csv(input_path, output_file)
