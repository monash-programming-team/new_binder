$(document).ready(() => {

  var all_code = document.getElementsByClassName("rouge-code");
  for (var j = 0; j < all_code.length; j++) {
      var pre = all_code[j].children[0];
      var lines = pre.innerHTML.split("\n");
      var open = true;
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
          if (lines[k].includes("b")) {
            lines[k] = "<span class='highlight_backline_blue'>" + lines[k].replace("b", "") + "</span>"
          }
          if (lines[k].includes("<span class=\"err\"></span><span class=\"n\">b</span>")) {
              lines[k] = "<span class='highlight_backline_blue'>" + lines[k].replace("<span class=\"err\"></span><span class=\"n\">b</span>", "") + "</span>"
          }
          if (lines[k].includes("c")) {
              if (open) {
                  lines[k] = lines[k].replace("c", "<span class=\"code_fold code_fold_closed\"><button></button><span class=\"code_fold_span\">");
              } else {
                  lines[k] = "</span></span>" + lines[k].replace("c", "");
              }
              open = !open;
            }
            if (lines[k].includes("<span class=\"err\"></span><span class=\"n\">c</span>")) {
                if (open) {
                    lines[k] = lines[k].replace("<span class=\"err\"></span><span class=\"n\">c</span>", "<span class=\"code_fold code_fold_closed\"><button></button><span class=\"code_fold_span\">");
                } else {
                    lines[k] = "</span></span>" + lines[k].replace("<span class=\"err\"></span><span class=\"n\">c</span>", "");
                }
              open = !open;
          }
      }
      pre.innerHTML = lines.join("\n");
  }

  var all_folds = document.getElementsByClassName("code_fold");
  for (var j = 0; j < all_folds.length; j++) {
    all_folds[j].onclick = (x) => {
      if (x.target.parentElement.classList.contains("code_fold_closed")) {
        x.target.parentElement.classList.remove("code_fold_closed");
        x.target.parentElement.classList.add("code_fold_opened");
      } else {
        x.target.parentElement.classList.add("code_fold_closed");
        x.target.parentElement.classList.remove("code_fold_opened");
      }
    }
  }
});
