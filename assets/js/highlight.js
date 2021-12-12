window.onload = () => {

  var all_code = document.getElementsByClassName("rouge-code");
  for (var j = 0; j < all_code.length; j++) {
      var pre = all_code[j].children[0];
      var lines = pre.innerHTML.split("\n");
      for (var k = 0; k<lines.length; k++) {
          if (lines[k].includes("n")) {
              lines[k] = "<span class='highlight_backline_green'>" + lines[k].replace("n", "") + "</span>"
          }
          if (lines[k].includes("<span class=\"err\"></span><span class=\"n\">n</span>")) {
              lines[k] = "<span class='highlight_backline_green'>" + lines[k].replace("<span class=\"err\"></span><span class=\"n\">n</span>", "") + "</span>"
          }
          if (lines[k].includes("m")) {
              lines[k] = "<span class='highlight_backline_yellow'>" + lines[k].replace("m", "") + "</span>"
          }
          if (lines[k].includes("<span class=\"err\"></span><span class=\"n\">m</span>")) {
              lines[k] = "<span class='highlight_backline_yellow'>" + lines[k].replace("<span class=\"err\"></span><span class=\"n\">m</span>", "") + "</span>"
          }
          console.log(lines[k]);
      }
      pre.innerHTML = lines.join("\n");
  }

}
