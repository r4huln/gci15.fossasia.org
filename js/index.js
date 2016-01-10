
/*
Copyright (c) 2015 by Nikolay Talanov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
$(document).ready(function() {

  var $slider = $(".slider"),
      $slideBGs = $(".slide__bg"),
      diff = 0,
      curSlide = 0,
      numOfSlides = $(".slide").length-1,
      animating = false,
      animTime = 500,
      autoSlideTimeout,
      autoSlideDelay = 6000,
      $pagination = $(".slider-pagi");

  function createBullets() {
    for (var i = 0; i < numOfSlides+1; i++) {
      var $li = $("<li class='slider-pagi__elem'></li>");
      $li.addClass("slider-pagi__elem-"+i).data("page", i);
      if (!i) $li.addClass("active");
      $pagination.append($li);
    }
  };

  createBullets();

  function manageControls() {
    $(".slider-control").removeClass("inactive");
    if (!curSlide) $(".slider-control.left").addClass("inactive");
    if (curSlide === numOfSlides) $(".slider-control.right").addClass("inactive");
  };

  function autoSlide() {
    autoSlideTimeout = setTimeout(function() {
      curSlide++;
      if (curSlide > numOfSlides) curSlide = 0;
      changeSlides();
    }, autoSlideDelay);
  };

  autoSlide();

  function changeSlides(instant) {
    if (!instant) {
      animating = true;
      manageControls();
      $slider.addClass("animating");
      $slider.css("top");
      $(".slide").removeClass("active");
      $(".slide-"+curSlide).addClass("active");
      setTimeout(function() {
        $slider.removeClass("animating");
        animating = false;
      }, animTime);
    }
    window.clearTimeout(autoSlideTimeout);
    $(".slider-pagi__elem").removeClass("active");
    $(".slider-pagi__elem-"+curSlide).addClass("active");
    $slider.css("transform", "translate3d("+ -curSlide*100 +"%,0,0)");
    $slideBGs.css("transform", "translate3d("+ curSlide*50 +"%,0,0)");
    diff = 0;
    autoSlide();
  }

  function navigateLeft() {
    if (animating) return;
    if (curSlide > 0) curSlide--;
    changeSlides();
  }

  function navigateRight() {
    if (animating) return;
    if (curSlide < numOfSlides) curSlide++;
    changeSlides();
  }

  $(document).on("mousedown touchstart", ".slider", function(e) {
    if (animating) return;
    window.clearTimeout(autoSlideTimeout);
    var startX = e.pageX || e.originalEvent.touches[0].pageX,
        winW = $(window).width();
    diff = 0;

    $(document).on("mousemove touchmove", function(e) {
      var x = e.pageX || e.originalEvent.touches[0].pageX;
      diff = (startX - x) / winW * 70;
      if ((!curSlide && diff < 0) || (curSlide === numOfSlides && diff > 0)) diff /= 2;
      $slider.css("transform", "translate3d("+ (-curSlide*100 - diff) +"%,0,0)");
      $slideBGs.css("transform", "translate3d("+ (curSlide*50 + diff/2) +"%,0,0)");
    });
  });

  $(document).on("mouseup touchend", function(e) {
    $(document).off("mousemove touchmove");
    if (animating) return;
    if (!diff) {
      changeSlides(true);
      return;
    }
    if (diff > -8 && diff < 8) {
      changeSlides();
      return;
    }
    if (diff <= -8) {
      navigateLeft();
    }
    if (diff >= 8) {
      navigateRight();
    }
  });

  $(document).on("click", ".slider-control", function() {
    if ($(this).hasClass("left")) {
      navigateLeft();
    } else {
      navigateRight();
    }
  });

  $(document).on("click", ".slider-pagi__elem", function() {
    curSlide = $(this).data("page");
    changeSlides();
  });

  // @mborsch FLIPPY SECTION HEADERS! :P
  function isElementInViewport(elem, biasUp) {
    var $elem = $(elem);

    // Get the scroll position of the page.
    var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html');
    var viewportTop = $(scrollElem).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    // Get the position of the element on the page.
    var elemTop = Math.round( $elem.offset().top );
    var elemBottom = elemTop + $elem.height();

    return ((elemTop < viewportBottom + (biasUp ? 0 : 500)) && (elemBottom > viewportTop - (biasUp ? 0 : 500)));
  }

  function checkAnimation() {
      var $elem = $('.section-h1').each(function( index ) {
        var isInView = isElementInViewport($(this));

        if ($(this).hasClass('start')) {
          if (!isInView) {
            $(this).removeClass('start');
          }

          return;
        };

        if (isInView) {
            $(this).addClass('start');
        }
      });
  }

  var images = $.makeArray($('.card-img-top'));
  function checkImages () {
    if (!images) { return; }

    images.forEach(function( item, index ) {
        if (item.getAttribute ("src") == "" && isElementInViewport(item, scrollingUp)) {
          item.setAttribute ("src", item.getAttribute ("data"));
          images.splice (index, 1);
        }
      });
  }

  var lastScrollTop = 0;
  var scrollingUp = false;
  $(document).scroll(function(){
    var st = $(this).scrollTop();
    scrollingUp = st < lastScrollTop;
      
    checkAnimation();
    if (!images.length < 1) {
      checkImages();
    }

    lastScrollTop = st;
  });
  //End Flippy Section Headers

  //DYNAMIC SOCIAL WIDGETS
  var isMobile = ($(window).width() < 500 ? true : false);

  $("#GPlusPage").html('<div class="g-page" data-layout="' + (isMobile ? "landscape" : "portrait") + '" data-width="' + (isMobile ? 150 : 450) + '" data-href="https://plus.google.com/+FossasiaOrg"></div>');
  //End Dynamic Social Widgets

  $.getJSON("https://api.github.com/repos/fossasia/gci15.fossasia.org/contributors", function (json) {
    output = "";
    for (var i = 0; i <= json.length - 1; i++) {
      output = output + '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-3">\n';
      output = output + '<div class="card">\n';
      output = output + '<a href="https://github.com/' + json[i].login + '">';
      output = output + '<div class="avatar img-circle">\n';
      output = output + '<img class="card-img-top" src="" data="https://avatars.githubusercontent.com/u/' + json[i].id + '?v=3" alt="' + json[i].login + '">\n';
      output = output + '</div>';
      output = output + '<div class="card-block">';
      output = output + '<h4 class="card-title">' + json[i].login + '</h4>';
      output = output + '</a>';
      output = output + '</div>';
      output = output + '</div>';
      output = output + '</div>';
    }
    $('.contributers').append(output);
    images = $.makeArray($('.card-img-top[src=""]'));
  });
  
//Peers detail fetcher
  var loklak_request = $.ajax({
    url: "http://www.loklak.org/api/peers.json",
    method: "GET",
    dataType: "jsonp"
  });
  
  
  loklak_request.done(function(json_result) {
    var peers = json_result.peers;
    var table = $('#loklak_table');
    var count = json_result.count; 
    var counter = (count/2) ;
    var ocount = Math.ceil(count/2)-1;
    if (count%2 != 0 ) {    
    for(i = 0; i < ocount; i++) {//for odd numbers
   table.append("<tr><td>"+peers[i].host+"</td><td>"+dateFormatter(peers[i].lastSeen)+" Hours Ago</td><td>"+ 
    peers[i+ocount].host+"</td><td>"+dateFormatter(peers[i+ocount].lastSeen)+" Hours Ago</td></tr>");
    }
   table.append("<tr><td>"+peers[i+ocount].host+"</td><td>"+dateFormatter(peers[i+ocount].lastSeen)+" Hours Ago</td><td id='endrow'style='text-align:right' > Available Peers: &nbsp;</td><td id='endrow'>"+ count  +"</td></tr>");
}
   
   else{//for even numbers
     for(i = 0; i < counter; i++) {
      table.append("<tr><td>"+peers[i].host+"</td><td>"+dateFormatter(peers[i].lastSeen)+" Hours </td><td>"+ peers[i+counter].host+"</td><td>"+dateFormatter(peers[i+counter].lastSeen)+" Hours </td></tr>");
    }

   table.append("<tr ><td id='endrow'rowspan= '1' colspan='4' > Available Peers: &nbsp;"+ count  +"</td></tr>");
   }

  });  
  
  var dateFormatter = function (unix_timestamp) {
    //convert to miliseconds
    var date = new Date(unix_timestamp);
    var dateNow = (new Date).getTime();
    var difference = Math.abs(dateNow - date);
    var dateCompare = new Date(difference*1000);
    // Hours part from the timestamp
    var hours = dateCompare.getHours();

    // Will display time in 10:30:23 format
    return hours;
    
  };
//Retrieve tweets from loklak using AJAX
  var tweetsTemplate = function (tweet, tweetURL, username, name, profilePicURL) {
    $('#tweet-container').append('<div class="tweetbox"> \
                      <a class="tweetLink" target="_blank" href="'+tweetURL+'">Tweet</a> \
                      <div class="profilePic"> \
                        <img src="'+profilePicURL+'"> \
                      </div> \
                      <div class="tweet-content"> \
                        <h4><a class="nameLink" target="_blank" href="https://twitter.com/'+username+'">'+name+'</a></h4> \
                        '+tweet+' \
                      </div> \
                    </div> ');
  };
  
  var fetchLoklakTweets = $.ajax({
    url: "http://loklak.org/api/search.json?q=%40fossasia&count=20", //get @fossasia tweets
    method: "GET",
    dataType: "jsonp"
  });
  
  fetchLoklakTweets.done(function(json_result) {
    var tweets = json_result.statuses;
    
    for(var index in tweets) {
      var tweet = tweets[index].text.replace(/\\/g, ''); //since characters are escpaed
      var tweetLink = tweets[index].link;
      var username = tweets[index].user.screen_name;
      var name = tweets[index].user.name;
      var profilePic = tweets[index].user.profile_image_url_https;
      tweetsTemplate(tweet, tweetLink, username, name, profilePic);
    }
  })
  .fail(function() { console.log("The loklak call failed.")});
  
  
});
// Anchor to Anchor smooth scroll
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});