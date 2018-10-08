FROM node
RUN mkdir -p /www/admin_herhairworld
WORKDIR /www/admin_herhairworld

#移动文件
COPY . /www/admin_herhairworld

RUN npm install

RUN npm run build

EXPOSE 5002

CMD ["npm", "start" ]