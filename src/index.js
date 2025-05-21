'use strict'
//Импорты
import "./pages/index.css"
import { initialCards } from "./scripts/cards.js"
import { openModal , closeModal } from "./components/modal.js"
import { createCard , ClicklikeButton ,  deleteCard } from "./components/card.js"
//Список карточек
const unorderList = document.querySelector('.places__list')
//Попапы
export const popup = document.querySelector('.popup')
export const popups = document.querySelectorAll('.popup')
const editPopup = document.querySelector('.popup_type_edit')
const addPopup = document.querySelector('.popup_type_new-card')
const popupCardImage = document.querySelector('.popup_type_image')
const imagePopup = popupCardImage.querySelector('.popup__image')
const titlePopup = popupCardImage.querySelector('.popup__caption')
//Кнопки
const editButton = document.querySelector('.profile__edit-button')
const addButton = document.querySelector('.profile__add-button')
const closePopupButtonSave = popup.querySelector('.popup__button')
const closePopupCross = popup.querySelectorAll('.popup__close')
const name = document.querySelector('.profile__title')
const job = document.querySelector('.profile__description')
//Форма редактирования
const editProfileForm = document.forms["edit-profile"]
//Форма добавления
const newPlaceForm = document.forms["new-place"]
//Инпуты
const nameInput = document.querySelector('.popup__input_type_name')
const jobInput = document.querySelector('.popup__input_type_description')
const placeInputForm = document.querySelector('.popup__input_type_card-name')
const urlInputForm = document.querySelector('.popup__input_type_url')
//Вызовы функций
editButton.addEventListener('click' , function(evt){openModal(editPopup)})
addButton.addEventListener('click' , function(evt){openModal(addPopup)})
//Перебор крестиков
// popups.forEach(function(popup){
//     closePopupCross.addEventListener('click' , function(evt){closeModal(popup)})
//     closePopupButtonSave.addEventListener('click' , function(evt){closeModal(popup)})
// })
closePopupCross.forEach(function(element){
    element.addEventListener('click', function(evt){
        closeModal(popup)
    })
})
//Функция обработки клика по фото
function handleClickCard(cardImageData , cardDescriptions , cardTitle){
    titlePopup.textContent = cardTitle.textContent
     
    Object.assign(imagePopup , {
     src: cardImageData,
     alt: cardDescriptions
    })

    openModal(popupCardImage)
 }
 //Функция добавления карточек
 const addCard = function() {
    initialCards.forEach(function(element) {
        const setCard = createCard(element , deleteCard , handleClickCard , ClicklikeButton)
        return unorderList.append(setCard)
    })
}
addCard()
//Функция Формы
function handleFormSubmit(evt) {
    evt.preventDefault()

    const nameValue = nameInput.value 
    const jobValue = jobInput.value
 
    name.textContent = nameValue
    job.textContent = jobValue

    editProfileForm.reset()
}
editProfileForm.addEventListener('submit', handleFormSubmit)
//Функция Формы
function handleAddCardForm(evt) {
    evt.preventDefault()
    const placeInput = placeInputForm.value 
    const urlInput = urlInputForm.value
   
    const cardImage = {
        name: placeInput,
        link: urlInput
    }

    const setCard = createCard(cardImage , deleteCard , handleClickCard , ClicklikeButton)
    unorderList.prepend(setCard)

    newPlaceForm.reset()
}

newPlaceForm.addEventListener('submit', handleAddCardForm)

