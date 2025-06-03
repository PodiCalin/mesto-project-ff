'use strict'
//Импорты
import "./pages/index.css"
import { initialCards } from "./components/cards.js"
import { openModal , closeModal } from "./components/modal.js"
import { createCard , clicklikeButton ,  deleteCard } from "./components/card.js"
//Список карточек
const unorderList = document.querySelector('.places__list')
//Попапы
const popup = document.querySelector('.popup')
const popups = document.querySelectorAll('.popup')
const editPopup = document.querySelector('.popup_type_edit')
const addPopup = document.querySelector('.popup_type_new-card')
const popupCardImage = document.querySelector('.popup_type_image')
const imagePopup = popupCardImage.querySelector('.popup__image')
const titlePopup = popupCardImage.querySelector('.popup__caption')
//Кнопки
const editButton = document.querySelector('.profile__edit-button')
const addButton = document.querySelector('.profile__add-button')
const closePopupCross = document.querySelectorAll('.popup__close')
const name = document.querySelector('.profile__title')
const job = document.querySelector('.profile__description')
//Форма редактирования
const editProfileForm = document.forms["edit-profile"]
//Форма добавления
const newPlaceForm = document.forms["new-place"]
//Инпуты
const editInputs = editProfileForm.querySelectorAll('.popup__input')
const nameInput = editProfileForm.querySelector('.popup__input_type_name')
const jobInput = editProfileForm.querySelector('.popup__input_type_description')
const placeInputForm = newPlaceForm.querySelector('.popup__input_type_card-name')
const urlInputForm = newPlaceForm.querySelector('.popup__input_type_url')
//Вызовы функций
editButton.addEventListener('click' , function(evt){openModal(editPopup)})
addButton.addEventListener('click' , function(evt){openModal(addPopup)})
//Перебор крестиков
closePopupCross.forEach(function(element){
    element.addEventListener('click', function(evt){
        closeModal(element.closest(".popup"))
    })
})
//Функция обработки клика по фото
function handleClickCard(cardImageData , cardDescriptions , cardTitle){
    titlePopup.textContent = cardTitle
     
    imagePopup.src = cardImageData
    imagePopup.alt = cardDescriptions

    openModal(popupCardImage)
 }
 //Функция добавления карточек
 const addCard = function() {
    initialCards.forEach(function(element) {
        const setCard = createCard(element , deleteCard , handleClickCard , clicklikeButton)
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

    popups.forEach((item) => {
        closeModal(item)
    })
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

    const setCard = createCard(cardImage , deleteCard , handleClickCard , clicklikeButton)
    unorderList.prepend(setCard)

    popups.forEach((item) => {
        closeModal(item)
    })
    newPlaceForm.reset()
}
newPlaceForm.addEventListener('submit', handleAddCardForm)
//Показывает ошибку
const showError = (el, errorMessage) => {
  el.classList.add('popup__input_type_error');
  const formError = el.parentElement.querySelector(`.${el.id}-error`)
  formError.textContent = errorMessage
  formError.classList.add('form__input-error_active')
}
//Скрывает ошибку
const hideError = (el) => {
  el.classList.remove('popup__input_type_error');
  const formError = el.parentElement.querySelector(`.${el.id}-error`)
  formError.textContent = ''
  formError.classList.remove('form__input-error_active')
}
//Валидация формы
const checkInputValidity = (el) => {
  if (!el.validity.valid) {
    showError(el, el.validationMessage)
  } else {
    hideError(el)
  }
}
//
editProfileForm.addEventListener('submit', (evt) => {
  evt.preventDefault()
})
//Перебор инпутов
editInputs.forEach((el) => {
  el.addEventListener('input', () => {
    checkInputValidity(el)
  })
})