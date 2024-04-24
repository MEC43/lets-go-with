const userInput = document.querySelector('.searchInput');
const searchBtn = document.querySelector('.searchBtn');
const listCon = document.querySelector('.listCon');
const pgCon = document.querySelector('.pg-con');

// const API_KEY = '17dd184d-7f12-4db5-a707-af167afa2e26';
const API_KEY = 'e4dc51b5-cc55-47bb-bc9b-67a0b296b585';

let numOfRows = 9;
let pageNo = 1;
let totalCount = 0;
let groupSize = 10;
let currentPage = 1;

const moveToPage = (page, input) => {
  pageNo = page;
  currentPage = page;
  if (input == 'undefined') {
    const url = new URL(
      `http://api.kcisa.kr/openapi/API_TOU_050/request?&pageNo=${pageNo}`
    );
    fetchData(url);
  } else {
    const url = new URL(
      `http://api.kcisa.kr/openapi/API_TOU_050/request?&pageNo=${pageNo}&keyword=${input}`
    );
    fetchData(url, input);
  }
};

const moveToPrevGroup = (pageGroup, input) => {
  if (pageGroup > 1) {
    moveToPage((pageGroup - 2) * groupSize + 1, input);
  }
};

const moveToNextGroup = (pageGroup, totalPage, input) => {
  if (pageGroup * groupSize < totalPage) {
    moveToPage(pageGroup * groupSize + 1, input);
  }
};

const pagination = (inputValue) => {
  const totalPage = Math.ceil(totalCount / numOfRows);
  const pageGroup = Math.ceil(pageNo / groupSize);
  const firstPage = (pageGroup - 1) * groupSize + 1;
  const lastPage = Math.min(totalPage, pageGroup * groupSize);

  let paginationHtml = '';
  if (inputValue == 'Error') {
    paginationHtml = `
    <button class="prevGroupBtn" disabled><i class="fa-solid fa-angles-left"></i></button>
    <button class="prevBtn" disabled><i class="fa-solid fa-angle-left"></i></button>
    <button class="on">1</button>
    <button class="nextBtn" disabled><i class="fa-solid fa-angle-right"></i></button>
    <button class="nextGroupBtn" disabled><i class="fa-solid fa-angles-right"></i></button>`;
  } else {
    paginationHtml = `
    <button 
    class="prevGroupBtn" ${pageGroup == 1 ? 'disabled' : ''} 
    onclick="moveToPrevGroup(${pageGroup}, '${inputValue}')">
    <i class="fa-solid fa-angles-left"></i></button>

    <button 
    class="prevBtn" ${currentPage == 1 ? 'disabled' : ''} 
    onclick="moveToPage(${currentPage - 1}, '${inputValue}')">
    <i class="fa-solid fa-angle-left"></i></button>`;

    for (let i = firstPage; i <= lastPage; i++) {
      paginationHtml += `
      <button 
      class="${i == pageNo ? 'on' : ''}" 
      onclick="moveToPage(${i},'${inputValue}')">
      ${i}</button>`;
    }

    paginationHtml += `
    <button 
    class="nextBtn" ${pageGroup * groupSize >= totalPage ? 'disabled' : ''}
    onclick="moveToPage(${currentPage + 1}, '${inputValue}')">
    <i class="fa-solid fa-angle-right"></i></button>
    
    <button 
    class="nextGroupBtn" ${pageGroup * groupSize >= totalPage ? 'disabled' : ''}
    onclick="moveToNextGroup(${pageGroup},${totalPage},'${inputValue}')">
    <i class="fa-solid fa-angles-right"></i></button>`;
  }

  pgCon.innerHTML = paginationHtml;
};

const searchFn = () => {
  pageNo = 1;
  let inputValue = userInput.value;
  const url = new URL(
    `http://api.kcisa.kr/openapi/API_TOU_050/request?keyword=${inputValue}`
  );
  fetchData(url, inputValue);
};

const createHtml = (data) => {
  let placeTitle = data.title;
  let placeAdress = data.address.substring(8);
  let placeTel = data.tel ? data.tel : '';
  let placeInfo = data.description;

  return `
  <li class="list">
    <div class="item-wrap">
        <strong class="title">${placeTitle}</strong>
        <span class="address">${placeAdress}</span>
        <span class="tel">${placeTel}</span></span>
        <span class="desc">${placeInfo}</span>
        <button class="bookmarkBtn"></button>
        <button class="more">지도보기</button>
    </div>
   <div class="mapPg">
        <div class="mapArea">
          <div class="info">
            <strong class="title">${placeTitle}</strong>
            <span class="address">${placeAdress}</span>
            <span class="desc">${placeInfo}</span>
          </div>
          <div class="map"></div>
          <i class="fa-solid fa-xmark closeBtn"></i>
        </div>
    </div>
  </li>   
    `;
};

const renderData = (dataList) => {
  const dataHtml = dataList.map((data) => createHtml(data)).join('');
  listCon.innerHTML = dataHtml;
  userInput.value = '';
};

const errorRender = (err) => {
  const errMsg = `<li class="no-list"> ${err} </li>`;
  listCon.innerHTML = errMsg;
  userInput.value = '';
};

const renderMap = async (dataList) => {
  const mapArea = listCon.querySelectorAll('.map');
  for (let i = 0; i <= numOfRows; i++) {
    if (dataList[i] && dataList[i].coordinates) {
      const coordinates = await dataList[i].coordinates.split(',');
      const latitude = coordinates[0].substring(1);
      const longitude = coordinates[1].substring(2);
      const mapContainer = mapArea[i];
      const placeTitle = dataList[i].title;

      const mapOption = {
        center: new kakao.maps.LatLng(latitude, longitude),
        level: 3,
      };
      let map = new kakao.maps.Map(mapContainer, mapOption);
      let markerPosition = new kakao.maps.LatLng(latitude, longitude);
      let marker = new kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(map);

      let iwContent = `
      <div style="padding:5px;">${placeTitle} <br>
      <a href="https://map.kakao.com/link/map/${placeTitle},${latitude},${longitude}" style="color:blue" target="_blank">큰지도보기</a> 
      <a href="https://map.kakao.com/link/to/${placeTitle},${latitude},${longitude}" style="color:blue" target="_blank">길찾기</a></div>`,
        iwPosition = new kakao.maps.LatLng(latitude, longitude); //인포윈도우 표시 위치입니다

      let infowindow = new kakao.maps.InfoWindow({
        position: iwPosition,
        content: iwContent,
      });

      infowindow.open(map, marker);
    }
  }
};

const fetchData = async (url, inputValue) => {
  try {
    url.searchParams.append('numOfRows', numOfRows);
    url.searchParams.append('pageNo', pageNo);
    url.searchParams.append('serviceKey', API_KEY);

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

      renderData(dataList);
      pagination(inputValue);
      renderMap(dataList);
    } else {
      throw new Error(`"${inputValue}" 에 대한 <br>검색 결과가 없습니다`);
    }
  } catch (error) {
    console.error();
    errorRender(error.message);
    pagination(error.name);
  }
};

const getListData = () => {
  const url = new URL(`http://api.kcisa.kr/openapi/API_TOU_050/request?`);
  fetchData(url);
};

getListData();

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
