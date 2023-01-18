"use strict";
import slideData from "./data.js";
let newSlideData = [...slideData];

//スライドの表示枚数
let getSlidesToShow;
if (window.matchMedia("(max-width: 750px)").matches) {
  getSlidesToShow = 1;
} else if (window.matchMedia("(max-width: 960px)").matches) {
  getSlidesToShow = 2;
} else {
  getSlidesToShow = 3;
}

//配列の数分スライドを挿入
newSlideData.forEach(function (slideData) {
  $(`<div class="slider-cell">
    <a href="#">
      <img
        data-index ="${slideData.index}"
        src=${slideData.url}
        alt=${slideData.alt}
        title=${slideData.title}
      />
    </a>
  </div>`).appendTo(".slider");
});

// **************************************************
// slick.js option
// **************************************************
$(function () {
  $(".slider").slick({
    appendArrows: $("#arrows"), //矢印の場所変更
    prevArrow: '<button class="slide-arrow prev-arrow">&laquo;</button>',
    nextArrow: '<button class="slide-arrow next-arrow">&raquo;</button>',
    infinite: true, //スライドのループを有効にするか。
    dots: true, // ドットナビゲーションを表示
    autoplay: true, //	自動再生を有効にするか。
    lazyLoad: "ondemand", //	画像の遅延読み込みを設定。
    slidesToShow: getSlidesToShow, // 表示させるスライド数
    slidesToScroll: 1, //スクロールするスライド数を設定。
    fade: false, //フェイドインにするか。
    swipeToSlide: true, //slidesToScrollの設定に関係なく、ユーザーがスライドを直接ドラッグまたはスワイプした場合は1スライドずつ動かす。
    centerMode: true, //センターモード
    centerPadding: "0", //前後のパディング
  });
});
