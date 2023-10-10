<div align="center"><img alt="" width="202" height="276" src="https://tva1.sinaimg.cn/large/008i3skNgy1gpuye0dtvtg308p0bwdk0.gif"><br>
<h1>企业安全生产管控平台</h1>
</div>

## 简介

安全生产管控平台项目，以Vue2.x+Element2.x为基础搭建，同时整合`RuoYi`部分工具组件及方法。

## 目录结构概述

```.
├── public                           # 静态资源
├── src
│   ├── api                          # 按模块组织api
│   ├── assets                       # 图片、文字、样式等
│   ├── components                   # 公共组件
│   ├── layout                       # 通用布局
│   ├── permission.js                # 路由守卫
│   ├── router                       # 路由
│   ├── settings.js                  # 本地配置文件
│   ├── store                        # Vuex
│   ├── utils                        # 常用工具集
│   └── views
│       ├── components               # 与业务相关连组件
│       ├── dashboard                # 图表组件
│       ├── modules                  # 业务模块
└── vue.config.js                    # Vue项目配置文件

```

> 一点说明：
`api`、`views/components`、`views/dashboard`、`views/modules`文件夹内部均按照业务模块组织，未按业务模块组织的视为为公共部分。

## 准备

**基础知识部分不再赘述，值得指出的一点是：安装依赖请尽量使用`npm install`。**

## 开发

>在本项目的多数组件中你会看到`setup`方法，这仅仅是个人编程习惯与Vue3无关。

### 关于api

>request.js：位于`src/utils`下，是axios的进一步封装。请求拦截与返回拦截可在此文件内修改。

  **一个简单的用例：**

  **step1.在`src/api`下根据所需业务构建api请求文件，导入`request.js`编写相应api请求方法并导出。**
  ![api-write](https://tva1.sinaimg.cn/large/008i3skNgy1gpuu2aftdej30ts0kwq65.jpg)  

  **step2.在相应的业务组件处导入上述api请求方法并使用即可。**
  ![api-use](https://tva1.sinaimg.cn/large/008i3skNgy1gpuu7pp6asj312e0d8q51.jpg)

#### 进一步的

>当返回数据需要做大量预处理的时候，可以在编写的api请求方法内用`promise`对返回数据做预处理。
![api-pre](https://tva1.sinaimg.cn/large/008i3skNgy1gpuueehvr7j30u01844di.jpg)

### 关于router

>项目为动态路由，除基础的`login`、`404`、`401`、`home`、`redirect`由本地提供其余均来自后端数据。关于菜单及路由拆分等可产考`src/store/modules/permission.js`文件。
![router-dynamic](https://tva1.sinaimg.cn/large/008i3skNgy1gpuvvlfwh2j30u01gstno.jpg)

### 关于store

>状态数据位于`src/store`下，值得指出的是：大量的公共状态数据位于`src/store/modules/common.js`文件内，由于这部分数据与业务关联度不高顾并未做进一步拆分。
![store-common](https://tva1.sinaimg.cn/large/008i3skNgy1gpuvgaseauj30nm16mtcz.jpg)

### 关于业务

>关于业务此处无法穷举且多有变动，具体细节应以实际需求为准。但是，依然有几点可以指出。

#### 表单对话框

>由于复用的需要，在多数dialog中你会看到如下html模板。
![dialog-template](https://tva1.sinaimg.cn/large/008i3skNgy1gpuwg90w4fj312b0u0dlu.jpg)
**其本质是拆分出单独的form组件以供多处复用的需要，当然对于无复用需求亦或功能简单的dialog大可不必如此。**  

#### 对于表单组件内部通常会实现一个`validate`方法以供外层dialog调用，其本质上依然是返回一个promise

>
![form-validate](https://tva1.sinaimg.cn/large/008i3skNgy1gpuwrxljcgj314c0oq0wu.jpg)

#### 值得指出的另外一点是：当form组件内部仍然有其它子form组件时，在返回promise的内部会对所有数据进行一层预处理

>
![dialog-forms](https://tva1.sinaimg.cn/large/008i3skNgy1gpuwztwzokj30u01amk5f.jpg)
![form-validate-pre](https://tva1.sinaimg.cn/large/008i3skNgy1gpux0llbucj312m0u0gs9.jpg)

#### 图表

>本项目图表部分多为`echarts`，文件位于`src/views/dashboard`下按业务模块排布。图表数据展示复用性并不高，此处以组件形式拆分主要是方便日后维护。
![dashboard](https://tva1.sinaimg.cn/large/008i3skNgy1gpux9dxyewj30710bi0te.jpg)

## THE END 🙏