import { likeCard, unlikeCard } from "./api.js"
//Функция лайка
export function clicklikeButton(cardId, likeCount){
    const likeButton = evt.target;
    const isLiked = likeButton.classList.contains("card__like-button_is-active")
    // Выбираем подходящий метод в зависимости от текущего состояния
    const likeMethod = isLiked ? unlikeCard : likeCard
    likeMethod(cardId)
        .then((updatedCard) => {
            // Обновляем состояние кнопки
            likeButton.classList.toggle("card__like-button_is-active")

            // Обновляем счетчик лайков из ответа сервера
            likeCount.textContent = updatedCard.likes.length
        })
        .catch((err) => {
            console.error(`Ошибка при обновлении лайка: ${err}`)
        })
}
//Функция удаления
export const deleteCard = function(element , handleDeleteButtonClick) {
    if (typeof handleDeleteButtonClick === "function") {
        handleDeleteButtonClick(cardElement);
    }
}
//Функция создания карточки
export const createCard = function(cardData, cardTemplate, callbackDelete, handleClickCard, clicklikeButton, handleDeleteButtonClick) {
    const cardElement = cardTemplate.querySelector(".card").cloneNode(true)
    // Сохраняем ID карточки в data-атрибуте
    cardElement.dataset.cardId = cardData._id

    const cardImage = cardElement.querySelector('.card__image')
    const cardImageData = cardElement.querySelector('.card__image').src = cardData.link
    const cardDescriptions = cardElement.querySelector('.card__image').alt = `Фото локации: ${cardData.name}`
    const cardTitle = cardElement.querySelector('.card__title').textContent = cardData.name
    const deleteButton = cardElement.querySelector(".card__delete-button")
    const likeButton = cardElement.querySelector(".card__like-button")
    const likeCount = cardElement.querySelector(".card__like-count")
    // Устанавливаем количество лайков
    likeCount.textContent = cardData.likes.length
    // Получаем ID текущего пользователя
    const userId = document.querySelector(".profile__title").dataset.userId
    // Проверяем, является ли текущий пользователь владельцем карточки
    if (cardData.owner && cardData.owner._id !== userId) {
        // Если не владелец - скрываем кнопку удаления
        deleteButton.style.display = "none"
    }
    // Проверяем, лайкнул ли текущий пользователь карточку
    const isLiked = cardData.likes.some((user) => user._id === userId)
    if (isLiked) {
        likeButton.classList.add("card__like-button_is-active")
    }
    //Обработчик удаления карточки
    cardElement.deleteButton.addEventListener('click', function() {
        return callbackDelete(cardElement ,handleDeleteButtonClick)
    })
    //Обработчик лайка
    cardElement.likeButton.addEventListener('click' , function(evt) {
    return clicklikeButton(evt.target, cardData._id, likeCount)
    })
    //Обработчик открытия попапа с картинкой
    cardImage.addEventListener('click' , function(evt){
       return handleClickCard(cardData)
    })

    return cardElement
}
