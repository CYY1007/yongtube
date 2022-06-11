/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/frontend/js/videoPlayer.js":
/*!****************************************!*\
  !*** ./src/frontend/js/videoPlayer.js ***!
  \****************************************/
/***/ (() => {

eval("var playBtn = document.getElementById(\"play\");\nvar video = document.querySelector(\"video\");\nvar volumeRange = document.getElementById(\"volume\");\nvar muteBtn = document.getElementById(\"mute\");\nvar currentTime = document.getElementById(\"currentTime\");\nvar totalTime = document.getElementById(\"totalTime\");\nvar timeLine = document.getElementById(\"timeLine\");\nvar fullScreenBtn = document.getElementById(\"fullScreen\");\nvar videoControls = document.getElementById(\"videoControls\");\nvar videoContainer = document.getElementById(\"videoContainer\");\nvar volumeValue = 0.5;\nvolumeRange.value = volumeValue;\nvar controlMove = null;\n\nvar handlePlay = function handlePlay(event) {\n  if (video.paused) {\n    video.play();\n  } else video.pause();\n\n  playBtn.innerText = video.paused ? \"play\" : \"pause\";\n};\n\nvar handleMute = function handleMute(event) {\n  if (Number(volumeValue) === 0) return;\n\n  if (video.muted) {\n    video.muted = false;\n    volumeRange.value = volumeValue;\n  } else {\n    video.muted = true;\n    volumeValue = volumeRange.value;\n    volumeRange.value = 0;\n  }\n\n  muteBtn.innerText = video.muted ? \"unmute\" : \"mute\";\n};\n\nvar handleVolume = function handleVolume(event) {\n  var value = event.target.value;\n  volumeValue = value;\n  video.volume = value;\n\n  if (Number(volumeValue) === 0) {\n    video.muted = true;\n    muteBtn.innerText = \"unmute\";\n  } else if (video.muted && volumeValue !== 0) {\n    video.muted = false;\n    muteBtn.innerText = \"mute\";\n  }\n};\n\nvar formatTime = function formatTime(seconds) {\n  return new Date(seconds * 1000).toISOString().substring(14, 19);\n};\n\nvar handleTimeSetting = function handleTimeSetting(event) {\n  totalTime.innerText = formatTime(Math.floor(video.duration));\n  timeLine.max = Math.floor(video.duration);\n};\n\nvar handleTimeUpdate = function handleTimeUpdate(event) {\n  timeLine.value = Math.floor(video.currentTime);\n  currentTime.innerText = Math.floor(video.currentTime);\n};\n\nvar handleTimeChange = function handleTimeChange(event) {\n  video.currentTime = timeLine.value;\n  currentTime.innerText = Math.floor(timeLine.value);\n};\n\nvar handleFullScreen = function handleFullScreen(event) {\n  var fullscreenObj = document.fullscreenElement;\n\n  if (fullscreenObj) {\n    document.exitFullscreen();\n    fullScreenBtn.innerText = \"Enter Full Screen\";\n  } else {\n    videoContainer.requestFullscreen();\n    fullScreenBtn.innerText = \"Exit Full Screen\";\n  }\n};\n\nvar hide = function hide() {\n  return videoControls.classList.remove(\"showing\");\n};\n\nvar handleMouseMove = function handleMouseMove(event) {\n  if (controlMove) {\n    clearTimeout(controlMove);\n    controlMove = null;\n  }\n\n  videoControls.classList.add(\"showing\");\n  controlMove = setTimeout(hide, 2000);\n};\n\nvar handleHide = function handleHide(event) {\n  controlsTimeout = setTimeout(hide, 2000);\n};\n\nvar handleContainerClick = function handleContainerClick(event) {\n  handlePlay();\n};\n\nvar handleUpdateView = function handleUpdateView(event) {\n  var id = videoContainer.dataset.id;\n  fetch(\"/api/videos/\".concat(id, \"/end\"), {\n    method: \"POST\"\n  });\n};\n\nif (video.readyState == 4) {\n  handleLoadedMetadata();\n}\n\nplayBtn.addEventListener(\"click\", handlePlay);\nmuteBtn.addEventListener(\"click\", handleMute);\nvolumeRange.addEventListener(\"input\", handleVolume);\nvideo.addEventListener(\"loadedmetadata\", handleTimeSetting);\nvideo.addEventListener(\"timeupdate\", handleTimeUpdate);\ntimeLine.addEventListener(\"input\", handleTimeChange);\nfullScreenBtn.addEventListener(\"click\", handleFullScreen);\nvideo.addEventListener(\"mousemove\", handleMouseMove);\nvideo.addEventListener(\"mouseleave\", handleHide);\nvideoContainer.addEventListener(\"click\", handleContainerClick);\nvideo.addEventListener(\"ended\", handleUpdateView);\n\n//# sourceURL=webpack://last-chellenge/./src/frontend/js/videoPlayer.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/frontend/js/videoPlayer.js"]();
/******/ 	
/******/ })()
;