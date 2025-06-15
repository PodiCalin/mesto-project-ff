'use strict'
//Импорты
import "./pages/index.css"
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
const cardTemplate = document.querySelector ("#card-template").content;
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
// Элементы для обновления аватара
const avatarEditButton = document.querySelector (".profile__image-edit-button");
const avatarPopup = document.querySelector (".popup_type_avatar");
const avatarForm = document.querySelector ("form[name=\"avatar-update\"]");
const avatarLinkInput = avatarForm.querySelector ("input[name=\"avatar-link\"]");
// const profileImage = document.querySelector (".profile__image"); //  Эта переменная уже объявлена ниже
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
// Элементы попапа с картинкой
// const imagePopup = document.querySelector (".popup_type_image"); // Дублируется объявление выше, можно удалить
const imagePopupImage = imagePopup.querySelector (".popup__image");
const imagePopupCaption = imagePopup.querySelector (".popup__caption");

// Аватар попап и форма (Добавлено)
// const avatarPopup = document.querySelector('.popup_type_avatar'); // Дублируется объявление выше, можно удалить
// const avatarForm = document.forms["edit-avatar"]; // Неправильное название формы, должно быть "avatar-update"
// const avatarLinkInput = avatarForm.querySelector('.popup__input_type_avatar-url'); // Неправильный селектор, должен быть "avatar-link"
// const avatarEditButton = document.querySelector('.profile__image-overlay'); // Дублируется объявление выше, можно удалить

// Config (Добавлено)
const profileTitle = document.querySelector('.profile__title');

//Config
const validConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button-inactive',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__input-error_active'
}

//Функция утилитарная для изменения текста кнопки в зависимости от состояния загрузки
function renderLoading(isLoading, button, buttonText = "Сохранить", loadingText = "Сохранение...") {
    if (isLoading) {
        button.textContent = loadingText;
        button.disabled = true; // Disable the button while loading
    } else {
        button.textContent = buttonText;
        button.disabled = false; // Enable the button after loading
    }
}
//Перебор крестиков
closePopupCross.forEach(function(element){
    element.addEventListener('click', function(evt){
        closeModal(element.closest(".popup"))
    })
})
//Функция обработки клика по фото
function handleClickCard({ link, name }){
    titlePopup.textContent = name

    imagePopupImage.src = link
    imagePopupImage.alt = name

    openModal(popupCardImage)
}

// Delete Card Popup
const deleteCardPopup = document.querySelector('.popup_type_delete-card');
let cardDelete = null;

// Функция открытия попапа удаления карточки
function handleDeleteButtonClick(cardElement) {
    cardDelete = cardElement; // Сохраняем ссылку на карточку, которую нужно удалить
    openModal (deleteCardPopup);
}
// Delete Card Event Listener
deleteCardPopup.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const submitButton = evt.submitter;
    const originalButtonText = submitButton.textContent;
    renderLoading(true, submitButton, originalButtonText, "Удаление...");

    removeCard(cardDelete.dataset.cardId)
        .then(() => {
            cardDelete.remove();
            closeModal(deleteCardPopup);
        })
        .catch((err) => {
            console.error(`Ошибка при удалении карточки: ${err}`);
        })
        .finally(() => {
            renderLoading(false, submitButton, originalButtonText);
        });
});

//Функция добавления карточек
const renderCards = function(cards) { // Fix: Changed renderCard to renderCards, to be consistent with promise.all usage
    cards.forEach(function(element) {
        const setCard = createCard(element , cardTemplate , deleteCard , handleClickCard , clicklikeButton, handleDeleteButtonClick)
        unorderList.append(setCard)
    })
}
// renderCard() // Remove: Moved to the promise.all, since this needs to be done after fetching the initial cards.

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
            profileName.textContent = userData.name
            jobDescription.textContent = userData.about
            closeModal(editPopup); // Закрываем попап здесь
        })
        .catch ((err) => {
            console.error (`Ошибка при обновлении профиля: ${err}`)
        })
        .finally (() => {
            // Выключаем индикацию загрузки
            renderLoading (false, submitButton, originalButtonText)
        })
}
// editProfileForm.addEventListener('submit', handleFormSubmit) // Remove: Event listener already added below

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
    addCard(name, link)
        .then((cardData) => {
            const setCard = createCard(cardData, cardTemplate, deleteCard, handleClickCard, clicklikeButton, handleDeleteButtonClick)
            unorderList.prepend(setCard)
            closeModal(addPopup); // Закрываем попап здесь
            newPlaceForm.reset();
        })
        .catch ((err) => {
            console.error (`Ошибка при добавлении карточки: ${err}`)
        })
        .finally (() => {
            // Выключаем индикацию загрузки
            renderLoading (false, submitButton, originalButtonText)
        })
}
// newPlaceForm.addEventListener('submit', handleAddCardForm) // Remove: Event listener already added below

// Отправка формы редактирования профиля
editProfileForm.addEventListener ("submit", handleFormSubmit);
// Отправка формы добавления карточки
newPlaceForm.addEventListener ("submit", handleAddCardForm);

//Вызовы функций
editButton.addEventListener('click' , function(evt){
    nameInput.value = profileName.textContent
    jobInput.value = jobDescription.textContent
    resetValidation(editProfileForm , validConfig)
    openModal(editPopup)
})
addButton.addEventListener('click' , function(evt){
    resetValidation(newPlaceForm , validConfig)
    openModal(addPopup)
})

// Обработчик отправки формы обновления аватара
function handleAvatarFormSubmit(evt) {
    evt.preventDefault ()
    // Получаем значение из инпута
    const avatarLink = avatarLinkInput.value
    // Получаем кнопку отправки формы через event.submitter
    const submitButton = evt.submitter
    // Сохраняем оригинальный текст кнопки
    const originalButtonText = submitButton.textContent
    // Включаем индикацию загрузки
    renderLoading (true, submitButton, originalButtonText)
    // Отправляем запрос на сервер для обновления аватара
    updateUserAvatar (avatarLink)
        .then ((userData) => {
            // Обновляем аватар на странице
            profileImage.style.backgroundImage = `url(${userData.avatar})`
            closeModal (avatarPopup); // Закрываем попап здесь
            avatarForm.reset ()
        })
        .catch ((err) => {
            console.error (`Ошибка при обновлении аватара: ${err}`)
        })
        .finally (() => {
            // Выключаем индикацию загрузки
            renderLoading (false, submitButton, originalButtonText)
        })
}

// Добавляем EventListener для отправки формы аватара
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

// Функция открытия попапа редактирования аватара
function openAvatarPopup() {
    resetValidation(avatarForm, validConfig);
    openModal(avatarPopup);
}

// Добавляем EventListener для открытия попапа редактирования аватара
avatarEditButton.addEventListener('click', openAvatarPopup);

// Загрузка данных пользователя и карточек при инициализации страницы
Promise.all ([getUserInfo (), getInitialCards ()])
    .then (([userData, cards]) => {
        // Обновляем данные профиля
        profileName.textContent = userData.name
        jobDescription.textContent = userData.about
        // Если у пользователя есть аватар, обновляем его
        if (userData.avatar) {
            profileImage.style.backgroundImage = `url(${userData.avatar})`
        }
        // Сохраняем ID пользователя
        profileTitle.dataset.userId = userData._id
        // Отрисовываем карточки
        renderCards (cards)
    })
    .catch ((err) => {
        console.error (`Ошибка при загрузке данных: ${err}`)
    })
enableValidation(validConfig)
