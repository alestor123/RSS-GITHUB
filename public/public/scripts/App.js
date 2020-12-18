var input = document.getElementById('Inp');
function rssGithub(){
    if(input==""){
        alert('Please Fill The Input')
    }
    else if(!(input.value.includes('github') && input.value.includes('http'))){
        alert('Invalid Url')
    }
    else{
    window.open(input.value.replace(/.+?\/github.com/, location.origin+'/issues'))
    }
}