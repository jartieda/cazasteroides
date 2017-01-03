toolbox.controller('CazasteroidesController', function($scope, $location, Login) {


  $scope.login = {};
  $scope.login.email = 'sergy_keko_93@hotmail.com';
  $scope.login.password = 'SRDgloria2016';
  //var id_image = "57757d5ec87e5abc3e7b4733"
  var id_image = "5780f2da713f9e1f62655396"
  var id_rect = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  var fecha_imagen = Date();
  var clock_time;
  function initlogin() {

    $("#facebook_button").click(function(){
      console.log("opening in app browser");
      var url = "http://138.4.110.153/api/auth/facebook"
      var ref = cordova.InAppBrowser.open(url, "_blank", "");
      ref.addEventListener('loadstop', function(event) {
        console.log(event.url);
        var idx =event.url.indexOf("token")
        if (idx > 0 ){
          SERVER_TOKEN = event.url.substr(idx, 167);
          console.log("facebooklogging succes:" + SERVER_TOKEN)
          $location.path('/cazast-main');
          $scope.$apply();
          ref.close();
        }
      });
      return false;
    })

    $("#gosignup_button").click(function(e) {
      e.preventDefault();
      console.log("go signup");
      $location.url("/cazast-signup");
      $scope.$apply();
      return false;
    });

    $("#login_button").click(function(event) {
      event.preventDefault();
      var user = $("#user_login_txt").val();
      var pass = $("#pass_login_txt").val();
      localStorage.user = user;
      localStorage.pass = pass;
      $.ajax({
        url: SERVER_URL_BASE + '/auth/basic',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + pass));
        },
        success: function(data) {
          SERVER_TOKEN = data.token;
          console.log("logging succes")
          $location.path('/cazast-main');
          $scope.$apply();
        },
        error: function(jqXHR) {
          if (jqXHR.status == 401) {
            console.log('Invalid user or password');
            alert('Invalid User or password');
          } else {
            console.log('Error connecting to server');
            alert('Error connecting to server');
          }
        },
        failure: function(errMsg) {
          console.log(errMsg);
          alert(errMsg);
        }
      });
      return false;
    }); //endlogin button
    if (localStorage.user) {
      var user = $("#user_login_txt").val(localStorage.user);
      var pass = $("#pass_login_txt").val(localStorage.pass);
    } else {
      //$location.path('/cazast-firststeps');
      //$.mobile.navigate("#firststeps");
    }
    if (window.ga) window.ga.trackView('login');

  }

  function initsignup() {
    $("#signup_btton").click(function() {

      var username = $('#username_txt').val();
      if(/^[a-zA-Z0-9- ]*$/.test(username) == false) {
        alert('Your User name contains illegal characters. Please use only letters and numbers');
      }else{
        var userData = {
          "username": $("#username_txt").val(),
          "password": $("#password_txt").val(),
          "email": $("#email_txt").val()
        };
        console.log(userData);
        $.ajax({
          url: SERVER_URL_BASE + '/users',
          type: 'POST',
          data: JSON.stringify(userData),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function(data) {
            //$.mobile.navigate("#login");
            if (data.message)
              if (data.message == "user added"){
                alert("usuario añadido");
                $location.url("/cazast-login");
                $scope.$apply();
              }
              else{
                alert(data);
              }
          },
          error: function() {
            console.log('Error connecting to server');
            alert('Error connecting to server');
          },
          failure: function(errMsg) {
            console.log(errMsg);
            alert(errMsg);
          }
        });
      }
      return false;
    });
    if (window.ga) window.ga.trackView('signup')
  }

  function initreview() {
    api = new Api();
      console.log("requesting");
    api.getAllImageData(function(data){
      console.log("images: "+data.length);
      for (i = 0; i < data.length; i++) {
          var html = "<tr>";
          html = html + "<td>" + data[i].name + "</td>"
          html = html + "<td>" + "-" + "</td>"
          html = html + "<td><img src=\"" +api.server+"/images/"+data[i]._id+"/coverage\" height=100 width=100/>"  + "</td>"
          html = html + "</tr>";
          $("#review_fields").append(html);

      /*
      <h1>Fields</h1>
<table id="review_fields" class="rwd-table">
  <tr>
    <th>Nombre</th>
    <th>Num Muesta</th>
    <th>Covertura</th>
  </tr>
</table>

      */
      }
    });
    api.getObservation(function(data) {
      console.log(data);
      for (i = 0; i < data.length; i++) {
        var obs = data[i];
        if (obs.image){

          var html = "<tr id=row_"+obs._id+">";
          var title="";
          if (obs.image.name){
            title = obs.image.name
          } else {
            var lis = obs.image.filename[0].split("/");
            title = lis[lis.length-2];
          }

          //html = html + "<td>" + title + "</td>";
          //html = html + "<p>Usuario: " + obs.user.username + "</p>";
          var upvotes = 0;
          var downvotes = 0;
          if (obs.votes) upvotes = obs.votes.length ;
          if (obs.downvotes) downvotes = obs.downvotes.length;
          var errdec = 0;
          var errar = 0;
          var meandec = obs.Coord[0];
          var meanar = obs.Coord[1];

          for (var n = 0; n < obs.revisit.length;n++){
            meandec += obs.revisit[n].x;
            meanar += obs.revisit[n].y;
          }
          meandec /= (obs.revisit.length+1)
          meanar /= (obs.revisit.length+1)
          var sqrdec = (obs.Coord[0] -meandec)*(obs.Coord[0] -meandec);
          var sqrar = (obs.Coord[1] -meanar)*(obs.Coord[1] -meanar)
          for (var n = 0; n < obs.revisit.length;n++){
            sqrdec +=  (obs.revisit[n].x -meandec)*(obs.revisit[n].x -meandec) ;
            sqrar +=  (obs.revisit[n].y -meanar)*(obs.revisit[n].y -meanar) ;
          }
          sqrdec /= (obs.revisit.length+1)
          sqrar /= (obs.revisit.length+1)
          errdec = Math.sqrt(sqrdec);
          errar = Math.sqrt(sqrar);
          html = html + "<td>" + deg2hour(obs.Coord[0]) + "</td>"
          html = html + "<td>"+deg2degminsec(obs.Coord[1])+ "</td>";
          html = html + "<td>"+obs.image.fecha+ "</td>";
          html = html + "<td>"+errdec.toFixed(2) + "</td>"
          html = html + "<td>"+errar.toFixed(2) + "</td>";
          html = html + "<td>"+obs.pixCoordAbs[0].toFixed(2) + "</td>"
          html = html + "<td>"+obs.pixCoordAbs[1].toFixed(2) + "</td>";
          html = html + "<td>"+(obs.revisit.length+1)+ "</td>";//FIXME NUMERO DE DETECCIONES
          html = html + "<td>"+upvotes + "</td>";
          html = html + "<td>"+downvotes + "</td>";
          html = html + "<td>"+title+"</td>";
          html = html + "<td><button id=\"rev_gif_" + obs._id + "\">GIF</button><div id=\"rev_gif_div_"+obs._id+"\"> </div></td>";
          html = html + "<td><button id=\"rev_del_" + obs._id + "\">borrar</button></td>";
          html = html + "<td><button id=\"rev_but_" + obs._id + "\">MPC</button></td>";
          html = html + "<td><div id=\"div_" + obs._id + "\"></div></td>";

          html = html + "</tr>";
          $("#review_detections").append(html);
          $("#rev_del_" + obs._id).click((function() {
            var id = obs._id;
            return function(){
              api.delObs(id,function(){
                console.log("removed:"+id)
                $("#row_"+id).hide(1000);
                $("#row_"+id).remove();
              })
            }
          })());
          $("#rev_but_" + obs._id).click((function() {

          })());
          $("#rev_gif_" + obs._id).click((function() {
            var id = obs._id; //persist variable on closure
            return function(){
              //api.get_obs_gif(id,function(data){
                var url = SERVER_URL_BASE+"/obs/get_obs_gif/"+id;
                $("#rev_gif_div_"+id).append("<img src=\""+url+"\"/>");
              //});
            }
          })());
        }//endi fi imagen no borrada
      }
    })
    if (window.ga) window.ga.trackView('review')
  }

  function initforgot() {
    $("#send_forgot_btton").click(function() {
      var userData = {
        "email": $("#email_forgot_txt").val()
      };
      $("send_forgot_btton").attr("disabled", true);
      console.log(userData);
      $.ajax({
        url: SERVER_URL_BASE + '/users/forgot',
        type: 'POST',
        data: JSON.stringify(userData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
          //$.mobile.navigate("#login");
          if (data.res){
            if (data.res == "ok"){
              alert(getLanguageValue("message_sent"));
              $location.url("/cazast-login");
              $("send_forgot_btton").removeAttr("disabled");
              $scope.$apply();
            }
            else{
              alert(data);
            }
          }
        },
        error: function() {
          console.log('Error connecting to server');
          alert('Error connecting to server');
        },
        failure: function(errMsg) {
          console.log(errMsg);
          alert(errMsg);
        }
      });
      return false;
    });
    if (window.ga) window.ga.trackView('fotgot')
  }

  function initmain() {
    // code to execute on each page change
    console.log("mainpage init");
    $("#sidebar").panel();
    $("#sidelistview").listview();
    api = new Api();
    $('#infowindow').hide();
    $('#tv_link').hide();
    $('#tv_link2').hide();
    $('#teleop').hide();
    $('#fields_link2').hide();
    $('#review_link').hide();

    //var screen = $.mobile.getScreenHeight();
    var screen = $(window).height()
    var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight();
    var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();
    var contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height();
    var content = screen - header - footer - contentCurrent;

    $("#animation").height(content - 15);
    $(".ui-content").height(content);


    api.getMe(function(me){
      if (me.admin){
        //$('#tv_link').show();
        $('#tv_link2').show();
        $('#teleop').show();
        $('#fields_link2').show();
        $('#review_link').show();
      }
    })
    api.getLastImageData( function(image){
      id_image = image._id;
      currendfield = image.name;
      api.getHistogram(id_image);
      for (var j = 0; j < image.filename.length; j++)
      {
        if (j == 0) {
          api.getMetadata(id_image,j,function(){
            console.log("getLastImageData: scale: " +api.metadata[0].SKY +" -- "+ (api.metadata[0].SKY+1*api.metadata[0].SIGMA) +" 3*("+api.metadata[0].SIGMA+")");
            set_img_size($(window).width() , content);
            set_img_scale(api.metadata[0].SKY-3*api.metadata[0].SIGMA, api.metadata[0].SKY+3*api.metadata[0].SIGMA);
            updateGUIelements(400,20);
          });
        }else{
          api.getMetadata(id_image,j,function(){

          });
        }
      }
      set_map_file(image.mapfile);
      fecha_imagen= image.fecha;
      var rect = change_img();
      api.newRect(rect, id_image, function(data) {
        console.log("rect created:" + data);
        id_rect = data._id;
      });

    })
    $("#nuevo_reto_button").hide();

    clock_time=new Stopwatch($("#clock")[0]);
    clock_time.set_alarm(5000, function(){
      $("#nuevo_reto_button").show();
    });
    clock_time.start();
    $("#nuevo_reto").click(function() { //FIXME este botón se ha eliminado
      var rect = change_img();
      api.newRect(rect, id_image, function(data) {
        console.log("rect created:" + data);
        id_rect = data._id;
      });
      $("#sidebar").panel("close");
      $("#nuevo_reto_button").hide();
      clock_time.reset();
      clock_time.set_alarm(5000, function(){
        $("#nuevo_reto_button").show();
      });

      return false;
    });


    $('.magnify').on('click',function(){
      console.log("click");
      $('#infowindow').hide();
      var html = "<p>"+getLanguageValue("wait")+"</p>"
      //html = html + "<p>+"+data.points+" points</p>"
      $('#infowindow').html(html);
      $('#infowindow').modal('show')
      //$("#infowindow").show().delay(5000).fadeOut();

      checkstar();
    });

    var draggable = document.getElementById('draggable');
    if (draggable) {
      draggable.addEventListener('touchstart', function(e) {
        e.preventDefault();
      })
      draggable.addEventListener('touchmove', function(e) {
        e.preventDefault();
      })
      /*console.log("configure dragable event for cross");
            draggable.addEventListener('touchmove', function(event) {
                var touch = event.targetTouches[0];
                console.log("touch dragable");
                // Place element where the finger is
                draggable.style.left = touch.pageX - 25 + 'px';
                draggable.style.top = touch.pageY - header - 25 + 'px';
                //xorig e yorig se definen en animation.js se actualizan con cada random
                var pixx = touch.pageX + xorig;
                var pixy = imgysize -(touch.pageY - header + yorig);
                pixcoord = [xorig, yorig];
                pixcoordabs = [pixx, pixy];
                coord = pix2coord(pixx, pixy, api.metadata[0]);
                repix = coord2pix(coord[0], coord[1], api.metadata[0]);
                $("#coord_div").html( //"pix: "+pixx+" "+pixy +"<br>" +
                    //"<br> relpix: "+ (touch.pageX)+ " " +(touch.pageY-header) +"<br>"+
                    "RA:" + deg2hour(coord[0]) + "<br>DEC:" + deg2degminsec(coord[1])//+
                  //  "<br>repix:"+repix[0]+" "+repix[1]
                  );
                //event.preventDefault();
            }, false);*/
    }

    pointSend = function() {
      api.newObservation(id_image, id_rect,
                         pixcoord, pixcoordabs, coord, getPoints(clock_time.get_clock(),api.metadata[0].SKY+2*api.metadata[0].SIGMA),
                         function(data) {
        $('#infowindow').hide();
        var html = "<p> Thanks.</p>"
        var pts = getPoints(clock_time.get_clock(),api.metadata[0].SKY+2*api.metadata[0].SIGMA);
        html = html + "<p>You will earn +"+pts.toFixed(2)+" points if your observation is confirmed</p>"
        $('#infowindow').html(html);
        //$('#infowindow').modal('show')
        $("#infowindow").show().delay(5000).fadeOut();

      })
    }
    noSend = function() {
      $('#infowindow').hide();
      $("#header-search-icon").attr("class", "fa fa-send");
      $("#header-search-txt").html(getLanguageValue("header-search-txt"));

    }


    function checkstar() {
      $("#header-search-icon").attr("class", "fa fa-spinner fa-spin");
      $("#header-search-txt").html("");

      //$("#header-search-icon").attr("src", "images/ajax-loader.gif")
      api.identify(deg2hour(coord[0]), deg2degminsec(coord[1]), fecha_imagen, function(data) {
        console.log(data);
        if (data.res) {
//           api.star(coord[0], coord[1], function(dat2) {
//            $("#header-search-icon").attr("class", "fa fa-send");
//            $("#header-search-txt").html("Check");
//            console.log(dat2);
//            if (dat2.includes("No neighboring")) {
              var html = "<p> Ningun Objeto en estas coordenadas.</p>"
              html = html + "<p>Desea reportarlo?</p> "
              html = html + "<button class=\"ui-btn\" onclick=\"pointSend()\">Si</button>"
              html = html + "<button class=\"ui-btn\" onclick=\"noSend()\">No</button>";
              $('#infowindow').html(html);
              $("#infowindow").show(1);
//            } else {
//              $("#infowindow").html(dat2);
//              //$("#infowindow").popup("open");
//              $("#infowindow").show(1);
//            }
//          })
        } else {
          $("#header-search-icon").attr("class", "fa fa-send");
          $("#header-search-txt").html(getLanguageValue("header-search-txt"));

          var cad = "Encontrado los siguientes objetos: <ul>";
          for (var i = 0; i < data.length - 1; i++) {
            cad = cad + "<li>" + data[i].designation + "</li>";
          }
          cad = cad + "</ul>";
          $("#infowindow").html(cad);
          //$("#infowindow").popup("open");
          $("#infowindow").show(1);
        }
      });

    }

    if ("ontouchstart" in document.documentElement) {
      console.log("touch interface");
      $('#a-sidebar').bind('touchstart touchon', function(event) {
        /*if(aSearchClicked){
                    $('#searchform').removeClass('moved');
                    aSearchClicked = false;
                }*/
      });
      $('#star-search').bind('touchstart touchon', function(event) {
        console.log("touch");
        event.preventDefault();
        checkstar();
      });
    } else {
      jQuery('#a-sidebar').bind('click', function(event) {
        /*if(aSearchClicked){
                    jQuery('#searchform').removeClass('moved');
                    aSearchClicked = false;
                }*/
      });
      jQuery('#star-search').bind('click', function(event) {
        console.log("click");
        event.preventDefault();
        checkstar();
      })
    }
if (window.ga) window.ga.trackView('main')
  }

  function initpremios() {
    api = new Api();
    api.getUsers(function(data) {
      console.log(data);
        var user = data[0]
        var html = "<div class=\"premios_winner\">";
        html = html + "<H1> Winner </H1>";
        html = html + "<img src=\"images/winnercup_.png\" width=100 heigh=100 style=\"width:100px\" />";
        html = html + "<H2>1. " + user.username + "</H2>";
        //html = html + "<p>Badges: " + user.badges.length + "</p>";
        if (!user.points) user.points = 0;
        html = html + " " + user.points + " Pts</p>";
        html = html + "</div>";
        $("#premioslist").append(html);
      for (i = 1; i < data.length; i++) {
        var user = data[i];
        var html = "<div >";
        html = html + "<p style=\"margin:0 0 0px;\">";
        if (i == 1)
          html = html + "<img src=\"images/secondcup.png\" width=32 heigh=32 style=\"width:32px\" />";
        else if (i == 2)
          html = html + "<img src=\"images/third_cup.png\" width=32 heigh=32 style=\"width:32px\" />";
        else
          html = html + (i+1) +". "
        html = html + user.username + "";

        //html = html + "<p>Badges: " + user.badges.length + "</p>";
        if (!user.points) user.points = 0;
        html = html + " " + user.points + " Pts</p>";
        html = html + "</div>";
        $("#premioslist").append(html);
      }
    })
    if (window.ga) window.ga.trackView('premios')
  }

  function initme() {
    api = new Api();
    api.getMe(function(me){
      //$('#tv_link').sh
      console.log(me);
      var html = "<div class=\"luke-text-box\">";
      if (!me.icon) me.icon = "img/icon-user-default.png";
      html = html + "<img src=\"" +  me.icon + "\" />";
      html = html + "<p>Usuario: " + me.username + "</p>";
      html = html + "<p>Badges: " +  me.badges.length + "</p>";
      if (!me.points) me.points = 0;
      html = html + "<p>Puntos: " + me.points + "</p>";
      if (me.admin){
        html = html + "<p>Role: Administrator</p>";
      }
      html = html + "</div>";
      $("#me_content").append(html);
    })
   if (window.ga) window.ga.trackView('me')
  }

  function initvote() {
    api = new Api();
    api.getObservation(function(data) {
      console.log(data);
      for (i = 0; i < data.length; i++) {
        var obs = data[i];
        if (obs.image){

          var html = "<div class=\"luke-text-box\">";
          var title="";
          if (obs.image.name)
            title = obs.image.name
            else {
              var lis = obs.image.filename[0].split("/");
              title = lis[lis.length-2];
            }
          html = html + "<p>Image: " + title + "</p>";
          html = html + "<p>Usuario: " + obs.user.username + "</p>";
          var upvotes = 0;
          var downvotes = 0;
          if (obs.votes) upvotes = obs.votes.length ;
          if (obs.downvotes) downvotes = obs.downvotes.length;
          html = html + "<p>Votes: " + (upvotes - downvotes) + "</p>";
          //html = html + "<p>Status: " + obs.status + "</p>";
          html = html + "<p>RA:" + deg2hour(obs.Coord[0]) + " Dec:"+
            deg2degminsec(obs.Coord[1])+ " T:"+obs.image.fecha+"</p>";
          html = html + "<button id=\"but_" + obs._id + "\">Ver imagen y votar</button>";
          html = html + "<div id=\"div_" + obs._id + "\"></div>";

          html = html + "</div>";
          $("#obslist").append(html);
          $("#but_" + obs._id).click((function() {
            var temp_closure = obs._id;
            var temp_closure_rect = obs.rect ? obs.rect._id : "";
            return function() {
              var url = SERVER_URL_BASE+"/obs/get_obs_gif/"+temp_closure;
              $("#div_" + temp_closure).html("<img id=\"img_" + temp_closure + "\" src=\"" + url+ "\"/>");

              //$("#div_" + temp_closure).html("<img id=\"img_" + temp_closure + "\" src=\"" + api.server +
              //                               "/images/rectangle/" + temp_closure_rect + "/img1\"/>");
              $("#div_" + temp_closure).append("<button id=\"but_yes_" + temp_closure + "\">Si</button>");
              $("#div_" + temp_closure).append("<button id=\"but_no_" + temp_closure + "\">No</button>");
              /*var tt = setInterval(function() {
                if ($("#img_" + temp_closure)){
                  if($("#img_" + temp_closure).attr("src")){
                    var idx_img = $("#img_" + temp_closure).attr("src").slice(-1);
                    idx_img = parseInt(idx_img);
                    idx_img = idx_img + 1;
                    if (idx_img == 5) {
                      idx_img = 1;
                    }
                    $("#img_" + temp_closure).attr("src", api.server +
                                                   "/images/rectangle/" + temp_closure_rect + "/img" + idx_img);
                  }
                }
              }, 500);*/

              $("#but_yes_" + temp_closure).click(function() {
                console.log("vode for " + temp_closure);
                api.voteObservation(temp_closure, function(data) {
                  console.log(JSON.stringify(data));
                })
                $("#div_" + temp_closure).html("");
                //clearInterval(tt);
              });
              $("#but_no_" + temp_closure).click(function() {
                console.log("down vote for " + temp_closure);
                api.downvoteObservation(temp_closure, function(data) {
                  console.log(JSON.stringify(data));
                })
                $("#div_" + temp_closure).html("");
                //clearInterval(tt);
              });

            }
          })());
        }//endi fi imagen no borrada
      }
    })
   if (window.ga) window.ga.trackView('vote')
  }

  function initfields() {
    api = new Api();
    $("#fields_update").click(function(){
      $.each($(".fields_subdiv"),function(key, d){
        if (d.children[0].children[0].checked==true){
          var id = d.children[0].children[0].value;
          api.selectImage(id,function(){
            console.log("Updated");
          })
        }else{
          var id = d.children[0].children[0].value;
          api.deselectImage(id,function(){
            console.log("Updated");
          })
        }
      })
      alert("Updated");
    })
    api.getAllImageData(function(images){
      var cont = $("#fields_content");
      for (var i = 0; i < images.length; i++){
        var image = images[i];
        var html = "<div class=\"luke-text-box fields_subdiv\">";
        /*"filename":[String],
            "mapfile":String,
            "fecha":Date,
            "height": Number,
            "width":Number,
            "xpoly":[Number],
            "ypoly":[Number],
            "minx": Number,
            "miny": Number,
            "maxx": Number,
            "maxy": Number,
            "active" Boolean*/
        html = html + "<h3><input type=\"checkbox\" name=\"fields_radio\" value=\""+image._id+"\""
        if (image.active) html = html + " checked=\"true\" "
        html = html +">" + image.name + "</h3>";
        html = html + "<p>" + image.fecha + "</p>";
        html = html + "<a href=\"#\" onclick=\"api.delImage('"+image._id+"');return false;\">borrar</a>"
        //html = html + "<p>" + image.width + " x "+image.height+ "</p>";
        //html = html + "<p>" + image.active + "</p>";
        html = html + "</div>";
        cont.append(html);
      }
    })
    if (window.ga) window.ga.trackView('fields')
  }
  function inittelevirt() {
    api = new Api();
    $("#btnbuscartelescvirt").click(function() {
      var method = $("#tv_method").val();
      var ra_h = $("#tv_ra_h").val();
      var ra_m = $("#tv_ra_m").val();
      var ra_s = $("#tv_ra_s").val();
      var dec_g = $("#tv_dec_g").val();
      var dec_m = $("#tv_dec_m").val();
      var dec_s = $("#tv_dec_s").val();
      var radio = $("#tv_radio").val();
      api.imagesFindMore(method,
                         ra_h, ra_m, ra_s, dec_g, dec_m, dec_s, radio,
                         function(data) {
        console.log(data);
        $("#tv_imagenes").html("");
        if (data.publicImages.public_image) {
          for (i = 0; i < data.publicImages.public_image.length; i++) {
            var image = data.publicImages.public_image[i];
            var html = "<div>";
            html = html + "<h3>" + image.nombre + "</h3>";
            html = html + "<p>" + image.descripcion + "</p>";
            html = html + "<p>" + image.fecha + "</p>";
            html = html + "<p>" + image.fitsgz + "</p>";
            html = html + "<p>" + image.idimagen + "</p>";
            html = html + "<p>" + image.instrume + "</p>";
            html = html + "<p>" + image.jpg + "</p>";
            html = html + "<img src=\"" + api.server + "/images/televirt/" + image.idimagen + "/thumb\"/>";
            html = html + "</div>";
            $("#tv_imagenes").append(html);
          }
        } else {
          var html = "<div>";
          html = html + "<p>No se encontraron imágenes</p>";
          html = html + "</div>";
          $("#tv_imagenes").append(html);
        }
      });
    });
    if (window.ga) window.ga.trackView('televirt1')
  }
  function inittelevirt2() {
    api = new Api();
    $("#btnAddTelescVirt2").click(function(){
      var data = []
      var name =[]
      jQuery("input[name='tv_imgscheck']").each(function() {
        console.log( this.value + ":" + this.checked );
        if (this.checked){
          var id = this.value.substring(11);
          data.push(id);
          name.push(this.attributes["imgname"].value);
        }
      }).promise().done(function (){
        console.log("end:"+JSON.stringify(data));
        if (data.length == 5){
          var campo = prompt("nombre del campo", name[0]);
          api.imagesUpdate(data,campo,function(res){
            console.log("res:"+res);
          });
        }else{
          alert("selecciona 5 imagenes");
        }
      });

    })
    $("#btnbuscartelescvirt2").click(function() {
      var dateObs = $("#tv2_date").val();
      var telescop = $("#tv2_telescop").val();
      var object = $("#tv2_object").val();
      api.imagesFindMoreDate (dateObs, telescop, object,
                              function(data) {
        console.log(data);
        $("#tv2_imagenes").html("");
        if (data.publicImages.public_image) {
          for (i = 0; i < data.publicImages.public_image.length; i++) {
            var image = data.publicImages.public_image[i];
            console.log(image);
            var html = "<div>";
            html = html + "<h3>" + image.titulo + "</h3>";
            html = html + "<p>" + image.descripcion + "</p>";
            html = html + "<p> <input type=\"checkbox\" name=\"tv_imgscheck\" value=\"tv2_select_"+image.idimagen+"\" imgname=\""+image.descripcion+"\" \\>"
            html = html + " " + image.fecha + "</p>";
            //html = html + "<p>" + image.fitsgz + "</p>";
            //html = html + "<p>" + image.idimagen + "</p>";
            html = html + "<p>Instrum.:" + image.instrume + "</p>";
            html = html + "<p>telescop.:" + image.telescop + "</p>";
            html = html + "Download:<a href=\"" + api.server + "/images/televirt/" + image.idimagen + "/jpeg\">";
            html = html +  image.idimagen + "</a>";
            //html = html + "<img src=\"" + api.server + "/images/televirt/" + image.idimagen + "/thumb\"/></a>";

            html = html + "</div>";
            $("#tv2_imagenes").append(html);
          }
        } else {
          var html = "<div>";
          html = html + "<p>No se encontraron imágenes</p>";
          html = html + "</div>";
          $("#tv2_imagenes").append(html);
        }
      });
    });
    if (window.ga) window.ga.trackView('televirt2')
  }

  $scope.$on('$routeChangeSuccess', function() {
    if(navigator.globalization){
      navigator.globalization.getPreferredLanguage(
        //Get Language from Settings
        function (locale) {
          cLANGUAGE = locale.value;
          languageControls(cLANGUAGE);
        },
        //On Failure set language to english
        function () {cLANGUAGE = "en";}
      );
    }else{
      cLANGUAGE = "es";
      languageControls(cLANGUAGE);
    }


    console.log("route change");
    if ($location.url() == "/cazast-login" || $location.url() == "/") {
      console.log("init login");
      initlogin();
    } else if ($location.url() == "/cazast-main") {
      console.log("init main");
      initmain();
    } else if ($location.url() == "/cazast-signup") {
      console.log("init signup");
      initsignup();
    } else if ($location.url() == "/televirt") {
      console.log("init televirt");
      inittelevirt();
    } else if ($location.url() == "/televirt2") {
      console.log("init televirt2");
      inittelevirt2();
    } else if ($location.url() == "/fields") {
      console.log("init fields");
      initfields();
    } else if ($location.url() == "/premios") {
      console.log("init premio");
      initpremios();
    } else if ($location.url() == "/cazast-forgot") {
      console.log("init forgot");
      initforgot();
    } else if ($location.url() == "/cazast-me") {
      console.log("about me");
      initme();
    } else if ($location.url() == "/cazast-vote") {
      console.log("init vote");
      initvote();
    } else if ($location.url() == "/review") {
      console.log("init review");
      initreview();
    }
  });
  $scope.$on('$stateChangeSuccess', function() {
    console.log("state change");
  });

  var time = 8;
  //  var $progressBar,$bar,$elem,isPause,tick,percentTime;
  var screen = $(window).height();
  //var screen = $window.innerHeight;
  //var screen = $.mobile.getScreenHeight();
  var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight();
  var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();

  /* content div has padding of 1em = 16px (32px top+bottom). This step
    can be skipped by subtracting 32px from content var directly. */
  var contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height();

  var content = screen - header - footer - contentCurrent;
  $("#animation").height(content - 15);
  $(".ui-content").height(content);
  if (window.ga)  window.ga.startTrackerWithId('UA-86527143-2');

});
