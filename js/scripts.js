/*!
* AKANA.JS
*
* Main scripts file. Contains theme functionals.
*
* Version 1.0
*/

/*
-----------------------------------------------------------------------------------------------------------*/
//WARNING WARNING ESTE FICHERO NO TENGO CLARO CUANTO EFECTO TIENE
$(document).ready(function($) {

    "use strict";

    var aSearchClicked = false;

    jQuery(".sub-menu").hide();
    jQuery(".container").hide();

    if("ontouchstart" in document.documentElement) {


        $('#a-sidebar').bind('touchstart touchon', function(event){
            /*if(aSearchClicked){
                $('#searchform').removeClass('moved');
                aSearchClicked = false;
            }*/
        });
        $('#a-search').bind('touchstart touchon', function(event){
            $("#header-search-icon").attr("src","images/ajax-loader.gif")
            api.identify(deg2hour(coord[0]),deg2degminsec(coord[1]),function(data){
                $("#header-search-icon").attr("src","images/check.png");
                console.log("mpc result:"+JSON.stringify(data));
                if (data.res){
                    api.star(coord[0],coord[1],function(dat2){
                        $("#infowindow").html(dat2);
                        $("#infowindow").popup("open");

                    })
                    //$("#infowindow").html("<p> Ningun Objeto en este cuadrante.</p><p>Desea enviarlo al MPC?</p>");
                }else{
                    var cad ="Encontrado los siguientes objetos: <ul>";
                    for (var i = 0; i <data.length-1; i++){
                        cad =cad+"<li>"+data[i].designation+"</li>";
                    }
                    cad= cad+"</ul>";
                    $("#infowindow").html(cad);
                    $("#infowindow").popup("open");

                }

            });
        });
        /*
        $('#a-search').bind('touchstart touchon', function(event){
            if(aSearchClicked){
                $('#searchform').removeClass('moved');
                aSearchClicked = false;
            }else{
                $('#searchform').addClass('moved');
                aSearchClicked = true;
            }
        });
        */

    } else {

        jQuery('#a-sidebar').bind('click', function(event){
            /*if(aSearchClicked){
                jQuery('#searchform').removeClass('moved');
                aSearchClicked = false;
            }*/
        });
        jQuery('#a-search').bind('click', function(event){
            $("#header-search-icon").attr("src","images/ajax-loader.gif")
            api.identify(deg2hour(coord[0]),deg2degminsec(coord[1]),function(data){
                $("#header-search-icon").attr("src","images/check.png");
                $("#infowindow").html(JSON.stringify(data));
                $("#infowindow").popup("open");

            });

        })
        /*jQuery('#a-search').bind('click', function(event){
            if(aSearchClicked){
                jQuery('#searchform').removeClass('moved');
                aSearchClicked = false;
            }else{
                jQuery('#searchform').addClass('moved');
                aSearchClicked = true;
            }
        });*/
    }

    /* Toggle for menu subcategories
    	*
    *
    * @since 3.1
    *
    */

    jQuery(".menu-item-has-children").click(function(event){
    	event.preventDefault();
    	jQuery(this).children(".sub-menu").toggleClass("active").toggle(350);
    	return false;
    }).children(".sub-menu").children("li").click(function(event){

        window.location.href = jQuery(this).children("a").attr("href");
    });

    // Disable swipe on slider for class .disableswipe
    jQuery( document ).on( "swipeleft swiperight", '.disableswipe', function ( e ) {
        e.stopPropagation();
        e.preventDefault();
    });

	// Sidebar swipe opening/closing
	jQuery( document ).on( "swipeleft swiperight", function( e ) {
/*
		if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) { // if panel isn't already open
		  	if ( e.type === "swipeleft"  ) { // if the swipe is from right to left
		  		jQuery( "#sidebar-right" ).panel( "open" ); // open right sidebar
		  		if(aSearchClicked){
                  jQuery('#searchform').removeClass('moved');
                  aSearchClicked = false;
              }
		    } else if ( e.type === "swiperight" ) { // if the swipe is from left to right
		    	jQuery( "#sidebar" ).panel( "open" ); // open (left) sidebar with ID #sidebar
		    	if(aSearchClicked){
                   jQuery('#searchform').removeClass('moved');
                   aSearchClicked = false;
               }
           }

       }
       */
   });
});
