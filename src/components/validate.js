// Функция, которая показывает сообщение об ошибке рядом с полем ввода
const showInputError = (formElement, inputElement, errorMessage , validConfig) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`)
  inputElement.classList.add(validConfig.inputErrorClass)
  errorElement.textContent = errorMessage
  errorElement.classList.add(validConfig.errorClass)
}

// Функция, которая скрывает сообщение об ошибке, если пользователь всё ввёл правильно
const hideInputError = (formElement, inputElement , validConfig) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`)
  inputElement.classList.remove(validConfig.inputErrorClass)
  errorElement.classList.remove(validConfig.errorClass)
  errorElement.textContent = ''
}

// Проверяет корректность введённых данных в одном поле
const checkInputValidity = (formElement, inputElement , validConfig) => {
  if (inputElement.validity.patternMismatch) {
    // Берём кастомное сообщение из data-атрибута
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage , validConfig)
  } else {
    hideInputError(formElement, inputElement , validConfig)
  }
}

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement)=> {
    return !inputElement.validity.valid
  })
}

const toggleButtonState = (inputList, buttonElement , validConfig) => {
  // Если есть хотя бы один невалидный инпут
  if (hasInvalidInput(inputList)) {
    // сделай кнопку неактивной
    buttonElement.disabled = true;
    buttonElement.classList.add(validConfig.inactiveButtonClass)
  } else {
    // иначе сделай кнопку активной
    buttonElement.disabled = false;
    buttonElement.classList.remove(validConfig.inactiveButtonClass)
  }
}

const setEventListeners = (formElement , validConfig) => {
  const inputList = Array.from(formElement.querySelectorAll(validConfig.inputSelector))
  const buttonElement = formElement.querySelector(validConfig.submitButtonSelector)
  toggleButtonState(inputList, buttonElement , validConfig)
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      checkInputValidity(formElement, inputElement , validConfig)
      toggleButtonState(inputList, buttonElement , validConfig)
    })
  })
}
//Функция валидации
export  const enableValidation = (validConfig) => {
  const formList = Array.from(document.querySelectorAll(validConfig.formSelector))
  formList.forEach((formElement) => {
    setEventListeners(formElement , validConfig)
  })
}
//Удаление ошибок валидации
export  const resetValidation = (formElement , validConfig) => {
  const inputList = Array.from(formElement.querySelectorAll(validConfig.inputSelector));
  const buttonElement = formElement.querySelector(validConfig.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement , validConfig)
  })

  toggleButtonState(inputList, buttonElement , validConfig);
}
