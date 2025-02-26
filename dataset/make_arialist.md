## 市町村データを作る
## マッピングデータの元になるものだが、取得するのに再帰処理を延々と行うので
## 何度も実行しないこと
## (1行ずつ実施すること)
## 県名から指定すること

## 深さ1で実行→2で実行　足りなければ3を追加
python3 all_arealist.py "神奈川県" 2 kanagawa/kanagawa-pref.csv
python3 all_arealist.py "神奈川県横浜市" 2 kanagawa/kanagawa-pref.csv
python3 all_arealist.py "神奈川県川崎市" 2 kanagawa/kanagawa-pref.csv
python3 all_arealist.py "神奈川県相模原市" 2 kanagawa/kanagawa-pref.csv

python3 all_arealist.py "神奈川県横浜市鶴見区" 1 "kanagawa/tsurumi.csv"
python3 all_arealist.py "神奈川県横浜市神奈川区" 1 "kanagawa/kanagawa.csv"
python3 all_arealist.py "神奈川県横浜市西区" 1 "kanagawa/nishi.csv"
python3 all_arealist.py "神奈川県横浜市中区" 1 "kanagawa/naka.csv"
python3 all_arealist.py "神奈川県横浜市南区" 1 "kanagawa/yokohamaminami.csv"
python3 all_arealist.py "神奈川県横浜市保土ケ谷区" 1 "kanagawa/hodogaya.csv"
python3 all_arealist.py "神奈川県横浜市磯子区" 1 "kanagawa/isogo.csv"
python3 all_arealist.py "神奈川県横浜市金沢区" 1 "kanagawa/kanazawa.csv"
python3 all_arealist.py "神奈川県横浜市港北区" 1 "kanagawa/kouhoku.csv"
python3 all_arealist.py "神奈川県横浜市戸塚区" 1 "kanagawa/totsuka.csv"
python3 all_arealist.py "神奈川県横浜市港南区" 1 "kanagawa/kounan.csv"
python3 all_arealist.py "神奈川県横浜市旭区" 1 "kanagawa/asahi.csv"
python3 all_arealist.py "神奈川県横浜市緑区" 1 "kanagawa/yokohamamidori.csv"
python3 all_arealist.py "神奈川県横浜市瀬谷区" 1 "kanagawa/seya.csv"
python3 all_arealist.py "神奈川県横浜市栄区" 1 "kanagawa/sakae.csv"
python3 all_arealist.py "神奈川県横浜市泉区" 1 "kanagawa/izumi.csv"
python3 all_arealist.py "神奈川県横浜市青葉区" 1 "kanagawa/aoba.csv"
python3 all_arealist.py "神奈川県横浜市都筑区" 1 "kanagawa/tsuzuki.csv"
python3 all_arealist.py "神奈川県川崎市川崎区" 1 "kanagawa/kawasaki.csv"
python3 all_arealist.py "神奈川県川崎市幸区" 1 "kanagawa/saiwai.csv"
python3 all_arealist.py "神奈川県川崎市中原区" 1 "kanagawa/nakahara.csv"
python3 all_arealist.py "神奈川県川崎市高津区" 1 "kanagawa/takatsu.csv"
python3 all_arealist.py "神奈川県川崎市多摩区" 1 "kanagawa/tama.csv"
python3 all_arealist.py "神奈川県川崎市宮前区" 1 "kanagawa/miyamae.csv"
python3 all_arealist.py "神奈川県川崎市麻生区" 1 "kanagawa/asao.csv"
python3 all_arealist.py "神奈川県相模原市緑区" 1 "kanagawa/sagamiharamidori.csv"
python3 all_arealist.py "神奈川県相模原市中央区" 1 "kanagawa/tyuou.csv"
python3 all_arealist.py "神奈川県相模原市南区" 1 "kanagawa/sagamiharaminami.csv"
python3 all_arealist.py "神奈川県横須賀市" 1 "kanagawa/yokosuka.csv"
python3 all_arealist.py "神奈川県平塚市" 1 "kanagawa/hiratsuka.csv"
python3 all_arealist.py "神奈川県鎌倉市" 1 "kanagawa/kamakura.csv"
python3 all_arealist.py "神奈川県藤沢市" 1 "kanagawa/fujisawa.csv"
python3 all_arealist.py "神奈川県小田原市" 1 "kanagawa/odawara.csv"
python3 all_arealist.py "神奈川県茅ヶ崎市" 1 "kanagawa/chigasaki.csv"
python3 all_arealist.py "神奈川県逗子市" 1 "kanagawa/zushi.csv"
python3 all_arealist.py "神奈川県三浦市" 1 "kanagawa/miura.csv"
python3 all_arealist.py "神奈川県秦野市" 1 "kanagawa/hadano.csv"
python3 all_arealist.py "神奈川県厚木市" 1 "kanagawa/atsugi.csv"
python3 all_arealist.py "神奈川県大和市" 1 "kanagawa/yamato.csv"
python3 all_arealist.py "神奈川県伊勢原市" 1 "kanagawa/isehara.csv"
python3 all_arealist.py "神奈川県海老名市" 1 "kanagawa/ebiha.csv"
python3 all_arealist.py "神奈川県座間市" 1 "kanagawa/zama.csv"
python3 all_arealist.py "神奈川県南足柄市" 1 "kanagawa/minamiashigara.csv"
python3 all_arealist.py "神奈川県綾瀬市" 1 "kanagawa/ayase.csv"
python3 all_arealist.py "神奈川県三浦郡葉山町" 1 "kanagawa/hayama.csv"
python3 all_arealist.py "神奈川県高座郡寒川町" 1 "kanagawa/samukawa.csv"
python3 all_arealist.py "神奈川県中郡大磯町" 1 "kanagawa/ooisho.csv"
python3 all_arealist.py "神奈川県中郡二宮町" 1 "kanagawa/ninomiya.csv"
python3 all_arealist.py "神奈川県足柄上郡中井町" 1 "kanagawa/nakai.csv"
python3 all_arealist.py "神奈川県足柄上郡大井町" 1 "kanagawa/ohi.csv"
python3 all_arealist.py "神奈川県足柄上郡松田町" 1 "kanagawa/matsuda.csv"
python3 all_arealist.py "神奈川県足柄上郡開成町" 1 "kanagawa/kaisei.csv"
python3 all_arealist.py "神奈川県足柄下郡箱根町" 1 "kanagawa/hakone.csv"
python3 all_arealist.py "神奈川県足柄下郡真鶴町" 1 "kanagawa/manazuru.csv"
python3 all_arealist.py "神奈川県足柄下郡湯河原町" 1 "kanagawa/yugawara.csv"
python3 all_arealist.py "神奈川県愛甲郡愛川町" 1 "kanagawa/aikawa.csv"
python3 all_arealist.py "神奈川県愛甲郡清川村" 1 "kanagawa/kiyokawa.csv"



