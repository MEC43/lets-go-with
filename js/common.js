const API_KEY = 'e4dc51b5-cc55-47bb-bc9b-67a0b296b585';
const BASE_URL = 'http://api.kcisa.kr/openapi/API_TOU_050/request';

const placeListCon = document.querySelector('.listCon');
const prevBtn = document.querySelector('.pg-con>.prevBtn');
const nextBtn = document.querySelector('.pg-con>.nextBtn');
const searchBtn = document.querySelector('.searchBtn');
const userInput = document.querySelector('.searchInput');

let numOfRows = 9; //세션당 요청레코드수
let pageNo = 1; //페이지수
let keyword = ''; //검색어

const searchFn = () => {
  pageNo = 1;
  const searchValue = userInput.value;
  keyword = searchValue;
  getData(keyword);
  userInput.value = '';
};

const favOn = (bookMarkBtn) => {
  bookMarkBtn.classList.toggle('fav');
};
const closeMap = (mapPgEl) => {
  mapPgEl.classList.remove('active');
  mapPgEl.innerHTML = '';
};
const activeMap = (mapPgEl) => {
  mapPgEl.classList.add('active');
};
const renderMap = (placeData, mapPgEl, placeTitle) => {
  let [latitude, longitude] = placeData.coordinates.split(',');
  let lati = Number(latitude.replace(/[^\d.-]/g, ''));
  let longi = Number(longitude.replace(/[^\d.-]/g, ''));

  const mapContainer = mapPgEl.querySelector('.map');
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
const createMapArea = (placeData, mapPgEl) => {
  const placeTitle = placeData.title;
  const placeAdress = placeData.address.substring(8);
  const placeInfo = placeData.description
    ? placeData.description
    : '세부정보가 없습니다';

  mapPgEl.innerHTML = `
  <div class="mapArea">
    <div class="info">
        <strong class="title">${placeTitle}</strong>
        <span class="address">${placeAdress}</span>
        <span class="desc">${placeInfo}</span>
    </div>
    <div class="map"></div>
    <i class="fa-solid fa-xmark closeBtn" 
    onclick='closeMap(this.parentElement.parentElement)'></i>
  </div>
  `;

  renderMap(placeData, mapPgEl, placeTitle);
};

const createHtml = (place) => {
  const placeTitle = place.title;
  const placeAdress = place.address.substring(8);
  const placeTel = place.tel ? place.tel : '';
  const placeInfo = place.description
    ? place.description
    : '세부정보가 없습니다';
  const placeData = JSON.stringify(place);

  return `
    <li class="list">
        <div class="item-wrap">
            <strong class="title">${placeTitle}</strong>
            <span class="address">${placeAdress}</span>
            <span class="tel">${placeTel}</span></span>
            <span class="desc">${placeInfo}</span>
            <button class="bookmarkBtn" onclick='favOn(this)'></button>
            <button class="more" 
            onclick='createMapArea(${placeData}, this.parentElement.nextElementSibling); 
            activeMap(this.parentElement.nextElementSibling)'>지도보기</button>
        </div>
        <div class="mapPg">
        </div>
    </li>
    `;
};

const renderData = (dataList) => {
  const placeListHtml = dataList.map((place) => createHtml(place)).join('');
  placeListCon.innerHTML = placeListHtml;
};

const renderError = (err) => {
  placeListCon.innerHTML = `
  <div class="no-list">
  <i class="fa-solid fa-dog"></i> ${err} <i class="fa-solid fa-cat"></i>
  </div>`;
};

const fetchData = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'accept: application/json',
      },
    });
    const data = await response.json();

    if (data.response.body.items) {
      const dataList = data.response.body.items.item;

      if (pageNo === 1) {
        prevBtn.disabled = true;
      } else {
        prevBtn.disabled = false;
      }
      if (dataList.length < numOfRows) {
        nextBtn.disabled = true;
      } else {
        nextBtn.disabled = false;
      }

      renderData(dataList);
    } else {
      nextBtn.disabled = true;
      throw new Error(`"${keyword}" 에 대한 <br>검색 결과가 없습니다.`);
    }
  } catch (error) {
    renderError(error.message);
  }
};

const getData = () => {
  const url = new URL(`${BASE_URL}?serviceKey=${API_KEY}`);
  url.searchParams.append('numOfRows', numOfRows);
  url.searchParams.append('pageNo', pageNo);
  if (keyword) {
    url.searchParams.append('keyword', keyword);
  }

  fetchData(url);
};

getData();

userInput.addEventListener('keypress', (e) => {
  if (e.key != 'Enter') return;
  searchFn();
});
searchBtn.addEventListener('click', searchFn);

prevBtn.addEventListener('click', () => {
  pageNo--;
  getData(pageNo);
});
nextBtn.addEventListener('click', () => {
  pageNo++;
  getData(pageNo);
});
