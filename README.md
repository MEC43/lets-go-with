# 반려동물 동반 가능 시설

### ![logo](https://github.com/MEC43/lets-go-with/assets/162939173/5af27658-4b2f-4229-83fc-60919082cada)

#### 🎆 [Deploy 링크](https://mec43.github.io/lets-go-with/)

### 💬 개요

- open API 활용
- HTML, CSS , JavaScript 작성
- 반응형 1200px, 600px 기준

### 🧿 기획 목적

- 전국의 반려인들에게 반려동물과 함께 갈 수 있는 장소에 대한 정보를 제공하기 위함

### 👩‍🏫 주요 기능

- 전국 반려동물 동반가능 시설 위치 및 정보 제공
- 시설 위치 지도 제공
- 시설 이름 기준 키워드 검색
- 페이징 (prev버튼, next버튼) 기능

### 🎇활용 API

- 🔗[한국문화정보원\_전국 반려동물 동반가능 문화시설 위치](https://www.culture.go.kr/data/openapi/openapiView.do?id=585&category=D&gubun=A)
- 🔗[KAKAO 지도 Web API](https://apis.map.kakao.com/web/)

### 😱 진행시 만난 문제들

<details>
    <summary>KAKAO 맵 API 사용</summary>
    <div markdown="1">
    <ol>
        <li>
        카카오 맵 API는 반드시 도메인을 등록해야 화면에 지도가 표시됨
        </li>
        <li>
        첫번째 li에만 지도가 표시됨<br>
        → li 의 ‘지도보기’ 버튼을 눌렀을 때 구조를 생성하고 지도를 표시하도록 지도를 표시하는 renderMap 함수의 실행 위치 변경
        </li>
    </ol>
    </div>
</details>

<details>
    <summary>페이지네이션</summary>
    <div markdown="1">
    <ol>
        <li>
        API가 제공하는 totalCount가 전체 데이터로 고정되어 있음. 
            <ul>
                <li>
                검색이 적용된 데이터의 수를 알 수가 없어서 페이징 적용이 어려움. 
                </li>
                <li>
                검색 결과에서 마지막 페이지를 넘겨버리면 검색 결과가 없음으로 표시됨.
                </li>
            </ul> 
        → 숫자로 된 페이지네이션보다는 이전버튼, 다음버튼만 표시되도록 UI 조정
        </li>
        <li>
        prev버튼, next버튼 누르면 페이지 이동
            <ul>
                <li>
                prevBtn과 nextBtn 에 click 이벤트 설정 
                </li>
                <li>
                fetchData함수가 실행될 때 버튼의 비활성화에 대해
                </li>
            </ul>   
        </li>
        <li>
        검색 → 페이지 이동 → 다시 검색 시 페이지 1로 초기화
            <ul>
                <li>
                searchFn함수가 작동하면 가장 먼저 표시할 페이지를 1로 초기화 시킴 
                </li>
            </ul>   
        </li>
    </ol>
    </div>
</details>

<details>
    <summary>검색 기능</summary>
    <div markdown="1">
    <ol>
        <li>
        검색 하고 나면 검색창 비우기 
            <ul>
                <li>
                searchFn이 실행될 때마다 input의 value의 값을 ''이 되도록 설정
                </li>
            </ul>
        </li>
        <li>
        검색어에 해당하는 검색 결과가 없으면 errorRender함수 실행
            <ul>
                <li>
                fetchData함수 내부에서 if문으로 data.response.body.items가 null이 아닌 경우는 실행시키고, null(items가 없으면)이면 오류를 만들어서 에러 메시지로 검색 결과가 없음을 화면에 출력
                </li>
            </ul>
        </li>
    </ol>
    </div>
</details>

#### [이슈 정리 노션🔗](https://spectrum-sneeze-fb5.notion.site/Let-s-go-with-034584eedbbd4b1ba36b1de97ab459ed?pvs=4)

#### ✍️ Skills

![HTML5](https://img.shields.io/badge/html5-E34F26.svg?&style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-1572B6.svg?&style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-F7DF1E.svg?&style=for-the-badge&logo=javascript&logoColor=white)

#### ⚒️ Infra and Tools

![VScode](https://img.shields.io/badge/VSCode-007ACC.svg?&style=for-the-badge&logo=visualstudiocode&logoColor=white) ![Git](https://img.shields.io/badge/git-F05032.svg?&style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/github-181717.svg?&style=for-the-badge&logo=github&logoColor=white)

![image](https://github.com/MEC43/lets-go-with/assets/162939173/c4896418-8d6f-4ae4-a4fb-765219b87ce4)
