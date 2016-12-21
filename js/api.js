//api.js

var Api = function() {
    this.server = SERVER_URL_BASE;
    this.metadata =[,,,,,]
};

Api.prototype.getQueryPic = function(n) {

}
Api.prototype.star = function(RA, DEC, cb) {
    var identData = {
        "RA": RA,
        "DEC": DEC
    };
    $.ajax({
        url: this.server + '/images/star',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        //dataType: 'json',
        data: JSON.stringify(identData),
        success: function(data) {
            cb(data);
            //$.mobile.navigate("#mainpage");
        },
        error: function(jqXHR) {
            if (jqXHR.status == 401) {
                console.log('Invalid user or password');
                cb('Invalid User or password');
            } else {
                console.log('Error connecting to server');
                cb('Error connecting to server');
            }
        },
        failure: function(errMsg) {
            console.log(errMsg);
            cb(errMsg);
        }
    }); //fin ajax
}

Api.prototype.identify = function(RA, DEC, f, cb) {
    var fecha = new Date(f);
    var year = fecha.getFullYear();
    var month = fecha.getMonth()+1;
    var day = fecha.getDate()+fecha.getHours()/24.0+fecha.getMinutes()/(24*60.0)+fecha.getSeconds()/(24*60.0*60.0);
    day = Number(day.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0])
    var identData = {
        "RA": RA,
        "DEC": DEC,
        "year": year,
        "month": month,
        "day": day
    };
    $.ajax({
        url: this.server + '/images/mpc',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(identData),
        success: function(data) {
            cb(data);
            //$.mobile.navigate("#mainpage");
        },
        error: function(jqXHR) {
            if (jqXHR.status == 401) {
                console.log('Invalid user or password');
                cb('Invalid User or password');
            } else {
                console.log('Error connecting to server');
                cb('Error connecting to server');
            }
        },
        failure: function(errMsg) {
            console.log(errMsg);
            cb(errMsg);
        }
    }); //fin ajax
}
Api.prototype.getHistogram = function(id_image) {

    $.ajax({
        url: this.server + '/images/'+id_image+'/histogram',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
            //SERVER_TOKEN=data.token;
            //data.min = data.min + 32768;
            //data.max = data.max + 32768;
            m_hexcel = new Histogram();
            m_hexcel.setData(data);
            m_hexcel.draw();
            //$.mobile.navigate("#mainpage");
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
    }); //fin ajax
}
Api.prototype.selectImage = function(id_image, cb){
  $.ajax({
      url: this.server + '/images/'+id_image+'/select',
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(data) {
        cb(data);
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
  }); //fin ajax
}
Api.prototype.deselectImage = function(id_image, cb){
  $.ajax({
      url: this.server + '/images/'+id_image+'/deselect',
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(data) {
        cb(data);
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
  }); //fin ajax
}

Api.prototype.getAllImageData = function(cb) {

    $.ajax({
        url: this.server + '/images/',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
          cb(data);
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
    }); //fin ajax
}

Api.prototype.getLastImageData = function(cb) {

    $.ajax({
        url: this.server + '/images/active',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
          var img = data[Math.floor(Math.random()*data.length)];
          cb(img);
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
    }); //fin ajax
}

Api.prototype.getImageData = function(id_image,cb) {

    $.ajax({
        url: this.server + '/images/'+id_image,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
          cb(data);
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
    }); //fin ajax
}
Api.prototype.delImage = function(id_image, cb) {
    var image = {
        "_id": id_image
    }
    $.ajax({
        url: this.server + '/images/delete',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({"image":image}),
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "BEARER " + SERVER_TOKEN);
        },
        success: function(data) {
            cb();
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
    }); //fin ajax
}

Api.prototype.addBadge = function(badgeName, cb) {
    var badge = {
        "name": badgeName
    }
    $.ajax({
        url: this.server + '/users/addBadge',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({"badge":badge}),
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "BEARER " + SERVER_TOKEN);
        },
        success: function(data) {
            cb();
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
    }); //fin ajax
}

