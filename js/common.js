const userInput = document.querySelector('.searchInput');
const searchBtn = document.querySelector('.searchBtn');
const listCon = document.querySelector('.listCon');
const pgCon = document.querySelector('.pg-con');

const prevBtn = document.querySelector('.prevBtn');
const nextBtn = document.querySelector('.nextBtn');

const API_KEY = 'e4dc51b5-cc55-47bb-bc9b-67a0b296b585';

let numOfRows = 9;
let pageNo = 1;
let totalCount = 0;
let groupSize = 10;
let keyword = '';

const searchFn = () => {
  pageNo = 1;
  keyword = userInput.value;
  fetchData(keyword, pageNo);
  userInput.value = '';
};

const renderMap = (
  latitude,
  longitude,
  placeTitle,
  placeAdress,
  placeInfo,
  mapPgEl
) => {
  lati = parseFloat(latitude.toString().replace(/[^\d.-]/g, ''));
  longi = parseFloat(longitude.toString().replace(/[^\d.-]/g, ''));

  mapPgEl.innerHTML = `
  <div class="mapArea">
  <div class="info">
    <strong class="title">${placeTitle}</strong>
    <span class="address">${placeAdress}</span>
    <span class="desc">${placeInfo}</span>
  </div>
  <div class="map"></div>
  <i class="fa-solid fa-xmark closeBtn"></i>
  </div>
  `;

  const mapContainer = mapPgEl.querySelector('.map');
  console.log(mapContainer);

  const mapOption = {
    center: new kakao.maps.LatLng(lati, longi),
    level: 3,
  };
  let map = new kakao.maps.Map(mapContainer, mapOption);
  let markerPosition = new kakao.maps.LatLng(lati, longi);
  let marker = new kakao.maps.Marker({
    position: markerPosition,
  });
  marker.setMap(map);

  let iwContent = `
      <div style="padding:5px;">${placeTitle} <br>
      <a href="https://map.kakao.com/link/map/${placeTitle},${lati},${longi}" style="color:blue" target="_blank">큰지도보기</a> 
      <a href="https://map.kakao.com/link/to/${placeTitle},${lati},${longi}" style="color:blue" target="_blank">길찾기</a></div>`,
    iwPosition = new kakao.maps.LatLng(lati, longi);

  let infowindow = new kakao.maps.InfoWindow({
    position: iwPosition,
    content: iwContent,
  });

  infowindow.open(map, marker);
};

const createHtml = (data) => {
  let placeTitle = data.title;
  let placeAdress = data.address.substring(8);
  let placeTel = data.tel ? data.tel : '';
  let placeInfo = data.description;

  let coordinates = data.coordinates;
  let [latitude, longitude] = coordinates.split(',');

  return `
    <li class="list">
      <div class="item-wrap">
          <strong class="title">${placeTitle}</strong>
          <span class="address">${placeAdress}</span>
          <span class="tel">${placeTel}</span></span>
          <span class="desc">${placeInfo}</span>
          <button class="bookmarkBtn"></button>
          <button class="more"
          onclick="renderMap('${latitude}','${longitude}', '${placeTitle}', '${placeAdress}','${placeInfo}', this.parentElement.nextElementSibling)">
          지도보기</button>
      </div>
      <div class="mapPg">
      </div>
    </li>   
    `;
};

const renderData = (dataList) => {
  const dataHtml = dataList.map((data) => createHtml(data)).join('');
  listCon.innerHTML = dataHtml;
};

const errorRender = (err) => {
  const errMsg = `<li class="no-list"> ${err} </li>`;
  listCon.innerHTML = errMsg;
  userInput.value = '';
};

const fetchData = async (keyword, pageNo) => {
  const url = new URL(`http://api.kcisa.kr/openapi/API_TOU_050/request?`);
  try {
    url.searchParams.append('numOfRows', numOfRows);
    url.searchParams.append('pageNo', pageNo);
    url.searchParams.append('serviceKey', API_KEY);
    if (keyword) {
      url.searchParams.append('keyword', keyword);
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'accept: application/json',
      },
    });
    const data = await response.json();

    if (data.response.body.items) {
      const dataList = data.response.body.items.item;
      totalCount = data.response.body.totalCount;

      if (dataList.length < numOfRows) {
        nextBtn.disabled = true;
      } else {
        nextBtn.disabled = false;
      }
      if (pageNo === 1) {
        prevBtn.disabled = true;
      } else {
        prevBtn.disabled = false;
      }

      renderData(dataList);
    } else {
      throw new Error(`"${inputValue}" 에 대한 <br>검색 결과가 없습니다`);
    }
  } catch (error) {
    console.error();
    errorRender(error.message);
  }
};

fetchData(keyword, pageNo);

listCon.addEventListener('click', (e) => {
  const parentDiv = e.target.closest('div');
  if (e.target.tagName == 'BUTTON' && e.target.classList.contains('more')) {
    parentDiv.nextSibling.nextSibling.classList.add('active');
  }
  if (e.target.tagName == 'I' && e.target.classList.contains('closeBtn')) {
    parentDiv.parentElement.classList.remove('active');
  }
  if (
    e.target.tagName == 'BUTTON' &&
    e.target.classList.contains('bookmarkBtn')
  ) {
    e.target.classList.toggle('fav');
  }
});
userInput.addEventListener('keypress', (e) => {
  if (e.key != 'Enter') return;
  searchFn();
});
searchBtn.addEventListener('click', searchFn);
prevBtn.addEventListener('click', () => {
  if (pageNo === 1) return;
  pageNo--;
  fetchData(keyword, pageNo);
});
nextBtn.addEventListener('click', () => {
  if (pageNo === Math.ceil(totalCount / numOfRows)) return;
  pageNo++;
  fetchData(keyword, pageNo);
});
