
# NGA APP by Vue.js

> A Vue.js Porject

> 声明：本APP及其代码非NGA工程团队创作或维护，所含之一切资源及内容皆不受保护，版权均归『艾泽拉斯国家地理』及北京智珠网络技术有限公司所有。

> 数据接口由[zeg](http://bbs.ngacn.cc/read.php?tid=6406100)开放提供

> 目前仅提供浏览功能...


## Preview

![](http://www.z4a.net/images/2017/01/24/QQ20170124-224434.gif)
![](http://www.z4a.net/images/2017/01/24/QQ20170124-224708.gif)
![](http://www.z4a.net/images/2017/01/24/QQ20170124-232307.gif)

***

## Using

> Frontend

- [Vue.js](https://github.com/vuejs/vue)
- [vue-router](https://github.com/vuejs/vue-router)
- [vue-resource](https://github.com/pagekit/vue-resource)
- [vuex](https://github.com/vuejs/vuex)
- [cooking](https://github.com/elemefe/cooking/)
- [webpack](https://github.com/webpack/webpack)
- [Muse-UI](https://github.com/museui/muse-ui)

> Backend

- [Springboot](https://github.com/spring-projects/spring-boot)
- [OkHttp](https://github.com/square/okhttp)
- [Kotlin](https://github.com/JetBrains/kotlin)

> etc

- [docker](https://www.docker.com/)
- Nginx
- Apache Tomcat

***

## Live Demo

[Demo (for mobile)](https://vue-nga.arukascloud.io/home)

***

## Installation

### Docker Image:

[crazy0x/vue-nga:1.4](https://hub.docker.com/r/crazy0x/vue-nga/tags/)

1. sing up Arukas(https://app.arukas.io/)
2. configuration as picture, app name and endpoint(domain) can fill whatever you want
3. submit and waiting for deployment, open https://yourdomain.arukascloud.io/home

![](http://www.z4a.net/images/2017/01/26/QQ20170126-0950072x.png)


***

### Debug

runtime environment

- Node.js 4+
- npm 3+
- Python 2.7.x

install cooking
```

  npm i cooking-cli -g

```

- deploy nga-data-delegate
- modify baseurl (in ./vuex/store.js) to local adress (default localhost:8888)
- start debugging

```

  npm install
  cooking watch

```
- open localhost:8808/home

***

## Building

```
  cooking build
```
