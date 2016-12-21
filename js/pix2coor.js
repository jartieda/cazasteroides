//from pixel to coordinate

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

deg2degminsec=function (degin){
      var deg = Math.trunc(degin);
      var m = Math.abs( Math.trunc((degin-deg)*60));
      var s = ((Math.abs(degin-deg)*60) - m )*60;
      var z = "";
      if (s < 10) z = "0";
	return ""+pad(deg,2)+" "+pad(m,2)+" "+z+s.toFixed(2);//fixme cuidado con el +
}
deg2hour=function (deg){
	var hour = Math.trunc(deg*24.0/360.0);
	var mdec = Math.abs((deg*24.0/360.0)-hour)*60.0;

	var m = Math.trunc(mdec);
	var s = (mdec - m )*60;
  var z = "";
  if (s < 10) z = "0";
	return ""+pad(hour,2)+" "+pad(m,2)+" "+z+s.toFixed(2);
}
deg2degminsecPretty=function (min){
	var hour = Math.trunc(min/60);
	var m = Math.trunc(min-(hour*60));
	var s = (min-(hour*60) - m )*60;
	return ""+hour+"º "+m+"m "+s.toFixed(2);
}
deg2hourPretty=function (deg){
	var hour = Math.trunc(deg*24.0/360.0);
	var mdec = ((deg*24.0/360.0)-hour)*60.0;

	var m = Math.trunc(mdec);
	var s = (mdec - m )*60;
	return ""+hour+"h "+m+"m "+s.toFixed(2);
}

coord2pix = function (ra, dec, metadata){

  /*
	 |x|  | CD1_1 CD1_2 |   | f(u,v)+u |
	 | |= |             | * |          |
	 |y|  | CD2_1 CD2_2 |   | g(u,v)+v |
	*/
/* FIXME INVERTING FUNCTIONS DO NOT USE*/
  var CD1_1 = parseFloat(metadata.CD1_1);
  var CD1_2 = parseFloat(metadata.CD1_2);
  var CD2_1 = parseFloat(metadata.CD2_1);
  var CD2_2 = parseFloat(metadata.CD2_2);
  var invdet = 1/(CD1_1*CD2_2-CD1_2*CD2_1);
  ra = ra -  parseFloat(metadata.CRVAL1);
  dec = dec -  parseFloat(metadata.CRVAL2);
  var U =  CD2_2*ra - CD1_2*dec;
  var V =  - CD2_1*ra+ CD1_1*dec;

  U = U*invdet;
  V = V*invdet;

  var u = U + f_invfunc(U,V,metadata)+parseFloat(metadata.CRPIX1);
  var v = V + g_invfunc(U,V,metadata)+parseFloat(metadata.CRPIX2);
  return [u, v];

}
pix2coord = function (x_pix, y_pix, metadata){
	/*
	 |x|  | CD1_1 CD1_2 |   | f(u,v)+u |
	 | |= |             | * |          |
	 |y|  | CD2_1 CD2_2 |   | g(u,v)+v |
	*/

	u = x_pix - parseFloat(metadata.CRPIX1);
	v = y_pix -  parseFloat(metadata.CRPIX2);

	var t1 = f_func(u,v,metadata)+u;
	var t2 = g_func(u,v,metadata)+v;
    var x =  parseFloat(metadata.CD1_1)*t1+ parseFloat(metadata.CD1_2)*t2;
    var y =  parseFloat(metadata.CD2_1)*t1+ parseFloat(metadata.CD2_2)*t2;
    x = x +  parseFloat(metadata.CRVAL1);
    y = y +  parseFloat(metadata.CRVAL2);
    return [x, y];
}
f_func = function (u , v,metadata){
	var res =  parseFloat(metadata.A_0_0) +
	           parseFloat(metadata.A_1_0) * u +
	           parseFloat(metadata.A_0_1) * v +
			   parseFloat(metadata.A_2_0) *u*u +
			   parseFloat(metadata.A_0_2)*v*v +
			   parseFloat(metadata.A_1_1)*u*v
			  // A_2_1*u*u*v + A_1_2*u*v*v + A_3_0*u*u*u+ A_0_3*v*v*v
	return res;
}
g_func = function (u , v,metadata){
	var res =  parseFloat(metadata.B_0_0) +
	           parseFloat(metadata.B_1_0) * u +
	           parseFloat(metadata.B_0_1) * v +
			   parseFloat(metadata.B_2_0) *u*u +
			   parseFloat(metadata.B_0_2)*v*v +
			   parseFloat(metadata.B_1_1)*u*v
	return res;

}
f_invfunc = function (u , v,metadata){
	var res =  parseFloat(metadata.AP_0_0) +
	           parseFloat(metadata.AP_1_0) * u +
	           parseFloat(metadata.AP_0_1) * v +
			   parseFloat(metadata.AP_2_0) *u*u +
			   parseFloat(metadata.AP_0_2)*v*v +
			   parseFloat(metadata.AP_1_1)*u*v
			  // A_2_1*u*u*v + A_1_2*u*v*v + A_3_0*u*u*u+ A_0_3*v*v*v
	return res;
}
g_invfunc = function (u , v,metadata){
	var res =  parseFloat(metadata.BP_0_0) +
	           parseFloat(metadata.BP_1_0) * u +
	           parseFloat(metadata.BP_0_1) * v +
			   parseFloat(metadata.BP_2_0) *u*u +
			   parseFloat(metadata.BP_0_2)*v*v +
			   parseFloat(metadata.BP_1_1)*u*v
	return res;

}
