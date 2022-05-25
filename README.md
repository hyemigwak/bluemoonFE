# Bluemoon FrontEnd


## 프로젝트명 & 소개 

- 프로젝트명 : **BlueMoon**
- 프로젝트 제작기간 : 2022.04.22 (금) ~ 2022.06.02 (목)
- 서비스 소개
    - 음성으로 익명 다이어리를 작성하고, 댓글을 공유할 수 있습니다.
- 주요 기능
    - webRTC, Recording API 를 이용한 음성 녹음 및 재생
    - sockJS / Stomp 를 활용한 실시간 채팅, 알림
- 개발 언어 : JavaScript
- 개발 라이브러리 : React.js
- 형상 관리 : git
- 협업 툴 : Notion, Slack, Pigma



## Front-End 팀원 소개

- 팀원 : 곽혜미, 이춘
- 담당영역
    - 곽혜미: webRTC, Recording API, diary 관련 페이지, Intro, 메인, 로그인
    - 이춘: webSocket(실시간 채팅, 실시간 알람), API 및 뷰(닉네임 설정, 마이페이지, 채팅리스트, 이벤트페이지),




## 프론트엔드 핵심 기술(+version) 및 선정 이유

- **webRTC**
    - 별 다른 소프트웨어 설치 없이 서비스 메인 기능인 실시간 음성 녹음 스트림을 제공받을 수 있고, javscript api로 제공되어 러닝커브가 낮았음
    - mediaRecorder api에서 제공하는 녹음, 재생, 정지 등의 기본 기능이 서비스 메인 기능을 커버하기에 충분했음
    
- **sockjs-client (1.6.0) / stompjs (2.3.3)**
    - WebSocket을 지원하지 않는 브라우저까지 지원함
    - 사용법은 WebSocket과 유사
        
        webSocketFactory와 유사한 SockJS object 생성 → 연결 시 connect → subscribe, send 등 메소드 사용 → 연결 종료 시 disconnect
        
    
- **react-query (3.38.0)**
    - mutation을 사용해 diary 작성, 댓글 등 CUD 작업에 대한 get 요청을 자동으로 fetching 하여 리덕스 및 state 사용을 줄이고 서버의 최신화 된 데이터를 보여주어 사용자 경험을 높일 수 있음
    - loading, error 값들을 제공해주어 상태 파악이 용이하며, enabled, cache time 등의 옵션 설정으로 원하는 조건에 맞게 서버 데이터 컨트롤 할 수 있음

- **redux-toolkit (1.8.1)**
    - redux의 보일러 플레이트 작성을 간소화(action creator 생략)
    - thunk, immer 기능이 내장되어 있어, 별도 설치하지 않아도 비동기 처리와 불변성 관리를 할 수 있었음

- **react-responsive (9.0.0-beta.8)**
    - media-query로 반응형 웹을 구현하기 위해 사용
    - 유저의 뷰 포트에 따라 모바일/PC 웹 뷰 보여줌


## 트러블 슈팅

### 댓글별 음성 녹음 파일 관리

- 현상 & 원인: 각 댓글의 음성 녹음 play 버튼을 누를때, audio 객체를 생성하니, 동일한 파일의 음성파일 객체가 계속 생겨나는 현상
- 해결: 댓글마다 <audio>객체를 두고 src에 서버에서 내려온 voiceUrl을 주어 play 버튼을 누르면 audio element를 useRef로 가져와 재생시킴

    
### refreshToken 비동기 문제

- 현상 & 원인: 리프레시 토큰으로 새 액세스 토큰을 받아오는 동안 다른 요청들이 동시에 토큰 재발급을 요청해서 토큰이 여러게 발급되고, 유효하지 않은 토큰이 생김
- 해결: axios의 interceptor에서 리프레시 토큰을 요청하는 동안(bool으로 구분) 들어오는 요청을 서버에 보내지 않고 배열에 모으고, 토큰 발급이 끝나 header에 accessToken을 다시 세팅하면, 그 때 이전에 모아놨던 요청들을 유효한 토큰과 함께 서버에 보내는 것으로 처리

