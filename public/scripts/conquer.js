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
    grades = [1, 0.75, 0.5, 0.25, 0]

    div.innerHTML += '<p>凡例</p>';

    var legendInnerContainerDiv = L.DomUtil.create('div', 'legend-inner-container', div);
    legendInnerContainerDiv.innerHTML += '<div class="legend-gradient"></div>';

    var labelsDiv = L.DomUtil.create('div', 'legend-labels', legendInnerContainerDiv);
    for (var i = 0; i < grades.length; i++) {
      labelsDiv.innerHTML += '<span>' + grades[i] * 100 + '%</span>';
    }
    return div;
  };

  return control
}

function getProgressColor(percentage) {

  // Define the color stops
  const colorStops = [
    { pct: 0.0, color: { r: 254, g: 237, b: 222 } }, // #feedde
    { pct: 0.25, color: { r: 253, g: 190, b: 133 } }, // #fdbe85
    { pct: 0.5, color: { r: 253, g: 141, b: 60 } }, // #fd8d3c
    { pct: 0.75, color: { r: 230, g: 85, b: 13 } }, // #e6550d
    { pct: 0.999, color: { r: 166, g: 54, b: 3 } }, // #a63603
    { pct: 1.0, color: { r: 150, g: 0, b: 73 } } // #a63603
  ];

  // Ensure percentage is within bounds
  percentage = Math.max(0, Math.min(1, percentage));

  // Find the two closest color stops
  let lower = colorStops[0];
  let upper = colorStops[colorStops.length - 1];

  for (let i = 1; i < colorStops.length; i++) {
    if (percentage <= colorStops[i].pct) {
      upper = colorStops[i];
      lower = colorStops[i - 1];
      break;
    }
  }

  // Calculate the interpolated color
  const rangePct = (percentage - lower.pct) / (upper.pct - lower.pct);
  const r = Math.round(lower.color.r + rangePct * (upper.color.r - lower.color.r));
  const g = Math.round(lower.color.g + rangePct * (upper.color.g - lower.color.g));
  const b = Math.round(lower.color.b + rangePct * (upper.color.b - lower.color.b));

  // Return the color as a string
  return `rgb(${r}, ${g}, ${b})`;
}

function getGeoJsonStyle(progress) {
  return {
    color: 'black',
    fillColor: getProgressColor(progress),
    fillOpacity: 0.7,
    weight: 2,
  }
}

function getAreakeyFromUrlParam() {
  const params = new URL(document.location.href).searchParams
  const area_key = params.get("area_key")
  console.log(area_key)
  return area_key
}

function getPrefFromUrlParam() {
  const params = new URL(document.location.href).searchParams
  const pref = params.get("pref")
  return pref
}

let areaList;
let progress;
const area_key = getAreakeyFromUrlParam()
const pref = getPrefFromUrlParam()

Promise.all([getAreaList(), getProgress(), getProgressCountdown(),getConquerblock(),getConquerdata(area_key)]).then(function (res) {
  areaList = res[0];
  progress = res[1];
  progressCountdown = res[2];
  conquerblock = res[3];
  conquerdata = res[4];

  if (area_key === null) {
    // area_keyが定義されていない場合、全体マップ（ポリゴンによる描写とクリックしてリンク先に飛ぶ）を表示する
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
            style: getGeoJsonStyle(progress[key]),
          });
          // クリックして詳細マップへ
          polygon.on('click', function () {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('area_key', blockdata['area_key']);
            window.location.href = currentUrl.toString();
          })
          polygon.bindPopup(`<b>${blockdata['area_name']}</b><br>`);
          polygon.on('mouseover',function(e){this.openPopup();});
          polygon.on('mouseout',function(e){this.closePopup();});
          polygon.addTo(map);
        })
        .catch((error) => {
          console.error('Error fetching geojson:', error);
        });
    }
    progressBox((progress['total'] * 100).toFixed(2), 'topright').addTo(map)
    progressBoxCountdown((parseInt(progressCountdown['total'])), 'topright').addTo(map)
    legend().addTo(map);
  } else {
    // area_keyが定義されている場合、詳細マップ(ポスター枚数による塗分け)を表示する
    console.log('area_key is defined:', area_key);
    for (let [key, conquer] of Object.entries(conquerdata)) {
      console.log(key)
      console.log(conquer)
      const geoJsonUrl = `https://uedayou.net/loa/${pref}${conquer['subarea_name']}.geojson`;
      console.log(geoJsonUrl)
      fetch(geoJsonUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch geojson for ${conquer['subarea_name']}`);
        }
        return response.json();
      })
      .then((data) => {
        const polygon = L.geoJSON(data, {
          style: getGeoJsonStyle(progress[key]),
        });
        polygon.bindPopup(`<b>${conquer['subarea_name']}</b><br>トータル: ${conquer['total_posting']}枚<br>最近: ${conquer['recently_posting']}枚`);
        polygon.addTo(map);
      })
      .catch((error) => {
        console.error('Error fetching geojson:', error);
      });

    }
  }

}).catch((error) => {
  console.error('Error in fetching data:', error);
});
