window.onload = () => {
    // Open all Python tabs by default.
    var all_tablinks = document.getElementsByClassName("code-tablinks");
    for (var j = 0; j < all_tablinks.length; j++) {
        all_tablinks[j].className = all_tablinks[j].className.replace(" active", "");
        if (all_tablinks[j].innerHTML.toString() === "Python") {
            all_tablinks[j].className += " active";
        }
    }

    var all_tabcontent = document.getElementsByClassName("code-tabcontent");
    for (var j = 0; j < all_tabcontent.length; j++) {
        all_tabcontent[j].style.display = "none";
        if (all_tabcontent[j].id.indexOf("Python") !== -1) {
            all_tabcontent[j].style.display = "block";
        }
    }
    // Generate tooltips
    // https://stackoverflow.com/a/48569235
    $(document).on('mouseover','.tooltip', function() {
      var tooltipTrigger = $('[data-toggle="tooltip"][aria-describedby="' + $(this).attr('id') + '"');
      if(! $(tooltipTrigger).hasClass('active')) {
        $(tooltipTrigger).tooltip('show').addClass('active');
      }
    });
    $(document).on('mouseout','.tooltip-inner', function() {
      $('[data-toggle="tooltip"].active').tooltip('hide').removeClass('active');
    });

    $('[data-toggle="tooltip"]').tooltip()
};

function openCodeTab(evt, contentClass, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName(contentClass);
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName(contentClass + "-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
