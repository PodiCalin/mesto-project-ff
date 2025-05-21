import { popups } from "../index.js"
//Функция открытия попапа
export function openModal(popup){
    popup.classList.add('popup_is-opened')
    document.addEventListener('keydown', closeEsc)
    //Фунция закрытия кликом на оверлей
    popup.addEventListener('click' , function(evt){
        if(evt.target === evt.currentTarget){
            closeModal(popup)
        }
    })   
}
//Функция закрытия по ESC
function closeEsc(evt){
    if(evt.key === 'Escape'){
        popups.forEach(function(popup){
        closeModal(popup)})
    }
}
//Функция закрытия
export function closeModal(popup){
 popup.classList.remove('popup_is-opened')
 popup.removeEventListener('keydown' , closeEsc)
}
