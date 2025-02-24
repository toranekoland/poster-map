import os
import pandas as pd
import sys

def merge_csv(input_path, list_file, output_file, pref_name):
    # list.csv を読み込む
    list_df = pd.read_csv(list_file)
    
    # 'area_name' 列を辞書形式に変換 (area_name => area_id, area_block)
    list_dict = dict(zip(list_df['area_name'], list_df[['area_id', 'area_block']].values))
    
    # 入力パス内の全てのCSVファイルを取得
    all_files = [f for f in os.listdir(input_path) if f.endswith('.csv')]
    
    # CSVファイルを読み込んでデータフレームに追加
    combined_df = pd.DataFrame()
    output_rows = []  # 最終的に保存するためのリスト
    
    for file in all_files:
        file_path = os.path.join(input_path, file)
        df = pd.read_csv(file_path)
        
        # 'Stripped URL' カラムだけを抽出し、カラム名を 'subarea_name' に変更
        df = df[['Stripped URL']]
        df.columns = ['subarea_name']  # カラム名を変更
        
        # 前後の空白を削除し、空文字列の場合はスキップ
        df = df[df['subarea_name'].str.strip() != '']
        
        # subarea_name の各値に対して area_name と前方一致するものを検索
        for subarea_name in df['subarea_name']:
            # subarea_name が文字列かどうかを確認
            if isinstance(subarea_name, str):
                
                # Stripped URL と pref_name が前方一致するか確認
                if subarea_name.startswith(pref_name):
                    # pref_name の部分を取り除いて subarea_name として設定
                    subarea_name = subarea_name[len(pref_name):].strip()
                
                # 前方一致する area_name をリストで取得
                matched_area_names = [area_name for area_name in list_dict.keys() if subarea_name.startswith(area_name)]
                
                # 前方一致した場合、area_name と subarea_name を保存
                for matched_area_name in matched_area_names:
                    output_rows.append([list_dict[matched_area_name][0], matched_area_name, subarea_name])
            else:
                # subarea_name が文字列でない場合、その行をスキップ
                continue
        
        # 結果を結合
        combined_df = pd.concat([combined_df, df], ignore_index=True)
    
    # 結果をリストからDataFrameに変換し、出力ファイルに保存
    output_df = pd.DataFrame(output_rows, columns=['area_id', 'area_name', 'subarea_name'])
    output_df.to_csv(output_file, index=False)
    
    print(f'CSVファイルが{output_file}として保存されました。')

if __name__ == "__main__":
    # コマンドライン引数から入力パス、listファイルと出力ファイル名を取得
    if len(sys.argv) != 5:
        print("使用方法: python3 program.py <CSVファイルのディレクトリ> <list.csvのパス> <pref_name> <出力ファイル名>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    list_file = sys.argv[2]
    pref_name = sys.argv[3]
    output_file = sys.argv[4]
    
    merge_csv(input_path, list_file, output_file, pref_name)
