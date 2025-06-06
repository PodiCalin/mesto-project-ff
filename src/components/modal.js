//Функция открытия попапа
export function openModal(popup){
    popup.classList.add('popup_is-opened')
    document.addEventListener('keydown', closeEsc)
    popup.addEventListener('click' , closeClickModal)   
}
//Функция закрытия кликом на оверлей
function closeClickModal(evt){
    if(evt.target === evt.currentTarget){
        document.querySelectorAll('.popup_is-opened').forEach(function(el){
            closeModal(evt.currentTarget)})
    }
}


//Функция закрытия по ESC
function closeEsc(evt){
    if(evt.key === 'Escape'){
        document.querySelectorAll('.popup_is-opened').forEach(function(el){
        closeModal(el)})
    }
}
//Функция закрытия
export function closeModal(popup){
 popup.classList.remove('popup_is-opened')
 document.removeEventListener('keydown' , closeEsc)
 popup.removeEventListener('click' , closeClickModal)
}
