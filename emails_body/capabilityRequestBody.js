module.exports= function(userName){
    let currenetDate=new Date();
    return(
        '<div style="background-color: rgba(102, 129, 170, 0.1); width:100%; height:auto; padding-top:50px">'+
        '<div style="background-color: white; width:70%; height:auto; margin-left: auto; margin-right: auto; border: #0064fe 3px dotted">'+
        '<h3 style="font-weight: bold;color: #002d72;padding-left:15px">'+
        userName+' sent a request to be added in a capability!'+
        '</h3>'+
        '<p style="line-height: 1.125rem; padding:0px 10px; margin-top:10px ;float:right; color: #002d72; font-weight:bold">'+
        currenetDate.toDateString()+
        '<br />  ' +
        '</div>'+
        '<p style="padding:45px 10px; text-align: center;">For more details chack <a href="google.com">the website</a><p/>'+
        '</div>'
       
    ) ;
}



