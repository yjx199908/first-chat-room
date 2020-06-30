$(function(){
    DealInput.dealStart()
    ControlOther.startControl()
})

class Tools{
    constructor(){

    }

    static promp(target,text){
        $('#'+ target + '-promp').text(text)
        $('#' + target + '-promp-container').slideDown(200)
        $('#' + target + '-input').removeClass('border-color-forth')
        $('#' + target + '-input').addClass('border-color-third')
    }

    static cancelPromp(target){
        $('#' + target + '-promp').text('')
        $('#' + target + '-promp-container').slideUp(200)
        $('#' + target + '-input').removeClass('border-color-third')
    }

    static verifySuccess(target){
        $('#' + target + '-input').addClass('border-color-forth')
    }

    static verifyLength(target,min,max){
        let length = $('#' + target + '-input').val().length
        return (length >= min && length <= max)
    }

    static verifyPhone(phone){
        return /^1[3456789]\d{9}$/.test(phone)
    }

    static toggleRegular(){
        $('.password-regular').slideToggle(300)
    }

    static verifyPassword(password){
        if(password.length < 8 && (!/\d{1,}/.test(password) || !/[a-zA-Z]/.test(password))){
            return 0
        }
        else if(password.length < 8){
            return 1
        }
        else if(!/\d{1,}/.test(password) || !/[a-zA-Z]/.test(password)){
            return 2
        }
        else{
            return 3
        }
    }

    static toggleRegularIcon(ancestorId,flag){
        if(flag){
            $('#' + ancestorId + ' img[sign-text=pass]').fadeIn(0)
            $('#' + ancestorId + ' img[sign-text=nopass]').fadeOut(0)
        }
        else{
            $('#' + ancestorId + ' img[sign-text=nopass]').fadeIn(0)
            $('#' + ancestorId + ' img[sign-text=pass]').fadeOut(0)
        }
    }
}

class DealInput{
    constructor(){

    }

    static dealStart(){
        DealInput.dealUsername()
        DealInput.dealPassword()
        DealInput.dealPhone()
    }

    static userPass = false
    static passPass = false
    static phonePass = false

    static canSignUp(){
        return DealInput.userPass && DealInput.passPass && DealInput.phonePass
    }

    static dealUsername(){
        $('#username-input').on('blur',()=>{
            if($('#username-input').val() == ''){
                Tools.promp('username','昵称不可以为空')
                DealInput.userPass = false
            }
            else if(!Tools.verifyLength('username',2,10)){
                Tools.promp('username','昵称长度应当在2~10个字符')
                DealInput.userPass = false
            }
            else{
                Tools.verifySuccess('username')
                DealInput.userPass = true
            }
        }).on('focus',()=>{
            Tools.cancelPromp('username')
        })
    }

    static dealPassword(){
        //防抖处理计时器
        let timer
        $('#password-input').on('blur',()=>{
            Tools.toggleRegular()
            if($('#password-input').val() == ''){
                Tools.promp('password','密码不可以为空')
                DealInput.passPass = false
            }
            else if(Tools.verifyPassword($('#password-input').val()) != 3){
                Tools.promp('password','不符合密码要求')
                DealInput.passPass = false
            }
            else{
                Tools.verifySuccess('password')
                DealInput.passPass = true
            }
        }).on('focus',()=>{
            Tools.cancelPromp('password')
            Tools.toggleRegular()
        }).on('input',()=>{
            if(timer){
                clearTimeout(timer)
            }
            timer = setTimeout(()=>{
                let verifyResult = Tools.verifyPassword($('#password-input').val())
                switch(verifyResult){
                    case 0:
                        Tools.toggleRegularIcon('regular-item-first',false)
                        Tools.toggleRegularIcon('regular-item-second',false)
                        break
                    case 1:
                        Tools.toggleRegularIcon('regular-item-first',false)
                        Tools.toggleRegularIcon('regular-item-second',true)
                        break
                    case 2:
                        Tools.toggleRegularIcon('regular-item-first',true)
                        Tools.toggleRegularIcon('regular-item-second',false)
                        break
                    case 3:
                        Tools.toggleRegularIcon('regular-item-first',true)
                        Tools.toggleRegularIcon('regular-item-second',true)
                        break
                }
            },1000)
        })
    }

