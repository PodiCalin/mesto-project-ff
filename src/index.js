'use strict'
//Импорты
import "./pages/index.css"
import { initialCards } from "./components/cards.js"
import { openModal , closeModal } from "./components/modal.js"
import { createCard , clicklikeButton ,  deleteCard } from "./components/card.js"
import { enableValidation , resetValidation } from "./components/validation.js"
import {
  addCard,
  getInitialCards,
  getUserInfo,
  removeCard,
  updateUserAvatar,
  updateUserProfile,
} from "./components/api.js"; // Импорт функций для получения данных профиля
//Список карточек
const unorderList = document.querySelector('.places__list')
const cardTemplate = document.querySelector ("#card-template").content
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
const profileImage = document.querySelector(".profile__image")
const profileName = document.querySelector(".profile__title")
const jobDescription = document.querySelector(".profile__description")
//Форма добавления
const newPlaceForm = document.forms["new-place"]
//Инпуты
const nameInput = editProfileForm.querySelector('.popup__input_type_name')
const jobInput = editProfileForm.querySelector('.popup__input_type_description')
const placeInputForm = newPlaceForm.querySelector('.popup__input_type_card-name')
const urlInputForm = newPlaceForm.querySelector('.popup__input_type_url')
//Config
const validConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button-inactive',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error_active'
} 
//Утилитарная функция для изменения текста кнопки в зависимости от состояния загрузки
function renderLoading(isLoading, button, buttonText = "Сохранить", loadingText = "Сохранение...") {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = buttonText;
  }
}
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
 const renderCard = function() {
    initialCards.forEach(function(element) {
        const setCard = createCard(element , cardTemplate , deleteCard , handleClickCard , clicklikeButton)
        return unorderList.append(setCard)
    })
}
renderCard()
//Функция Формы редактирования
function handleFormSubmit(evt) {
  evt.preventDefault()
  // Получаем значения из инпутов
  const name = nameInput.value 
  const about = jobInput.value
  // Получаем кнопку отправки формы через event.submitter
  const submitButton = evt.submitter;
  // Сохраняем оригинальный текст кнопки
  const originalButtonText = submitButton.textContent;
  // Включаем индикацию загрузки
  renderLoading (true, submitButton, originalButtonText)
  // Отправляем запрос на сервер для обновления профиля
  updateUserProfile (name, about) 
    .then((userData) => {
      name.textContent = userData.name
      job.textContent = userData.about
      //Закрытие попапа
      popups.forEach((item) => {
        closeModal(item)
    })
    editProfileForm.reset()})
    .catch ((err) => {
      console.error (`Ошибка при обновлении профиля: ${err}`)
    })
    .finally (() => {
      // Выключаем индикацию загрузки
      renderLoading (false, submitButton, originalButtonText)
    })
}
editProfileForm.addEventListener('submit', handleFormSubmit)
//Функция Формы добавления
function handleAddCardForm(evt) {
    evt.preventDefault()
    const name = placeInputForm.value 
    const link = urlInputForm.value
  //Получаем кнопку отправки формы через event.submitter
  const submitButton = evt.submitter
  //Сохраняем оригинальный текст кнопки
  const originalButtonText = submitButton.textContent
  //Включаем индикацию загрузки
  renderLoading (true, submitButton, originalButtonText)
  addCard(name , link)
    .then((cardData) => {
    const setCard = createCard(cardData, cardImage, cardTemplate, deleteCard, handleClickCard, clicklikeButton)
    unorderList.prepend(setCard)
    popups.forEach((item) => {
        closeModal(item)
    })
    newPlaceForm.reset()})
    .catch ((err) => {
      console.error (`Ошибка при добавлении карточки: ${err}`)
    })
    .finally (() => {
      // Выключаем индикацию загрузки
      renderLoading (false, submitButton, originalButtonText)
    })
}
newPlaceForm.addEventListener('submit', handleAddCardForm)

// Отправка формы редактирования профиля
editProfileForm.addEventListener ("submit", handleFormSubmit);
// Отправка формы добавления карточки
newPlaceForm.addEventListener ("submit", handleAddCardForm);
//Вызовы функций
editButton.addEventListener('click' , function(evt){
  nameInput.value = name.textContent
  jobInput.value = job.textContent
  resetValidation(editProfileForm , validConfig)
  openModal(editPopup)
})
addButton.addEventListener('click' , function(evt){
  resetValidation(newPlaceForm , validConfig)
  openModal(addPopup)
})

enableValidation(validConfig)

