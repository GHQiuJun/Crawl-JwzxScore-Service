# Crawl JwzxScore Service

crawl Score service from  http://jwzx.cqu.pt/

## Env
- [real](./app/real/env.js)

## Definitions

- [routes](./def/routes)

## start
- npm start

## docker
- [image][1]
- start
```
docker pull qiujundocker/crawl-jwzx-score-service:1.0.0

docker run -e APP_ID=xxx -e APP_KEY=xx -e PORT=4000 -p 12345:4000 qiujun/crawl-jwzx-score-service:1.0.0
```

## Difficulty

- puppeteer can't load in docker
  - 缺少一些依赖环境，需要在Dockerfile中安装
  - [参考文献:Hosting Puppeteer in a Docker container][2]
- 验证码识别
  - [腾讯AI开放平台接口][3]
- 对验证码识别失败/错误情况得处理
  - 重试机制

## Example

```
GET /crawl-score?user=2015211980&psd=xxx HTTP/1.1
Host: 127.0.0.1:12345
Content-Type: application/json

{
 res:true,
 data:{
    "zbA": [
         [
             "1",
             "20151",
             "040107",
             "C语言程序设计",
             "限选",
             "4.0",
             "正常考试",
             "83",
             "3.30",
             "83"
         ],
         [
             "2",
             "20151",
             "040120",
             "计算机科学导论",
             "必修",
             "3.0",
             "正常考试",
             "78",
             "3.00",
             "95"
         ],
         [
             "3",
             "20151",
             "040401",
             "高等数学(上)",
             "限选",
             "5.5",
             "正常考试",
             "88",
             "3.70"
         ]
     ],
     "zbB": [
         [
             "1",
             "20151",
             "000016",
             "大学生职业发展与就业指导1",
             "必修",
             "1.0",
             "正常考试",
             "A",
             "4.00"
         ]
     ],
     "xfTj": [
         [
             "必修",
             "56.5",
             "0"
         ],
         [
             "限选/选修",
             "65.5",
             "0"
         ],
         [
             "实践",
             "8",
             "0"
         ],
         [
             "任选",
             "12.5",
             "0"
         ],
         [
             "平均学分绩点",
             "3.28"
         ],
         [
             "6",
             "0"
         ]
     ]
 }
}

```


  [1]: https://cloud.docker.com/swarm/qiujundocker/repository/docker/qiujundocker/crawl-jwzx-score-service/general
  [2]: https://paul.kinlan.me/hosting-puppeteer-in-a-docker-container/
  [3]: https://ai.qq.com/doc/imagetranslate.shtml