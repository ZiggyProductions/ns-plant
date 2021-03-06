/*
 *
 * login-register modal
 * Autor: Creative Tim
 * Web-autor: creative.tim
 * Web script: http://creative-tim.com
 * 
 */
function showRegisterForm(){
    $('.loginBox').fadeOut('fast',function(){
        $('.registerBox').fadeIn('fast');
        $('.login-footer').fadeOut('fast',function(){
            $('.register-footer').fadeIn('fast');
        });
        $('.modal-title').html('Register with');
    }); 
    $('.error').removeClass('alert alert-danger').html('');
       
}
function showLoginForm(){
    $('#loginModal .registerBox').fadeOut('fast',function(){
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast',function(){
            $('.login-footer').fadeIn('fast');    
        });
        
        $('.modal-title').html('Login with');
    });       
     $('.error').removeClass('alert alert-danger').html(''); 
}

function openLoginModal(){
    showLoginForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);
    
}
function openRegisterModal(){
    showRegisterForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);
    
}

function loginAjax(){
    $.post( "/auth/login", $('#login-form').serialize(), function( data ) {
        console.log(data);
        if(data == 1){
            window.location.replace("/game");
        } else {
             shakeModal();
        }
    });

/*   Simulate error message from the server   */
     shakeModal();
}
function registerAjax(){
    $.post( "/auth/register", $('#register-form').serialize(), function( data ) {
        console.log(data);
        if(data == 1){
            window.location.replace("/game");
        } else {
             shakeModal();
        }
    });

/*   Simulate error message from the server   */
     shakeModal();
}

function shakeModal(){
    //$('#loginModal .modal-dialog').addClass('shake');
    $('.error').addClass('alert alert-danger').html("Invalid email/password combination");
    $('input[type="password"]').val('');
    setTimeout( function(){
         $('.error').removeClass('alert alert-danger').html('');
    }, 2000 );
}

   