Api.prototype.getMe = function(fb) {
    $.ajax({
        url: this.server + '/users/me'+ "?access_token=" + SERVER_TOKEN,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
						fb(data);
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
    }); //fin ajax
}
Api.prototype.getUsers = function(fb) {
    $.ajax({
        url: this.server + '/users',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
						fb(data);
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
    }); //fin ajax
}

Api.prototype.setMeatdata = function(data,i) {
  console.log("obj" + obj)
  console.log(data);
  if (!data.A_0_0) data.A_0_0 = "0";
  if (!data.A_1_0) data.A_1_0 = "0";
  if (!data.A_0_1) data.A_0_1 = "0";
  if (!data.A_1_1) data.A_1_1 = "0";
  if (!data.A_2_0) data.A_2_0 = "0";
  if (!data.A_0_2) data.A_0_2 = "0";

  if (!data.B_0_0) data.B_0_0 = "0";
  if (!data.B_1_0) data.B_1_0 = "0";
  if (!data.B_0_1) data.B_0_1 = "0";
  if (!data.B_1_1) data.B_1_1 = "0";
  if (!data.B_2_0) data.B_2_0 = "0";
  if (!data.B_0_2) data.B_0_2 = "0";

  if (!data.AP_0_0) data.AP_0_0 = "0";
  if (!data.AP_1_0) data.AP_1_0 = "0";
  if (!data.AP_0_1) data.AP_0_1 = "0";
  if (!data.AP_1_1) data.AP_1_1 = "0";
  if (!data.AP_2_0) data.AP_2_0 = "0";
  if (!data.AP_0_2) data.AP_0_2 = "0";

  if (!data.BP_0_0) data.BP_0_0 = "0";
  if (!data.BP_1_0) data.BP_1_0 = "0";
  if (!data.BP_0_1) data.BP_0_1 = "0";
  if (!data.BP_1_1) data.BP_1_1 = "0";
  if (!data.BP_2_0) data.BP_2_0 = "0";
  if (!data.BP_0_2) data.BP_0_2 = "0";
  console.log("SCALE:"+data.SCALE);
  if (!data.SCALE){
    data.SCALE = 0.3;
  }else{
    data.SCALE = parseFloat(data.SCALE);
  }

  if (!data.SKY){
    data.SKY = 2200;
  }else{
    var bzero = 0;
    if (data.BZERO){
      bzero = parseFloat(data.BZERO);
    }
    data.SKY = parseFloat(data.SKY)-bzero;//FIXME ESTO ES PARA PASAR DE UNSIGNED A SIGNED PERO PUEDE DAR PROBLEMAS
  }

  if (!data.SIGMA){
    data.SIGMA = 100;
  }else{
    data.SIGMA = parseFloat(data.SIGMA);
  }


  this.metadata[i] = data;
  //variables defined on animation
  imgxsize=parseFloat(data.IMAGEH);
  imgysize=parseFloat(data.IMAGEW);
  resolution=data.SCALE;

  api.metadata[0].FWHM = parseFloat(api.metadata[0].FWHM);

}
Api.prototype.getMetadata = function(id_image,id_frame,cb) {
    obj = this;
    $.ajax({
        url: this.server + '/images/'+id_image+'/'+id_frame+'/coeff',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
            obj.setMeatdata(data,id_frame)
            cb();
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
    }); //fin ajax
}
Api.prototype.newRect = function (rect,id_image,cb){

  var rect = {
    "image":id_image,
    "minx": rect.xmin,
    "miny": rect.ymin,
    "maxx": rect.xmax,
    "maxy": rect.ymax,
    "scalemin": rect.scalemin,
    "scalemax": rect.scalemax
  }
  console.log(JSON.stringify(rect));
  $.ajax({
      url: this.server + '/rectangles',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(rect),
      beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", "BEARER " + SERVER_TOKEN);
      },
      success: function(data) {
          cb(data);
      },
      error: function(jqXHR) {
          if (jqXHR.status == 401) {
              console.log('Invalid user or password');
              alert('Invalid User or password');
          } else {
              console.log('Error connecting to server'+JSON.stringify(jqXHR));
              alert('Error connecting to server');
          }
      },
      failure: function(errMsg) {
          console.log(errMsg);
          alert(errMsg);
      }
  }); //fin ajax
}
Api.prototype.newObservation = function(id_image, id_rect,
    pixcoord, pixcoordabs, coords, clock, cb) {
    var obs = {
        "image": id_image,
        "rect": id_rect,
        "pixCoord": pixcoord,
        "pixCoordAbs": pixcoordabs,
        "Coord": coords,
        "clock": clock,
        "status": "pending"
    }
    console.log(JSON.stringify(obs));
    $.ajax({
        url: this.server + '/obs',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(obs),
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "BEARER " + SERVER_TOKEN);
        },
        success: function(data) {
            if (data.message == "existing"){
              console.log ("observation already on the list")
              cb(data);
            }else{
              console.log ("observation not on the list")
              cb(data);
            }
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
    }); //fin ajax
}
Api.prototype.voteObservation = function(id_obs, cb) {
    var obs = {
        "_id": id_obs
    }
    $.ajax({
        url: this.server + '/obs/vote',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(obs),
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "BEARER " + SERVER_TOKEN);
        },
        success: function(data) {
            cb();
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
    }); //fin ajax
}
Api.prototype.downvoteObservation = function(id_obs, cb) {
    var obs = {
        "_id": id_obs
    }
    $.ajax({
        url: this.server + '/obs/downvote',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(obs),
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "BEARER " + SERVER_TOKEN);
        },
        success: function(data) {
            cb();
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
    }); //fin ajax
}

