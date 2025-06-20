import { likeCard, unlikeCard } from "./api.js"
//Функция лайка карточки
function handleLikeButtonClick(evt, cardId, likeCount) {
  const likeButton = evt.target
  const isLiked = likeButton.classList.contains("card__like-button_is-active")
  //Выбираем подходящий метод в зависимости от текущего состояния
  const likeMethod = isLiked ? unlikeCard : likeCard
  likeMethod(cardId)
    .then((updatedCard) => {
      //Обновляем состояние кнопки
      likeButton.classList.toggle("card__like-button_is-active")
      //Обновляем счетчик лайков из ответа сервера
      likeCount.textContent = updatedCard.likes.length
    })
    .catch((err) => {
      console.error(`Ошибка при обновлении лайка: ${err}`)
    })
}
export function deleteCard(cardElement){
  cardElement.remove()
}
//Функция создания карточки
export function createCard(
  cardData,
  cardTemplate,
  deleteCard,
  handleDeleteButtonClick,
  handleCardImageClick,
  currentUserId,
) {
  //Клонируем шаблон карточки
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true)
  //Находим элементы внутри карточки
  const cardImage = cardElement.querySelector(".card__image")
  const cardTitle = cardElement.querySelector(".card__title")
  const deleteButton = cardElement.querySelector(".card__delete-button")
  const likeButton = cardElement.querySelector(".card__like-button")
  const likeCount = cardElement.querySelector(".card__like-count")
  //Устанавливаем значения из данных карточки
  cardImage.src = cardData.link
  cardImage.alt = cardData.name
  cardTitle.textContent = cardData.name
  //Устанавливаем количество лайков
  if (likeCount) {
    likeCount.textContent = cardData.likes.length
  }
  const cardId = cardData._id
  //Проверяем, является ли текущий пользователь владельцем карточки
  if (cardData.owner && cardData.owner._id !== currentUserId) {
    //Если не владелец - скрываем кнопку удаления
    deleteButton.classList.add("card__delete-button-hidden")
  }
  //Проверяем, лайкнул ли текущий пользователь карточку
  const isLiked = cardData.likes.some((user) => user._id === currentUserId)
  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active")
  }
  //Обработчик удаления карточки
  deleteButton.addEventListener("click", () => {
    if(handleDeleteButtonClick(cardElement , cardId)){
    deleteCard(cardElement)}
  })
  //Обработчик лайка
  likeButton.addEventListener("click", (evt) => {
    handleLikeButtonClick(evt, cardData._id, likeCount)
  })
  //Обработчик открытия попапа с картинкой
  cardImage.addEventListener("click", () => handleCardImageClick(cardData))
  //Возвращаем готовый DOM-элемент карточки
  return cardElement
}
