
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

[Demo (for mobile)](http://crazy0x-vue-nga.daoapp.io/home)

***

## Installation

### Docker Image:

[crazy0x/vue-nga:1.1](https://hub.docker.com/r/crazy0x/vue-nga/tags/)

***

### Debug

runtime environment

- Node.js 4+
- npm 3+
- Python 2.7.x

安装 cooking
```

  npm i cooking-cli -g

```

- 部署server端
- 修改./vuex/store.js接口地址，指向后端部署的URL
- 进入项目目录

```

  npm install
  cooking watch

```
- 浏览器（调试模式中选择移动设备），打开主页 127.0.0.1:8808/home

***

## Building

```
  cooking build
```
