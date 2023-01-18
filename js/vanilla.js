"use strict";
import slideData from "./data.js";
// 要素の取得・作成
const slideContainer = document.getElementById("vanillaSlideContainer");
const slider = document.getElementById("vanillaSlider");
const btnArea = document.getElementById("btnArea");
const vanillaArrows = document.getElementById("vanillaArrows");

//各変数宣言
let newSlideData = [...slideData]; //配列のシャローコピー
let isFirstRound = true; //１回目のアニメーション時の挙動調整用
let centerMode = true; //センターモードの指定
let item = ""; //配列の入れ替え時に、一時保管用の変数
let isSlide = true; //スライドアニメーションの停止・再生の状態
let cell_width;
//スライドの表示枚数
let slidesToShow;
if (window.matchMedia("(max-width: 750px)").matches) {
  slidesToShow = 1;
} else if (window.matchMedia("(max-width: 960px)").matches) {
  slidesToShow = 2;
} else {
  slidesToShow = 3;
}

// 要素取得後、スクリプト実行
window.onload = function () {
  getSlideWidth(slidesToShow);
  checkCenterMode();
  slideRender();
  btnRender();
  setInterval(function () {
    if (!isSlide) return;
    slideAnimation();
  }, 3350);
  // イベントハンドラーの呼び出し
  addEventListeners();
};

// **************************************************
// メソッド
// **************************************************

//centerModeの判定 *************************
function checkCenterMode() {
  //centerModeがtrueの時、配列の先頭を画面の中央に配置
  if (centerMode) {
    if (slidesToShow % 2 === 0) {
      const num = slidesToShow / 2;
      for (let i = 0; i < num; i++) {
        item = newSlideData.pop();
        newSlideData.unshift(item);
      }
    } else {
      const num = (slidesToShow + 1) / 2 - 1;
      for (let i = 0; i < num; i++) {
        item = newSlideData.pop();
        newSlideData.unshift(item);
      }
    }
  }
}
//スライド表示 *************************
function slideRender() {
  newSlideData.forEach(function (slideData) {
    slider.innerHTML += `<li class="vanillaSlider-cell">
  <a href="#">
    <img
      data-index ="${slideData.index}"
      src=${slideData.url}
      alt=${slideData.alt}
      title=${slideData.title}
    />
  </a>
</li>`;
  });
  const sliderCells = document.querySelectorAll(".vanillaSlider-cell");
  sliderCells.forEach(function (cell) {
    cell.style.width = `${cell_width}px`;
  });
}
//セレクトボタン表示 *************************
function btnRender() {
  let btnNam = 1;
  for (let i = 0; i < newSlideData.length; i++) {
    btnArea.innerHTML += `<li class="select-btn" data-btn-index="${btnNam}"><button>${btnNam}</button></li>`;
    btnNam++;
  }
}
//イベントハンドラー *************************
function addEventListeners() {
  document.body.addEventListener("click", function (e) {
    selectedSlideBtn(e);
  });
  vanillaArrows.addEventListener("click", function (e) {
    selectedArrowBtn(e);
  });
  slider.addEventListener("mouseover", function () {
    isSlide = false;
  });
  slider.addEventListener("mouseout", function () {
    isSlide = true;
  });
  window.addEventListener("resize", function () {
    if (window.matchMedia("(max-width: 750px)").matches) {
      cellResize(1);
    } else if (window.matchMedia("(max-width: 960px)").matches) {
      cellResize(2);
    } else {
      cellResize(3);
    }
  });
}
//スライドアニメーション *************************
function slideAnimation() {
  slider.animate(
    {
      transform: ["translateX(0px)", `translateX(${-cell_width}px)`],
    },
    {
      duration: 300,
      fill: "forwards",
      direction: "normal",
      easing: "ease-out",
    }
  );
  if (isFirstRound) {
    isFirstRound = !isFirstRound;
  } else {
    item = newSlideData.shift();
    newSlideData.push(item);
    slider.innerHTML = "";
    slideRender();
  }
}
//スライドリバースアニメーション *************************
function reverseSlideAnimation() {
  slider.animate(
    {
      transform: [`translateX(${-cell_width}px)`, "translateX(0px)"],
    },
    {
      duration: 300,
      fill: "forwards",
      direction: "normal",
      easing: "ease-out",
    }
  );
  isFirstRound = true;
  item = newSlideData.pop();
  newSlideData.unshift(item);
  slider.innerHTML = "";
  slideRender();
}
//セレクトボタンクリック時の処理 *************************
function selectedSlideBtn(e) {
  const selectBtn = e.target.closest(".select-btn");
  const getCellImgs = document.querySelectorAll(".vanillaSlider-cell a img");

  if (!selectBtn) return;
  slidePause();

  getCellImgs.forEach(function (cellImg) {
    const getCellIndex = cellImg.dataset.index;
    const getBtnIndex = selectBtn.dataset.btnIndex;

    if (getCellIndex !== getBtnIndex) return;
    const firstClientRectX = slideContainer.getBoundingClientRect().x;
    const targetClientRectX = cellImg
      .closest(".vanillaSlider-cell")
      .getBoundingClientRect().x;
    const getSlideNum = Math.round(
      (targetClientRectX - firstClientRectX) / cell_width
    );
    const getSlideCount =
      getSlideNum < 0 ? newSlideData.length - 1 : getSlideNum;

    for (let i = 0; i < getSlideCount; i++) {
      slideAnimation();
    }
  });

  checkCenterMode();
  slider.innerHTML = "";
  slideRender();
}
//アローボタンクリック時の処理 *************************
function selectedArrowBtn(e) {
  slidePause();
  const selectArrow = e.target.id;
  if (selectArrow == "next") {
    slideAnimation();
  }
  if (selectArrow == "prev") {
    reverseSlideAnimation();
  }
}
//スライド一時停止 *************************
function slidePause() {
  isSlide = false;
  setTimeout(function () {
    isSlide = true;
  }, 2000);
}
//スライド単体及び、全体の幅取得 *************************
function getSlideWidth(slidesToShow) {
  cell_width = slideContainer.clientWidth / slidesToShow;
  slider.style.width = `${cell_width * newSlideData.length}px`;
}
//画面幅の変更に合わせてcellをリサイズ *************************
function cellResize(slidesToShow) {
  slidesToShow = slidesToShow;
  slider.innerHTML = "";
  getSlideWidth(slidesToShow)
  slideRender();
}

