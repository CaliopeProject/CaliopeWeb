$("#sidebar-collapse").on("click", function () {¬
  $("#sidebar").toggleClass("menu-min");¬
  $(this.firstChild).toggleClass("icon-double-angle-right");¬
  a = $("#sidebar").hasClass("menu-min");¬
  if (a) {¬
    $(".open > .submenu").removeClass("open")¬ 
  }¬
});
