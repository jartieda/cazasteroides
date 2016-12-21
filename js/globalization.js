var cLANGUAGE = null;
var languageSpecificObject = null;
var languageSpecificURL = "";
var spanishLanguageSpecificURL = "i18n/es/strings.json";
var englishLanguageSpecificURL = "i18n/en/strings.json";

//Function to make network call according to language on load
var languageControls = function(language){
    console.log("Language:"+language);
    if((language.toString() == "es") || (language.toString() == "español") || (language.toString().indexOf("es") != -1)){
            languageSpecificURL = spanishLanguageSpecificURL;
    }
    else{
            //Default English
            languageSpecificURL = englishLanguageSpecificURL;
    }
    console.log("language espcific file:" + languageSpecificURL);
        //Make an ajax call to strings.json files
    onNetworkCall(languageSpecificURL,function(msg){
        console.log(JSON.stringify(msg));
        if (typeof msg === 'string' || msg instanceof String){
          msg = JSON.parse(msg);
        }
        languageSpecificObject = msg; // JSON.parse(msg);
        $(".languagespecificHTML").each(function(){
            $(this).html(languageSpecificObject.languageSpecifications[0][$(this).attr("id")]);
        });
        $(".languageSpecificPlaceholder").each(function(){
            $(this).attr("placeholder",languageSpecificObject.languageSpecifications[0][$(this).attr("id")]);
        });
                $(".languageSpecificValue").each(function(){
            $(this).attr("value",languageSpecificObject.languageSpecifications[0][$(this).data("text")]);
        });
    });
};

//Function to get specific value with unique key
var getLanguageValue = function(key){
    value = languageSpecificObject.languageSpecifications[0][key];
    return value;
};

//Network Call
var onNetworkCall = function(urlToHit,successCallback){
    $.ajax({
       type: "GET",
       url: urlToHit,
       timeout: 30000 ,
       }).done(function( msg ) {
           successCallback(msg);
               }).fail(function(jqXHR, textStatus, errorThrown){
                   alert("No locale found");
               });
}
