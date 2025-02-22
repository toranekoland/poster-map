import pandas as pd
import sys
import os

def main(input_path, block_path, output_path):

    inputdata = pd.read_csv(input_path)
    inputdata.rename(columns={'area': 'area_name'}, inplace=True) # inputdataのareaをarea_nameに変更
    print(inputdata)

    blocklist = pd.read_csv(block_path)
    blocklist = blocklist[['area_id', 'area_key', 'area_name']] # blocklistをarea_id, area_key, area_nameだけにする
    conquer_blocks = dict(zip(blocklist['area_key'], blocklist['area_name'])) # key valueの形のJSONにする
    print(blocklist)
    print(conquer_blocks)

    # left_joinでマージ
    merged_data = pd.merge(inputdata, blocklist, on='area_name', how='left', suffixes=('', ''))
    print(merged_data)

    final_data = merged_data.copy()[['id', 'area_id', 'area_key', 'subarea_name', 'total_posting', 'recently_posting', 'note']]
    return
   
    for block_key, block_name in conquer_blocks.items():
        block_areas = arealist[arealist['area_block'] == block_name]['area_id']
        filtered_data = final_data[final_data['area_id'].isin(block_areas)]
        
#        filtered_output_path = os.path.join(output_path, 'block', f'{block_key}.json')
#        filtered_data.to_json(filtered_output_path, orient='records', force_ascii=False)
        print(f"Filtered file saved to {filtered_output_path}")

#    json_output_path = os.path.join(output_path, 'all.json')
#    final_data.to_json(json_output_path, orient='records', force_ascii=False)
    print(f"File saved to {json_output_path}")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python script.py <input_path> <block_path> <output_path>")
        sys.exit(1)

    input_path = sys.argv[1]  # public/data/conquerlist.csv
    block_path = sys.argv[2]  # public/data/conquerblock.csv
    output_path = sys.argv[3] # public/data/

    main(input_path, block_path, output_path)