## 動かない
python3 all_arealist.py "神奈川県愛甲郡清川村" 3 "kanagawa/kiyokawa.csv"


## 手作業で実施
##完了 python3 all_arealist.py "神奈川県横浜市都筑区" 3 "kanagawa/tsuzuki.csv"
##完了 python3 all_arealist.py "神奈川県川崎市宮前区" 3 "kanagawa/miyamae.csv"
##完了 python3 all_arealist.py "神奈川県藤沢市" 3 "kanagawa/fujisawa.csv"
##完了 python3 all_arealist.py "神奈川県横浜市戸塚区" 3 "kanagawa/totsuka.csv"
##完了 python3 all_arealist.py "神奈川県鎌倉市" 3 "kanagawa/kamakura.csv"
##完了 python3 all_arealist.py "神奈川県足柄上郡山北町" 3 "kanagawa/yamakita.csv"
##完了 python3 all_arealist.py "神奈川県足柄上郡中井町" 3 "kanagawa/nakai.csv"
##完了 python3 all_arealist.py "神奈川県足柄上郡大井町" 3 "kanagawa/ohi.csv"
##完了 python3 all_arealist.py "神奈川県足柄上郡松田町" 3 "kanagawa/matsuda.csv"
##完了 python3 all_arealist.py "神奈川県足柄上郡開成町" 3 "kanagawa/kaisei.csv"
##完了 python3 all_arealist.py "神奈川県足柄下郡箱根町" 3 "kanagawa/hakone.csv"
##完了 python3 all_arealist.py "神奈川県愛甲郡愛川町" 3 "kanagawa/aikawa.csv"

##完了 python3 all_arealist.py "神奈川県足柄下郡真鶴町" 3 "kanagawa/manazuru.csv"
##完了 python3 all_arealist.py "神奈川県三浦郡葉山町" 3 "kanagawa/hayama.csv"
##完了 python3 all_arealist.py "神奈川県足柄下郡湯河原町" 3 "kanagawa/yugawara.csv"
##完了 python3 all_arealist.py "神奈川県高座郡寒川町" 3 "kanagawa/samukawa.csv"
##完了 python3 all_arealist.py "神奈川県中郡大磯町" 3 "kanagawa/ooisho.csv"
##完了 python3 all_arealist.py "神奈川県中郡二宮町" 3 "kanagawa/ninomiya.csv"
##完了 python3 all_arealist.py "神奈川県綾瀬市" 3 "kanagawa/ayase.csv"
##完了 python3 all_arealist.py "神奈川県座間市" 3 "kanagawa/zama.csv"
##完了 python3 all_arealist.py "神奈川県海老名市" 3 "kanagawa/ebiha.csv"

