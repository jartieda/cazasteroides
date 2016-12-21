var currendfield = "init"

var MAPFILE = "/var/opt/cazasteroides/server/mapfile.map"
var MAPSERVER = SERVER_URL_BASE + "/images/mapserv?map="+MAPFILE+"&mode=map";
var scalemin = 2000;
var scalemax = 2500;
var SCALE = "&MSCALE=2000,2500"//esto se refiere a la radiometria
var EXTENSION = "&mapsize=200%20200"//esto es el tamaño en pixeles de la imagen final
var imgxsize=1024;//FIXME1! esto hay que adaptarlo segun la imagen id
var imgysize=1024;//FIXME
var recortesizex=200;
var recortesizey=200;
var xorig = Math.random() * (imgxsize-recortesizex);
var yorig = Math.random() * (imgysize-recortesizey);
var randomext = "&MAPEXT=" + xorig + "%20" + yorig + "%20" + (xorig + recortesizex) + "%20" + (yorig + recortesizey);
var anim_interval;
var resolution = 0.3;
var ref_resolution = 0.5; //Aimed resolution 0.3 aperture will result on 1:1 pixel scale
var idx_img = 0;
//   Load the animation images
var JPEGN = [];

function change_img() {
    xorig = Math.random() * (imgxsize-recortesizex);
    yorig = Math.random() * (imgysize-recortesizey);
    var xmax = xorig + recortesizex;
    var ymax = yorig + recortesizey;
    console.log(recortesizex+" "+recortesizey);
    randomext = "&MAPEXT=" + xorig + "%20" + yorig + "%20" + xmax + "%20" + ymax;
    initialize_images();
  return {
        "xmin": xorig,
        "ymin": yorig,
        "xmax": xmax,
        "ymax": ymax,
        "scalemin": scalemin,
        "scalemax": scalemax
    };
}

function set_img_size(width, height) {
  console.log("Animation: set_img_size:"+ width + " " + height);
  recortesizey = height*ref_resolution/resolution;
  recortesizex = width*ref_resolution/resolution;
  EXTENSION = "&mapsize=" + width + "%20" + height
  initialize_images();

}

function set_img_scale(min, max) {
  console.log("Animation: set_img_scale:"+min+ " -- " +max);
  scalemin = min;
  scalemax = max;
  SCALE = "&MSCALE=" + min + "," + max;
  initialize_images();
}

function set_map_file(mapfile) {
  MAPFILE = mapfile;
  MAPSERVER = SERVER_URL_BASE + "/images/mapserv?map="+MAPFILE+"&mode=map";
  initialize_images();
}

function initialize_images() {
    JPEGN=[];
    for (var i = 1; i < 6; i++) {
      var idx_img = i;
      //if (idx_img > 1){
        if (typeof api != 'undefined')
        if (api && api.metadata[0]){
          //var origcoord = pix2coord(xorig,yorig, api.metadata[0])
          //var nuevo_orig = coord2pix(origcoord[0],origcoord[1],api.metadata[idx_img-1]);
          var nuevo_orig = [xorig,yorig]; //coord2pix(origcoord[0],origcoord[1],api.metadata[idx_img-1]);
          var xmax = nuevo_orig[0] + recortesizex;
          var ymax = nuevo_orig[1] + recortesizey;
          var newext = "&MAPEXT=" + nuevo_orig[0] + "%20" + nuevo_orig[1] + "%20" + xmax + "%20" + ymax;

          BIGEXTENSION = "&mapsize=" + (recortesizex*2) + "%20" + (recortesizey*2)

          JPEGN[i-1]= new Image();
          JPEGN[i-1].id = "animation";
          JPEGN[i-1].alt="Responsive";
          JPEGN[i-1].style= "width:unset;touch-action:none;pointer-events: none;";
          JPEGN[i - 1].src = MAPSERVER + SCALE + EXTENSION +    newext + "&layer=img" + idx_img;
          if (i == 1){
            var temp = new Image();
            temp.id = "animation2";
            temp.alt="Responsive";
            temp.style= "width:unset;visibility: hidden;position: absolute;bottom: 0px;left: 0px ;touch-action:none;pointer-events: none;";
            temp.className  ="zoom" ;
            temp.setAttribute("data-magnify-src", MAPSERVER +
                                       SCALE + BIGEXTENSION +
                                      newext + "&layer=img1&nocache="+Date.now());//) + idx_img);

            temp.src = MAPSERVER + SCALE + EXTENSION +    newext + "&layer=img" + idx_img+"&nocache="+Date.now();
            $("#animation2").replaceWith(temp);
            console.log("initialize_images: magnify ");
            console.log(".zoom lenght:"+$('.zoom').length)
            $('.zoom').magnify();
          }
        }
      //}
        //JPEGN[i - 1].src = MAPSERVER + SCALE + EXTENSION + randomext + "&layer=img" + i; //"http://138.100.101.64/data/"+visible_dir+visible_list[i];
    }
}

