<a name="0.5.1"></a>
### 0.5.1 (2015-02-04)


#### Bug Fixes

* **candy-basket:** various production adjustments and fixes ([e46954f7](https://github.com/ghachey/candy-basket/commit/e46954f7be010bde1116589a1df4844927b49d63))


<a name="0.5.0"></a>
## 0.5.0 (2015-01-30)


#### Bug Fixes

* **candy-basket:** support for full deploy work-flow ([37a1a923](https://github.com/ghachey/candy-basket/commit/37a1a923acc902e9c204dd2443962f444d4e4802), closes [#36](https://github.com/ghachey/candy-basket/issues/36))
* **frontend:** several frontend build fixes ([1c5b202a](https://github.com/ghachey/candy-basket/commit/1c5b202aba2a8c643b8709412d69dbdee4001bb7))


#### Features

* **backend:** new configurable HTML sanitizer ([3dfae1fc](https://github.com/ghachey/candy-basket/commit/3dfae1fc254fb1730a43318852ec6e75c455d9ea), closes [#47](https://github.com/ghachey/candy-basket/issues/47))
* **frontend:**
  * animations and other visuals improvements ([0d267b0c](https://github.com/ghachey/candy-basket/commit/0d267b0c748d58d1a241bd08c40f19ba48570952))
  * support timeline and table view switching ([2214e928](https://github.com/ghachey/candy-basket/commit/2214e928267fff0166f703efaaf9ddfcfcb19b8e), closes [#41](https://github.com/ghachey/candy-basket/issues/41))
  * add loading spinning gif ([0a0e8d14](https://github.com/ghachey/candy-basket/commit/0a0e8d14cc6d6c552cec709d21b41cf6ffc90d96), closes [#42](https://github.com/ghachey/candy-basket/issues/42))
* **frontend-controllers:** support dynamic change of navigation active class ([d42dbc85](https://github.com/ghachey/candy-basket/commit/d42dbc85acc94adb68fec580951b0ac77a6d62f6))


<a name="0.4.0"></a>
## 0.4.0 (2015-01-03)


#### Bug Fixes

* **candy-modal:** fix sliding when modal open ([f254070e](https://github.com/ghachey/candy-basket/commit/f254070e417d7c5f819be0227132d7e35a802965), closes [#30](https://github.com/ghachey/candy-basket/issues/30))
* **frontend:** fix modal backdrop not showing ([d45a8791](https://github.com/ghachey/candy-basket/commit/d45a879193c8f48d38ca322a059e05c2ad1e0108))


#### Features

* **Gruntfile:** support for automated build of docs ([68619fff](https://github.com/ghachey/candy-basket/commit/68619fff9747db990bd8fa65ff1e7e48e3eb59f3), closes [#29](https://github.com/ghachey/candy-basket/issues/29))
* **candy-basket:** support for full candy basket deployment ([92d37590](https://github.com/ghachey/candy-basket/commit/92d37590ff66fbf62370064cecee16e7a559abaf))
* **candy-modal:** support for removing previously uploaded files ([2ec38443](https://github.com/ghachey/candy-basket/commit/2ec38443f9fa0260e6c2864833fd8a1374a4a70d), closes [#31](https://github.com/ghachey/candy-basket/issues/31))


<a name="0.3.2"></a>
### 0.3.2 (2014-12-29)


#### Bug Fixes

* **Gruntfile:** fix Grunt release work-flow ([ba478d73](https://github.com/ghachey/candy-basket/commit/ba478d735df2d071cc293a92c7e85a0499a97337))
* **frontend:**
 * support for automated build ([64f68eb4](https://github.com/ghachey/candy-basket/commit/64f68eb4dd634e788e92d6ea1b5568771ca18133))
 * fix and enhance candy modal tags input box ([21f232d7](https://github.com/ghachey/candy-basket/commit/21f232d7696483660f6cf1c4517ff703f70bbaa1), closes [#12](https://github.com/ghachey/candy-basket/issues/12))
* **controllers.js:** relax backend URL validation to match frontend
  ([c8378790](https://github.com/ghachey/candy-basket/commit/c83787907ce97970f8bc0b57abdaae852b83dcdf),
  closes [#1](https://github.com/ghachey/candy-basket/issues/1))

#### Breaking Changes

* Since several of the development packages were updated
and code updated as a consequence it will be necessary to re-install all
bower and npm packages. This is easily done by removing

  frontend/bower_components
  frontend/node_modules

and then executing:

  bower install & npm install
 ([64f68eb4](https://github.com/ghachey/candy-basket/commit/64f68eb4dd634e788e92d6ea1b5568771ca18133))


<a name="0.3.1"></a>
### 0.3.1 (2014-12-27)


#### Bug Fixes

* **CandyListTimeline:** Fix bug when deleting and then updating candies ([b552abf8](https://github.com/ghachey/candy-basket/commit/b552abf8c185ccb498636908e8d7328d51af34eb), closes [#3](https://github.com/ghachey/candy-basket/issues/3))
* **candyListController:** fix slide index issue when using go to end ([b14ab57d](https://github.com/ghachey/candy-basket/commit/b14ab57dfaa330edc5c9267ab65285d323e27a35), closes [#9](https://github.com/ghachey/candy-basket/issues/9))
* **styles:** progress bars display problem ([80f56b7a](https://github.com/ghachey/candy-basket/commit/80f56b7a35b5e6485d6dd1ea92e42f8fb837273f), closes [#17](https://github.com/ghachey/candy-basket/issues/17))


#### Features

* **backend:**
  * support for SSL/TLS encryption ([033228bd](https://github.com/ghachey/candy-basket/commit/033228bd04954acd6ea1fa5dc7f41d44966b0f39))
  * support for HTTP basic authentication ([f14e6d7e](https://github.com/ghachey/candy-basket/commit/f14e6d7e300c767717179267dcea2b8861c2c3c6))
  * support for upload/download to ownCloud server ([b38a088a](https://github.com/ghachey/candy-basket/commit/b38a088a564b7e851bba64a34ab15f08d9e7788d))
* **backend-frontend:**
  * support for download of files previously uploaded ([261149b2](https://github.com/ghachey/candy-basket/commit/261149b285e6977da37a1017f00e76129f1fac48))
  * add rough skeleton support for file uploads ([f3a573f7](https://github.com/ghachey/candy-basket/commit/f3a573f777f7754c4bdcf7d00852a601eba47981))
* **controllers:** add support for start/end date filtering using ui-slider ([af64ee20](https://github.com/ghachey/candy-basket/commit/af64ee20a758b91829ecc7689375dec15998c66b))
* **docs:**
  * automatic API generation from jsdoc ([96102508](https://github.com/ghachey/candy-basket/commit/9610250853fe883e728828c413d2f6c329326736))
  * documentation and automatic release history support ([da399885](https://github.com/ghachey/candy-basket/commit/da399885468f99925cea1c55732cdc1cdd2038c0))
* **frontend:** 
