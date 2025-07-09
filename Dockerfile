FROM node:22

# 2. 작업 디렉토리 설정: 컨테이너 내부에서 작업할 폴더를 지정합니다.
WORKDIR /usr/src/app

# 3. 의존성 파일 복사: package.json과 package-lock.json을 먼저 복사합니다.
#    이렇게 하면 소스코드가 변경되어도 매번 npm install을 다시 하지 않아 효율적입니다.
COPY package*.json ./

# 4. 의존성 설치: 복사된 package.json을 바탕으로 npm install을 실행합니다.
RUN npm install

# 5. 소스코드 복사: 프로젝트의 모든 파일을 작업 디렉토리로 복사합니다.
COPY . .

# ✨ 1. 애플리케이션을 빌드하여 'dist' 폴더를 생성합니다. (매우 중요)
# 이 과정은 타입스크립트(.ts) 코드를 자바스크립트(.js) 코드로 변환합니다.
RUN npm run build

# 6. 앱 실행: 개발 모드로 NestJS 애플리케이션을 시작합니다.
#CMD ["npm", "run", "start:dev"]
CMD ["npm", "run", "start:prod"]