##完了python3 all_arealist.py "神奈川県南足柄市" 3 "kanagawa/minamiashigara.csv"
##完了python3 all_arealist.py "神奈川県厚木市" 3 "kanagawa/atsugi.csv"
##完了python3 all_arealist.py "神奈川県大和市" 3 "kanagawa/yamato.csv"
##完了python3 all_arealist.py "神奈川県伊勢原市" 3 "kanagawa/isehara.csv"
##完了python3 all_arealist.py "神奈川県秦野市" 3 "kanagawa/hadano.csv"
##完了python3 all_arealist.py "神奈川県逗子市" 3 "kanagawa/zushi.csv"
##完了python3 all_arealist.py "神奈川県小田原市" 3 "kanagawa/odawara.csv"

##完了python3 all_arealist.py "神奈川県平塚市" 3 "kanagawa/hiratsuka.csv"
##完了python3 all_arealist.py "神奈川県横須賀市" 3 "kanagawa/yokosuka.csv"
#python3 all_arealist.py "神奈川県横浜市西区" 3 "kanagawa/nishi.csv"
#python3 all_arealist.py "神奈川県三浦市" 3 "kanagawa/miura.csv"
#python3 all_arealist.py "神奈川県横浜市南区" 3 "kanagawa/yokohamaminami.csv"
#python3 all_arealist.py "神奈川県横浜市泉区" 3 "kanagawa/izumi.csv"
#python3 all_arealist.py "神奈川県横浜市栄区" 3 "kanagawa/sakae.csv"
#python3 all_arealist.py "神奈川県相模原市南区" 3 "kanagawa/sagamiharaminami.csv"
#python3 all_arealist.py "神奈川県相模原市中央区" 3 "kanagawa/tyuou.csv"


#python3 all_arealist.py "神奈川県茅ケ崎市" 3 "kanagawa/chigasaki.csv"
#python3 all_arealist.py "神奈川県川崎市幸区" 3 "kanagawa/saiwai.csv"
#python3 all_arealist.py "神奈川県川崎市中原区" 3 "kanagawa/nakahara.csv"
#python3 all_arealist.py "神奈川県川崎市川崎区" 3 "kanagawa/kawasaki.csv"
#python3 all_arealist.py "神奈川県相模原市緑区" 3 "kanagawa/sagamiharamidori.csv"
#python3 all_arealist.py "神奈川県川崎市高津区" 3 "kanagawa/takatsu.csv"
#python3 all_arealist.py "神奈川県川崎市多摩区" 3 "kanagawa/tama.csv"
#python3 all_arealist.py "神奈川県川崎市麻生区" 3 "kanagawa/asao.csv"
#python3 all_arealist.py "神奈川県横浜市青葉区" 3 "kanagawa/aoba.csv"
#python3 all_arealist.py "神奈川県横浜市瀬谷区" 3 "kanagawa/seya.csv"

##完了###########

#python3 all_arealist.py "神奈川県横浜市港南区" 3 "kanagawa/kounan.csv"
#python3 all_arealist.py "神奈川県横浜市旭区" 3 "kanagawa/asahi.csv"
#python3 all_arealist.py "神奈川県横浜市緑区" 3 "kanagawa/yokohamamidori.csv"
#python3 all_arealist.py "神奈川県横浜市磯子区" 3 "kanagawa/isogo.csv"
#python3 all_arealist.py "神奈川県横浜市金沢区" 3 "kanagawa/kanazawa.csv"
#python3 all_arealist.py "神奈川県横浜市港北区" 3 "kanagawa/kouhoku.csv"

python3 all_arealist.py "神奈川県横浜市鶴見区" 3 "kanagawa/tsurumi.csv"
python3 all_arealist.py "神奈川県横浜市神奈川区" 3 "kanagawa/kanagawa.csv"
python3 all_arealist.py "神奈川県横浜市中区" 3 "kanagawa/naka.csv"
python3 all_arealist.py "神奈川県横浜市保土ケ谷区" 3 "kanagawa/hodogaya.csv"


## 出来上がった分をtestに移してマージ
python3 all_arealist_merge.py test/ arealist.csv "神奈川県" kanagawa-all8.csv

## Googleスプレッドシートにコピー

## すべて出来上がったらマージ
python3 all_arealist_merge.py kanagawa/ arealist.csv "神奈川県" kanagawa-all.csv

## 地図を見て欠けていたらデータが足りないので追加