    static dealPhone(){
        $('#phone-input').on('blur',()=>{
            if($('#phone-input').val() == ''){
                Tools.promp('phone','联系方式不可以为空')
                DealInput.phonePass = false
            }
            else if(!Tools.verifyPhone($('#phone-input').val())){
                Tools.promp('phone','请输入正确格式的手机号码')
                DealInput.phonePass = false
            }
            else{
                Tools.verifySuccess('phone')
                DealInput.phonePass = true
            }
        }).on('focus',()=>{
            Tools.cancelPromp('phone')
        })
    }
}

class ControlOther{
    constructor(){

    }

    static themeIsOrigin = true
    static submitControlFluxTimer
    static waitingTimer

    static startControl(){
        ControlOther.leftImgLoop()
        ControlOther.loginRequest()
        ControlOther.toggleTheme()
        ControlOther.toFallback()
    }

    static leftImgLoop(){
        let serial = 1
        setInterval(() => {
            $('.body-left img').fadeOut(300,()=>{
                $('.body-left img').attr('src','./assets/img/body-left/bg' + serial + '.jpg')
            }).fadeIn(300)
            
            serial == 4?serial = 1:serial++
        }, 3000);
    }

    static loginRequest(){
        $('#submit-button').on('click',()=>{
            
            if(!DealInput.canSignUp()){
                return
            }
            if(ControlOther.submitControlFluxTimer){
                clearTimeout(ControlOther.submitControlFluxTimer)
            }

            $('.signup-body-body').slideUp(300)
            $('.waiting-block').slideDown(300)
            ControlOther.waitingTimer = setInterval(() => {
                $('.waiting-text-container span').text($('.waiting-text-container span').text() + '.')
            }, 500);
            new Promise((resolve,rejected)=>{
                ControlOther.submitControlFluxTimer = setTimeout(()=>{
                    resolve()
                },1000)
            }).then(result=>{ 
                $.post({
                    url: "http://localhost:9081/submit/signup",
                    data: {
                        nickname:$('#username-input').val(),
                        password:$('#password-input').val(),
                        phone:$('#phone-input').val()
                    },
                    dataType: "json",
                    success:function (response) {
                        $('.waiting-block').slideUp(300)
                        clearInterval(ControlOther.waitingTimer)
                        if(response.success){
                            $('#account-result').text(response.account)
                            $('.result-block').slideDown(300)                          
                        }
                        else{
                            $('#fail-msg').text(response.msg)
                            $('.fail-block').slideDown(300)     
                        }
                    }
                });
            })
           
        })
        
    }

    static toggleTheme(){
        $('#theme-toggle').click(()=>{
            if(ControlOther.themeIsOrigin){
                $('.page-body').css({
                    backgroundColor:'white'
                })
                $('.color-first').css({
                    color:'black'
                })
                $('.color-third').css({
                    color:'rgb(120,120,120)'
                })
                $('.border-color-first').css({
                    borderColor:'rgba(200,200,200)'
                })
                $('.submit-button').css({
                    backgroundColor:'rgb(55,137,255)'
                })
                ControlOther.themeIsOrigin = false
            }
            else{
                $('.page-body').css({
                    backgroundColor:'black'
                })
                $('.color-first').css({
                    color:'white'
                })
                $('.color-third').css({
                    color:'white'
                })
                $('.border-color-first').css({
                    borderColor:'white'
                })
                $('.submit-button').css({
                    backgroundColor:'blueviolet'
                })
                ControlOther.themeIsOrigin = true
            }
        })
    }

    static toFallback(){
        $('#to-fallback').click(function(){
            window.open('../fallback/index.html')
        })
    } 
}

