# test-build-action


## 갓허브페이지 사용방법
- 원격저장소 세팅에서 GitHub Pages 열어줌

- gh-pages 모듈 다운
    - `npm i -D gh-pages`

- package.json 설정 (하단예시)
    - `"deploy": "gh-pages -d webapp/dist` 스크립트 항목에 추가
    주의: webapp/dist 는 배포할 경로임!
    - `"homepage": "https://oww1220.github.io/test-build-action/"` 루트항목에 추가 
    주의: 배포대상이 되는 깃허브 페이지 uri 제일뒤에 / 붙여줌!

- 구동명령어 
    - `npm run deploy`
    배포가 성공이 되면 node cmd에 Published 문자열 반환!

- 배포가 되면 원격저장소 세팅에서 GitHub Pages 에 gh-pages 브랜치가 새로 생성됨
- 브랜치 main||master 에서 gh-pages로 체크아웃 하면 배포된 url확인가능!!!

