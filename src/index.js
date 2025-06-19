// 1. Импорты модулей и стилей
import "./pages/index.css"; // Импорт основного CSS-файла
import { closeModal, openModal } from "./components/modal.js" // Импорт функций для работы с попапами
import {
  createCard,
} from "./components/card.js" // Импорт функций и данных для карточек
import {resetValidation, enableValidation} from "./components/validate.js" // Импорт функций для валидации
import {
  addCard,
  getInitialCards,
  getUserInfo,
  removeCard,
  updateUserAvatar,
  updateUserProfile,
} from "./components/api.js"; // Импорт функций для получения данных профиля
//Шаблон карточки
const cardTemplate = document.querySelector ("#card-template").content
const currentUserId = document.querySelector(".profile__title").dataset.userId
//Контейнер для карточек
const placesList = document.querySelector (".places__list")
//Элементы для обновления аватара
const avatarEditButton = document.querySelector (".profile__image-edit-button")
const avatarPopup = document.querySelector (".popup_type_avatar")
const avatarForm = document.querySelector ("form[name=\"avatar-update\"]")
const avatarLinkInput = avatarForm.querySelector ("input[name=\"avatar-link\"]")
const profileImage = document.querySelector (".profile__image")
//Элементы профиля
const editProfilePopup = document.querySelector (".popup_type_edit")
const editButton = document.querySelector (".profile__edit-button")
const profileTitle = document.querySelector (".profile__title")
const profileDescription = document.querySelector (".profile__description")
const editProfileForm = document.querySelector ("form[name=\"edit-profile\"]")
const nameInput = editProfileForm.querySelector ("input[name=\"name\"]")
const jobInput = editProfileForm.querySelector ("input[name=\"description\"]")
//Элементы для добавления карточки
const addButton = document.querySelector (".profile__add-button")
const addCardPopup = document.querySelector (".popup_type_new-card")
const addCardForm = document.querySelector ("form[name=\"new-place\"]")
const placeNameInput = addCardForm.querySelector ("input[name=\"place-name\"]")
const placeLinkInput = addCardForm.querySelector ("input[name=\"link\"]")
//Элементы попапа с картинкой
const imagePopup = document.querySelector (".popup_type_image")
const imagePopupImage = imagePopup.querySelector (".popup__image")
const imagePopupCaption = imagePopup.querySelector (".popup__caption")
//Элементы попапа для удаления карточки
const deleteCardPopup = document.querySelector (".popup_type_delete-card")
const deleteCardButton = deleteCardPopup.querySelector (".popup__button_delete")
let cardToDelete = null; // Переменная для хранения ссылки на удаляемую карточку
//Все попапы на странице
const popups = document.querySelectorAll (".popup")
const closePopupCross = document.querySelectorAll('.popup__close')
//Конфиг валидации форм
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible"
}
//Функция утилитарная для изменения текста кнопки в зависимости от состояния загрузки
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
//Обработчик клика по изображению карточки
function handleCardImageClick({ link, name }) {
  imagePopupImage.src = link
  imagePopupImage.alt = name
  imagePopupCaption.textContent = name
  openModal (imagePopup)
}
//Обработчик отправки формы обновления аватара
function handleAvatarFormSubmit(evt) {
  evt.preventDefault ()
  //Получаем значение из инпута
  const avatarLink = avatarLinkInput.value
  //Получаем кнопку отправки формы через event.submitter
  const submitButton = evt.submitter
  //Сохраняем оригинальный текст кнопки
  const originalButtonText = submitButton.textContent
  //Включаем индикацию загрузки
  renderLoading (true, submitButton, originalButtonText)
  //Отправляем запрос на сервер для обновления аватара
  updateUserAvatar (avatarLink)
    .then ((userData) => {
      //Обновляем аватар на странице
      profileImage.style.backgroundImage = `url(${userData.avatar})`
      //Закрываем попап
      closeModal (avatarPopup)
      //Сбрасываем форму
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
//Обработчик отправки формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault () // Отменяем стандартную отправку формы
  //Получаем значения из инпутов
  const name = nameInput.value
  const about = jobInput.value
  //Получаем кнопку отправки формы через event.submitter
  const submitButton = evt.submitter
  //Сохраняем оригинальный текст кнопки
  const originalButtonText = submitButton.textContent
  //Включаем индикацию загрузки
  renderLoading (true, submitButton, originalButtonText)
  //Отправляем запрос на сервер для обновления профиля
  updateUserProfile (name, about)
    .then ((userData) => {
      //Обновляем данные профиля на странице
      profileTitle.textContent = userData.name
      profileDescription.textContent = userData.about
      //Закрываем попап
      closeModal (editProfilePopup)
    })
    .catch ((err) => {
      console.error (`Ошибка при обновлении профиля: ${err}`)
    })
    .finally (() => {
      //Выключаем индикацию загрузки
      renderLoading (false, submitButton, originalButtonText)
    })
}
//Обработчик отправки формы добавления новой карточки
function handleAddCardSubmit(evt) {
  evt.preventDefault () // Отменяем стандартную отправку формы
  //Получаем значения из инпутов
  const name = placeNameInput.value
  const link = placeLinkInput.value
  //Получаем кнопку отправки формы через event.submitter
  const submitButton = evt.submitter
  //Сохраняем оригинальный текст кнопки
  const originalButtonText = submitButton.textContent
  //Включаем индикацию загрузки
  renderLoading (true, submitButton, originalButtonText)
  // Отправляем запрос на сервер для добавления карточки
  addCard (name, link)
    .then ((cardData) => {
      //Создаём новую карточку с данными, полученными с сервера
      const newCard = createCard (
        cardData,
        cardTemplate,
          handleDeleteButtonClick,
        handleCardImageClick,
          currentUserId,
      )
      //Добавляем карточку в начало списка
      placesList.prepend (newCard)
      //Закрываем попап и очищаем форму
      closeModal (addCardPopup)
      addCardForm.reset ()
    })
    .catch ((err) => {
      console.error (`Ошибка при добавлении карточки: ${err}`);
    })
    .finally (() => {
      //Выключаем индикацию загрузки
      renderLoading (false, submitButton, originalButtonText);
    })
}
//Отправка формы обновления аватара
avatarForm.addEventListener ("submit", handleAvatarFormSubmit)
//Открытие попапа обновления аватара
avatarEditButton.addEventListener ("click", () => {
  avatarForm.reset ()
  resetValidation (avatarForm, validationConfig)
  openModal (avatarPopup)
})
//Отправка формы редактирования профиля
editProfileForm.addEventListener ("submit", handleProfileFormSubmit)
//Отправка формы добавления карточки
addCardForm.addEventListener ("submit", handleAddCardSubmit)
//Открытие попапа редактирования профиля
editButton.addEventListener ("click", () => {
  //Подставляем актуальные значения в инпуты
  nameInput.value = profileTitle.textContent
  jobInput.value = profileDescription.textContent
  resetValidation (editProfileForm, validationConfig)
  openModal (editProfilePopup)
})
//Открытие попапа добавления карточки
addButton.addEventListener ("click", () => {
  addCardForm.reset ()
  resetValidation (addCardForm, validationConfig)
  openModal (addCardPopup)
})
//Функция для открытия попапа удаления карточки
function handleDeleteButtonClick(cardElement) {
  cardToDelete = cardElement // Сохраняем ссылку на карточку, которую нужно удалить
  openModal (deleteCardPopup)
}
//Обработчик клика по кнопке "Да" в попапе удаления карточки
deleteCardButton.addEventListener ("click", () => {
  if (cardToDelete) {
    //Получаем ID карточки из data-атрибута
    const cardId = cardToDelete.dataset.cardId
    //Сохраняем оригинальный текст кнопки
    const originalButtonText = deleteCardButton.textContent
    //Включаем индикацию загрузки с текстом "Удаление..."
    renderLoading (true, deleteCardButton, originalButtonText, "Удаление...");
    // Отправляем запрос на удаление карточки
    removeCard (cardId)
      .then (() => {
        //Если запрос успешен, удаляем карточку из DOM
        cardElement.remove()
        //Очищаем ссылку на удаляемую карточку
        cardToDelete = null
        //Закрываем попап
        closeModal (deleteCardPopup)
      })
      .catch ((err) => {
        console.error (`Ошибка при удалении карточки: ${err}`)
      })
      .finally (() => {
        //Выключаем индикацию загрузки
        renderLoading (false, deleteCardButton, originalButtonText)

      })
  }
})
function renderCards(cards) {
  // Перебираем массив карточек и добавляем каждую на страницу
  cards.forEach ((cardData) => {
    const cardElement = createCard (
      cardData,
      cardTemplate,
        handleDeleteButtonClick,
      handleCardImageClick,
        currentUserId,
    )
    placesList.append (cardElement)
  })
}
// Загрузка данных пользователя и карточек при инициализации страницы
Promise.all ([getUserInfo (), getInitialCards ()])
  .then (([userData, cards]) => {
    //Обновляем данные профиля
    profileTitle.textContent = userData.name
    profileDescription.textContent = userData.about
    if (userData.avatar) {
      profileImage.style.backgroundImage = `url(${userData.avatar})`
    }
    //Сохраняем ID пользователя
    profileTitle.dataset.userId = userData._id
    //Отрисовываем карточки
    renderCards (cards)
  })
  .catch ((err) => {
    console.error (`Ошибка при загрузке данных: ${err}`)
  })

enableValidation (validationConfig); // Инициализация валидации
