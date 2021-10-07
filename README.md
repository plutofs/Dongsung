# dongsung-admin

## 실행법
1.	node js 설치
https://nodejs.org/ko/
2.	package.json 수정
3.	터미널 연후, node js경로로 진입, npm install 실행
4.	루트경로로 진입, backup폴더 생성 후 storage폴더 붙여넣기(동성-머신에 압축파일 있음 )
        (d:\workspace\ds_node기준, d:\backup\storage가필요)  
5. backup폴더 안에 upload 폴더 추가, 안에 guest폴더 추가
6.	전부 완료된 경우, 터미널에 node app.js 입력으로 실행

##실행과정 -> roomEdit기준
  - roomEdit.ejs(views)로 이동
  - 이후 wizard에 값 전달
  - 데이터 있는지 없는지 검증하여 insert/updateGuest 실행
  - 라우터(routes/room.js)로 이동, fileUpload실행
  - 컨트롤러로 이동 (이때, 값은 req.body에 있음. 디버깅시 주의)
  - 해당 컨트롤러의 위치로이동 (controllers/*) 
  - 현재는 room기준이므로 room/ctl_room임.update 기준
  - 따라서 controllers/room/exports/room.put.js의 updateGuest로 이동
  - Schema를 불러옴 (/schema/guestSchema)
  - body에 담긴 변수들을 대입, schema에 담아서 controller에리턴 
  - 이값을 가지고 models/roomModel.js의 updateGuest로 이동 
  - 쿼리문을 제작후 실행 
  - 라즈베리와 연결되어있는 소켓이 있는지 확인, 있는경우 해당 mac에 신호를줌. 없으면 X 
  - 메인 목록으로 돌아감
  - 요약시 다음과같다
  ```
  roomEdit.ejs -> roomEdit.ejs(wizard)->
  routes/room.js -> controllers/room/exports/room.put.js(updateGuest)-> 
  schema/guestSchema -> controllers ->
  models/roomModel -> controllers ->
  Socker -> roomList.ejs
  ```
