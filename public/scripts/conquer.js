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

function setPolygonPopup(polygon, conquer) {
  const popupContent = `
    <b>${conquer['subarea_name']}</b><br>
    トータル: ${conquer['total_posting']}枚<br>
    group1: ${conquer['group1']}枚 備考:${conquer['group1_note']}<br>
    group2: ${conquer['group2']}枚 備考:${conquer['group2_note']}<br>
    group3: ${conquer['group3']}枚 備考:${conquer['group3_note']}<br>
    group4: ${conquer['group4']}枚 備考:${conquer['group4_note']}<br>
    group5: ${conquer['group5']}枚 備考:${conquer['group5_note']}<br>
  `;
  polygon.bindPopup(popupContent);
}

function setMarkerWithTooltip(lat, lng, areaName, areaKey, areaId, totalPosting) {
  const marker = L.marker([lat, lng]).addTo(map);

  const tooltipContent = `
  <div style="text-align: center;">
    <strong>${areaName}</strong><br>
    <span style="font-size: 12px; color: gray;"> ${totalPosting} 枚</span>
  </div>
`;

  marker.bindTooltip(tooltipContent, {
    permanent: true,
    direction: 'bottom',
    offset: [-15, 40],
    className: "custom-tooltip"
  }).openTooltip();

  marker.on('click', function () {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('area_key', areaKey);
    currentUrl.searchParams.set('area_id', areaId);
    currentUrl.searchParams.set('lat', lat);
    currentUrl.searchParams.set('lng', lng);
    window.location.href = currentUrl.toString();
  });
}


function fetchGeoJsonAndSetView(pref, zoomLevel) {
  const geoPrefUrl = `https://uedayou.net/loa/${pref}.geojson`;
  
  return fetch(geoPrefUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch geojson for ${pref}`);
      }
      return response.json();
    })
    .then((data) => {
      const polygon = L.geoJSON(data);
      const centroid = polygon.getBounds().getCenter();
      map.setView([centroid.lat, centroid.lng], 11);
    })
    .catch((error) => {
      console.error('Error fetching geojson:', error);
    });
}

function getGroupGeoJsonStyle(value, group) {
  // groupがgroup1の場合、赤く塗る
  if (group === 'group1') {
    return {
      color: 'red',  // 赤色に設定
      fillColor: 'red', // 赤色で塗りつぶし
      fillOpacity: 0.7,
      weight: 2,
    };
  }
  
  // それ以外の処理
  return {
    color: 'black',
    fillColor: getProgressColor(value),  // 残りは進捗色に従う
    fillOpacity: 0.7,
    weight: 2,
  };
}


function fetchAndProcessGeoJson(dataSet, isDetailView) {
  for (let [key, data] of Object.entries(dataSet)) {
    const areaName = isDetailView ? data['subarea_name'] : data['area_name'];
    const areaKey = isDetailView ? null : data['area_key']; // 詳細ビューでは areaKey は不要
    const areaId = isDetailView ? null : data['area_id']; // 詳細ビューでは areaId は不要
    const totalValue = isDetailView ? data['total_posting'] : conquerareatotal[data['area_id']];
    
    const geoJsonUrl = `https://uedayou.net/loa/${pref}${areaName}.geojson`;
    console.log(key)
    console.log(data)

    fetch(geoJsonUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch geojson for ${areaName}`);
        }
        return response.json();
      })
      .then((geoData) => {
        let group = '';
        if (data['group1'] !== null) {group = 'group1';}
        const polygon = L.geoJSON(geoData, { style: getGroupGeoJsonStyle(totalValue, group) });
        //const polygon = L.geoJSON(geoData, { style: getGeoJsonStyle(totalValue) });

        if (isDetailView) {
          setPolygonPopup(polygon, data);
        } else {
          const centroid = polygon.getBounds().getCenter();
          setMarkerWithTooltip(centroid.lat, centroid.lng, areaName, areaKey, areaId, totalValue);
        }
        //polygon.addTo(map);
        if (group === 'group1') {
          polygon.addTo(overlays['group1']);
        } else {
          polygon.addTo(map);
        }       
      })
      .catch((error) => {
        console.error('Error fetching geojson:', error);
      });
  }
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

var map = L.map("map", { preferCanvas: true, zoomControl: false }).setView([35.669400214188606, 139.48343915372877], 11);

const baseLayers = {
  'OpenStreetMap': osm,
  'Google Map': googleMap,
  '国土地理院地図': japanBaseMap,
};

const overlays = {
  'group1':  L.layerGroup(),
  'group2':  L.layerGroup(),
  'group3':  L.layerGroup(),
  'group4':  L.layerGroup(),
  'group5':  L.layerGroup(),
  'Total':  L.layerGroup(),
};

japanBaseMap.addTo(map);
map.addLayer(overlays['Total']);
const layerControl = L.control.layers(baseLayers, overlays, { position: "topleft" }).addTo(map);

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

  let areaTotalValue;
  if (area_key === null) {
    // area_keyが定義されていない場合、全体マップ
    fetchGeoJsonAndSetView(pref, 11); // 都道府県の中心地を取得して移動
    areaTotalValue = conquerareatotal['total']; // 全体データ
    fetchAndProcessGeoJson(conquerblock, false);
  } else {
    // area_keyが定義されている場合、詳細マップ(ポスター枚数による塗分け)を表示する
    map.setView([lat, lng], 14);
    areaTotalValue = conquerareatotal[area_id]; // 特定エリアのデータ
    fetchAndProcessGeoJson(conquerdata, true);
  }
  overlays['group1'].addTo(map);

  //マップ合計と凡例を表示
  areatotalBox(areaTotalValue, 'topright').addTo(map)
  legend().addTo(map);

}).catch((error) => {
  console.error('Error in fetching data:', error);
});
