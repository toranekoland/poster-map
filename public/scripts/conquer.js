const map = L.map("map").setView([35.669400214188606, 139.48343915372877], 11);

// 背景地図はOpenStreetMap
const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Linked Open Addresses Japan',
}).addTo(map);

function legend() {
  var control = L.control({ position: 'topright' });
  control.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend')
    grades = milestones.slice().reverse();

    div.innerHTML += '<p>凡例</p>';

    var legendInnerContainerDiv = L.DomUtil.create('div', 'legend-inner-container', div);
    legendInnerContainerDiv.innerHTML += '<div class="legend-gradient"></div>';

    var labelsDiv = L.DomUtil.create('div', 'legend-labels', legendInnerContainerDiv);
    for (var i = 0; i < grades.length; i++) {
      labelsDiv.innerHTML += '<span>' + grades[i] + '枚</span>';
    }
    return div;
  };

  return control
}

function getProgressColor(value) {

  let lower = milestones[0];
  let upper = milestones[milestones.length - 1];

  // valueが上限を超える場合、upperを最大のmilestoneに設定
  if (value >= upper) {
    upper = milestones[milestones.length - 1];
    lower = milestones[milestones.length - 2];
  } else {
    for (let i = 1; i < milestones.length; i++) {
      if (value <= milestones[i]) {
        upper = milestones[i];
        lower = milestones[i - 1];
        break;
      }
    }
  }

  // 進捗を0から1に変換する
  const rangePct = (value - lower) / (upper - lower);
  // 進捗が範囲外に出ないように制限
  const clampedRangePct = Math.min(Math.max(rangePct, 0), 1);

  // 青系のグラデーションの色設定
  // 0は薄い青、10000は濃い青
  const blueStart = { r: 128, g: 224, b: 255 }; // 明るい青 (薄い青)
  const blueEnd = { r: 0, g: 0, b: 255 }; // 濃い青 (濃い青)

  const r = Math.round(blueStart.r + clampedRangePct * (blueEnd.r - blueStart.r));
  const g = Math.round(blueStart.g + clampedRangePct * (blueEnd.g - blueStart.g));
  const b = Math.round(blueStart.b + clampedRangePct * (blueEnd.b - blueStart.b));

  return `rgb(${r}, ${g}, ${b})`;
}

function getGeoJsonStyle(value) {
  return {
    color: 'black',
    fillColor: getProgressColor(value),
    fillOpacity: 0.7,
    weight: 2,
  }
}

function getParamFromUrl(paramName) {
  const params = new URL(document.location.href).searchParams;
  return params.get(paramName);
}

let areaList;
let progress;
const area_key = getParamFromUrl("area_key");
const area_id = getParamFromUrl("area_id");
const pref = getParamFromUrl("pref");
const lat = getParamFromUrl("lat");
const lng = getParamFromUrl("lng");

Promise.all([getConquerblock(), getConquerdata(area_key), getConquerareatotal()]).then(function (res) {
  conquerblock = res[0];
  conquerdata = res[1];
  conquerareatotal = res[2];

  if (area_key === null) {
    // area_keyが定義されていない場合、全体マップ（ポリゴンによる描写とクリックしてリンク先に飛ぶ）を表示する
    // 都道府県の中心地を取得して移動
    const geoPrefUrl = `https://uedayou.net/loa/${pref}.geojson`;
    fetch(geoPrefUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch geojson for ${blockdata['area_name']}`);
        }
        return response.json();
      })
      .then((data) => {
        const polygon = L.geoJSON(data);
        const centroid = polygon.getBounds().getCenter();  // ポリゴンの境界ボックスの中心を取得
        map.setView([centroid.lat, centroid.lng], 11);
      })
      .catch((error) => {
        console.error('Error fetching geojson:', error);
      });
    for (let [key, blockdata] of Object.entries(conquerblock)) {
      const geoJsonUrl = `https://uedayou.net/loa/${pref}${blockdata['area_name']}.geojson`;
      fetch(geoJsonUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch geojson for ${blockdata['area_name']}`);
          }
          return response.json();
        })
        .then((data) => {
          const polygon = L.geoJSON(data, {
            style: getGeoJsonStyle(conquerareatotal[blockdata['area_id']]),
          });
          const centroid = polygon.getBounds().getCenter();  // ポリゴンの境界ボックスの中心を取得
          const marker = L.marker([centroid.lat, centroid.lng]).addTo(map);
          marker.bindTooltip(blockdata['area_name'], { permanent: true, direction: 'bottom', offset: [-15, 40] }).openTooltip();

          // マーカーをクリックして詳細マップへ
          marker.on('click', function () {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('area_key', blockdata['area_key']);
            currentUrl.searchParams.set('area_id', blockdata['area_id']);
            currentUrl.searchParams.set('lat', centroid.lat);
            currentUrl.searchParams.set('lng', centroid.lng);
            window.location.href = currentUrl.toString();
          })
          polygon.addTo(map);
        })
        .catch((error) => {
          console.error('Error fetching geojson:', error);
        });
    }
    areatotalBox((conquerareatotal['total'] ), 'topright').addTo(map)
    legend().addTo(map);
  } else {
    // area_keyが定義されている場合、詳細マップ(ポスター枚数による塗分け)を表示する
    map.setView([lat, lng], 14);
    for (let [key, conquer] of Object.entries(conquerdata)) {
      const geoJsonUrl = `https://uedayou.net/loa/${pref}${conquer['subarea_name']}.geojson`;
      fetch(geoJsonUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch geojson for ${conquer['subarea_name']}`);
          }
          return response.json();
        })
        .then((data) => {
          const polygon = L.geoJSON(data, {
            style: getGeoJsonStyle(conquer['total_posting']),
          });
          polygon.bindPopup(`<b>${conquer['subarea_name']}</b><br>トータル: ${conquer['total_posting']}枚<br>最近: ${conquer['recently_posting']}枚`);
          polygon.addTo(map);
        })
        .catch((error) => {
          console.error('Error fetching geojson:', error);
        });
    }
    areatotalBox((conquerareatotal[area_id]), 'topright').addTo(map)
    legend().addTo(map);
  }

}).catch((error) => {
  console.error('Error in fetching data:', error);
});
