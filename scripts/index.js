'use strict'

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
