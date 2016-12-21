//mpc.js


neo_check= function(	){
	var form ={ "year":2014,
		"month":12,
		"day":19,
		"which":"pos",
		"ra":"05 03 22.6",
		"decl":"+00 20 16.64",
		"TextArea":"",
		"radius":15,
		"limit":30,
		"oc":500,
		"sort":"d",
		"mot":"h",
		"tmot":"s",
		"pdes":"p",
		"needed":"f",
		"ps":"n",
		"type":"p"
	}
	var jqxhr = $.post( "http://www.minorplanetcenter.net/cgi-bin/neocheck.cgi", function(data) {
		alert( "data" );
	})
	.done(function() {
	    //alert( "second success" );
	})
	.fail(function() {
		alert( "error" );
	})
	.always(function() {
		alert( "finished" );
	});
}
