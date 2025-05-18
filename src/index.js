'use strict'

import "./pages/index.css"
import { initialCards } from "./scripts/cards.js"


const unorderList = document.querySelector('.places__list')

const createCard = function(data , callbackDelete) {
    const cardTemplate = document.querySelector('#card-template').content
    const cardElement = cardTemplate.querySelector(".card").cloneNode(true)

    cardElement.querySelector('.card__image').src = data.link
    cardElement.querySelector('.card__image').alt = `Фото локации: ${data.name}`
    cardElement.querySelector('.card__title').textContent = data.name

    cardElement.querySelector('.card__delete-button').addEventListener('click', function() {
        return callbackDelete(cardElement)
    })

    cardElement.querySelector('.card__like-button').addEventListener('click' , function(evt) {
    return evt.target.classList.toggle('card__like-button_is-active')
    })

    return cardElement
}

const addCard = function() {
    initialCards.forEach(function(element) {
        const setCard = createCard(element , deleteCard)
        return unorderList.append(setCard)
    })
}

const deleteCard = function(element) {
   return element.remove()
}

addCard()
//Попапы
const popup = document.querySelector('.popup')
const popups = document.querySelectorAll('.popup')
const editPopup = document.querySelector('.popup_type_edit')
const addPopup = document.querySelector('.popup_type_new-card')
//Кнопки
const editButton = document.querySelector('.profile__edit-button')
const addButton = document.querySelector('.profile__add-button')
//Функция открытия попапа
function openModal(popup){
        popup.classList.add('popup_is-opened')
        document.addEventListener('keydown', closeEsc)
        //Фунция закрытия кликом на оверлей
        popup.addEventListener('click' , function(evt){
            if(evt.target === evt.currentTarget){
                closeModal(popup)
            }
        })   
}
//Вызовы функций
editButton.addEventListener('click' , function(evt){openModal(editPopup)})
addButton.addEventListener('click' , function(evt){openModal(addPopup)})
//Функция закрытия
function closeModal(popup){
 popup.classList.remove('popup_is-opened')
 popup.removeEventListener('keydown' , closeEsc)
}
//Функция закрытия по ESC
function closeEsc(evt){
    if(evt.key === 'Escape'){
        closeModal(popup)
    }
}
//Перебор крестиков
popups.forEach(function(popup){
    const closePopupButton = popup.querySelector('.popup__close')
    closePopupButton.addEventListener('click' , function(evt){closeModal(popup)})
})
//Форма
const editProfileForm = document.querySelector('[name = "edit-profile"]')

const nameInput = document.querySelector('.popup__input_type_name')
const jobInput = document.querySelector('.popup__input_type_description')
//Функция Формы
function handleFormSubmit(evt) {
    evt.preventDefault()

    const nameValue = nameInput.value 
    const jobValue = jobInput.value
   
    const name = document.querySelector('.profile__title')
    const job = document.querySelector('.profile__description')

    name.textContent = nameValue
    job.textContent = jobValue

    closeModal(popup)
}

editProfileForm.addEventListener('submit', handleFormSubmit)

