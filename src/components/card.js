//Функция создания карточки
export const createCard = function(data , callbackDelete , handleClickCard , ClicklikeButton) {
    const cardTemplate = document.querySelector('#card-template').content
    const cardElement = cardTemplate.querySelector(".card").cloneNode(true)

    const cardImage = cardElement.querySelector('.card__image')
    const cardImageData = cardElement.querySelector('.card__image').src = data.link
    const cardDescriptions = cardElement.querySelector('.card__image').alt = `Фото локации: ${data.name}`
    const cardTitle = cardElement.querySelector('.card__title').textContent = data.name

    cardElement.querySelector('.card__delete-button').addEventListener('click', function() {
        return callbackDelete(cardElement)
    })

    cardElement.querySelector('.card__like-button').addEventListener('click' , function(evt) {
    return ClicklikeButton(evt.target)
    })

    cardImage.addEventListener('click' , function(evt){
       return handleClickCard(cardImageData , cardDescriptions , cardTitle)
    })

    return cardElement
}
//Функция лайка
export function ClicklikeButton(likeButton){
    likeButton.classList.toggle('card__like-button_is-active')
}
//Функция удаления
export const deleteCard = function(element) {
   return element.remove()
}