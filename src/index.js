'use strict'
//Импорты
import "./pages/index.css"
import { initialCards } from "./components/cards.js"
import { openModal , closeModal } from "./components/modal.js"
import { createCard , clicklikeButton ,  deleteCard } from "./components/card.js"
//Список карточек
const unorderList = document.querySelector('.places__list')
//Попапы
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
const nameInput = editProfileForm.querySelector('.popup__input_type_name')
const jobInput = editProfileForm.querySelector('.popup__input_type_description')
const placeInputForm = newPlaceForm.querySelector('.popup__input_type_card-name')
const urlInputForm = newPlaceForm.querySelector('.popup__input_type_url')
//Вызовы функций
editButton.addEventListener('click' , function(evt){
  nameInput.value = name.textContent
  jobInput.value = job.textContent
  resetValidation(editProfileForm)
  openModal(editPopup)
})
addButton.addEventListener('click' , function(evt){
  resetValidation(newPlaceForm)
  openModal(addPopup)
})
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

// Функция, которая показывает сообщение об ошибке рядом с полем ввода
const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`)
  inputElement.classList.add('popup__input_type_error')
  errorElement.textContent = errorMessage
  errorElement.classList.add('popup__input-error_active')
}

// Функция, которая скрывает сообщение об ошибке, если пользователь всё ввёл правильно
const hideInputError = (formElement, inputElement) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`)
  inputElement.classList.remove('popup__input_type_error')
  errorElement.classList.remove('popup__input-error_active')
  errorElement.textContent = ''
}

// Проверяет корректность введённых данных в одном поле
const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage)
  } else {
    hideInputError(formElement, inputElement)
  }
}

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement)=> {
    return !inputElement.validity.valid
  })
  }

const toggleButtonState = (inputList, buttonElement) => {
  // Если есть хотя бы один невалидный инпут
  if (hasInvalidInput(inputList)) {
    // сделай кнопку неактивной
    buttonElement.disabled = true;
    buttonElement.classList.add('popup__button-inactive')
  } else {
    // иначе сделай кнопку активной
    buttonElement.disabled = false;
    buttonElement.classList.remove('popup__button-inactive')
  }
}

const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'))
   const buttonElement = formElement.querySelector('.popup__button')
   toggleButtonState(inputList, buttonElement)
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      checkInputValidity(formElement, inputElement)
      toggleButtonState(inputList, buttonElement)
    })
  })
}
//Функция валилации
const enableValidation = () => {
  const formList = Array.from(document.querySelectorAll('.popup__form'))
  formList.forEach((formElement) => {
    setEventListeners(formElement)
    formElement.addEventListener('submit', function (evt) {
      evt.preventDefault()
    })
  })
}
enableValidation()
//Удаление ошибок валидации
const resetValidation = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const buttonElement = formElement.querySelector('.popup__button');

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement)
    inputElement.value = ''
  })
  
  toggleButtonState(inputList, buttonElement);
}