Api.prototype.getObservation = function(cb) {
    $.ajax({
        url: this.server + '/obs/',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            cb(data);
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
    }); //fin ajax
}
Api.prototype.imagesFindMore = function(method,
    ra_h, ra_m, ra_s, dec_g, dec_m, dec_s, radio, cb) {
    //method : findimages or findasteroids
    var coord = {
        "method": method,
        "ra_h": ra_h,
        "ra_m": ra_m,
        "ra_s": ra_s,
        "dec_g": dec_g,
        "dec_m": dec_m,
        "dec_s": dec_s,
        "radio":radio
    }
    $.ajax({
        url: this.server + '/images/findmore/',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(coord),
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "BEARER " + SERVER_TOKEN);
        },
        success: function(data) {
            cb(data);
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
    }); //fin ajax
}

Api.prototype.imagesFindMoreDate = function(dateObs,
      telescop, object, cb) {

        //      {dateObs} una fecha en formato yyyy-mm-dd
        //  {telescop} el nombre de un telescopio existente en el Telescopio Virtual o “all” para no filtrar por telescopio
        //  {object} el nombre o fragmento del nombre del objeto a buscar o “all” para no filtrar por objetos
    //telescop y object pueden ser all
    //http://www.telescopiovirtual.com:80/services/remote/{apikey}/findimages/headers/{dateObs}/{telescop}/{object}

    var coord = {
        "dateObs": dateObs,
        "telescop": telescop,
        "object": object
    }
    $.ajax({
        url: this.server + '/images/findmoredate/',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(coord),
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "BEARER " + SERVER_TOKEN);
        },
        success: function(data) {
            cb(data);
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
    }); //fin ajax
}

Api.prototype.imagesUpdate = function(data, campo, cb) {
    //  {dateObs} una fecha en formato yyyy-mm-dd
    //  {telescop} el nombre de un telescopio existente en el Telescopio Virtual o “all” para no filtrar por telescopio
    //  {object} el nombre o fragmento del nombre del objeto a buscar o “all” para no filtrar por objetos
    //telescop y object pueden ser all
    //http://www.telescopiovirtual.com:80/services/remote/{apikey}/findimages/headers/{dateObs}/{telescop}/{object}

    var payload = {
      "imgs": data,
      "fieldname": campo
    }
    $.ajax({
        url: this.server + '/images/updateim/',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(payload),
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "BEARER " + SERVER_TOKEN);
        },
        success: function(data) {
            cb(data);
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
    }); //fin ajax
}

Api.prototype.get_obs_gif = function (id_obs, cb){

    var payload = {
      "id_obs": id_obs
    }
    $.ajax({
        url: this.server + '/obs/get_obs_gif/',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(payload),
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "BEARER " + SERVER_TOKEN);
        },
        success: function(data) {
            cb(data);
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
    }); //fin ajax
}