//initialize_images();

function anim_img(x) {
    if (idx_img == 6) {
        idx_img = 1;
    }
/*  var nuevo_orig=[xorig,yorig];

    if (idx_img > 1){
      if (typeof api != 'undefined')
      if (api && api.metadata[0]){
        var origcoord = pix2coord(xorig,yorig, api.metadata[0])
        var nuevo_orig = coord2pix(origcoord[0],origcoord[1],api.metadata[idx_img-1]);
      }
    }

    var xmax = nuevo_orig[0] + recortesizex;
    var ymax = nuevo_orig[1] + recortesizey;
    var newext = "&MAPEXT=" + nuevo_orig[0] + "%20" + nuevo_orig[1] + "%20" + xmax + "%20" + ymax;
    $("#animation").attr("src", MAPSERVER + SCALE + EXTENSION +
                            newext + "&layer=img" + idx_img);*/
    if (JPEGN[idx_img-1]){
      $("#animation").replaceWith(JPEGN[idx_img-1]);
    }

    //$('.zoom').magnify();
    //$("#animation").imageLens();
    idx_img++;
  //  clearInterval(anim_interval);
}
function hideinfo(){
  $("#infowindow").hide(1);
}
function estimateBright(Imax){
  var FWHM = api.metadata[0].FWHM;
  var SKY = api.metadata[0].SKY;
  var ZMAG = parseFloat(api.metadata[0].ZMAG);
  var EXPTIME = parseFloat(api.metadata[0].EXPTIME);
  var VEXT = parseFloat(api.metadata[0].VEXT);
  var AIRMASS = parseFloat(api.metadata[0].AIRMASS);

  var Ftot = 1.14 * FWHM * FWHM *(Imax - SKY)

  var magnitud = ZMAG - 2.5 * Math.log10 (Ftot / EXPTIME) - VEXT * AIRMASS

  if (Imax <= SKY) return 9999;
  else return magnitud;

}
function getPoints(time, bright){
  var p_tiempo = 30 - time ;
  if (p_tiempo < 10) p_tiempo = 10;
  var p_prob = parseFloat(api.metadata[0].PROBA)/10;
  var p_brillo = estimateBright(bright);
  var p_turb = 10 * parseFloat(api.metadata[0].FWHM);
  var p = 0.3 * p_tiempo + 0.3 * p_prob + 0.25 * p_brillo + 0.15 * p_turb;
  return p;
}
function showImgInfo(e){
  console.log(JSON.stringify(api.metadata[0]));
  var html = "<p> Image: "+currendfield+"</p>"
  html = html + "<p>Probability to find an asteroid:</p> "
  html = html + "<p>"+api.metadata[0].PROBA+"%</p> "
  html = html + "<p>Sky turbulence (seeing):</p> "
  html = html + "<p>"+(api.metadata[0].FWHM*resolution).toFixed(2); +"</p> "
  html = html + "<p>With this image you can get "+Math.floor(getPoints(5,api.metadata[0].SKY+2*api.metadata[0].SIGMA))+" points</p> "

  html = html + "<button class=\"ui-btn\" onclick=\"hideinfo()\">OK</button>"
  $('#infowindow').html(html);
  $("#infowindow").show(1);
  return false;
}

function updateGUIelements(nX,nY){
  // Place element where the finger is
  var draggable = $("#draggable");
  var header = 0;
  draggable.css("left", ""+ (nX - 25 ) + 'px');//+ oContainerOffset.left
  draggable.css("top" , ""+ (nY - header - 25) + 'px');
  //xorig e yorig se definen en animation.js se actualizan con cada random
  var nX_scale = nX * ref_resolution/resolution;
  var nY_scale = (nY - header) * ref_resolution/resolution;

  var pixx = nX_scale + xorig;
  var pixy = imgysize + nY_scale - yorig -recortesizey;//CHECK THIS!!!
  pixcoord = [nX_scale, nY_scale];
  pixcoordabs = [pixx, pixy];
  coord = pix2coord(pixx, pixy, api.metadata[0]);
  repix = coord2pix(coord[0], coord[1], api.metadata[0]);
  $("#coord_div").html(
    //"pix: "+pixx+" "+pixy +"<br>" +
    //"<br> relpix: "+ (touch.pageX)+ " " +(touch.pageY-header) +"<br>"+
    '<div style="font-size:12px"><a href="#" onClick="showImgInfo();return false;">' +currendfield +
    '<span id="info" class="fa fa-info-circle" style="color: rgba(0,0,0,1);"></span></a></div>'+
    "RA:" + deg2hour(coord[0]) + "<br>DEC:" + deg2degminsec(coord[1])//+
    //  "<br>repix:"+repix[0]+" "+repix[1]
  );

}

anim_interval = setInterval("anim_img(idx_img)", 500);
