/**
 * JSON mock object with users data. Used to simalate login process
 * @type {Object}
 */
var mockUsers = [
  {
    username: 'Admin',
    password: '21232f297a57a5a743894a0e4a801fc3' //'admin'
  },
  {
    username: 'Sasha',
    password: 'd8578edf8458ce06fbc5bb76a58c5ca4' //'qwerty
  },
  {
    username: 'John',
    password: '25d55ad283aa400af464c76d713c07ad' //12345678
  }
];


/**
 * App module. Contain some public methods such as rendering after login/logout
 * @type {Object}
 */
var app = (function () {
  var loggedInfo = getFromStorage('sessionInfo');
  var headingTitle = document.querySelector('.header__title');
  var username = headingTitle.querySelector('.js-username');
  var form = document.querySelector('.login__form');
  var slider = document.querySelector('.slider');
  var logoutButton = document.querySelector('.logout-btn');

  /* If some user logged in previously */
  if (loggedInfo[0] !== undefined) {
    renderAfterLogin(loggedInfo[0].username);
  }


  /**
   * @description
   * {Public} - It takes user name and perform rendering of slider, greeting and logout button.
   * @param name {String} - user name
   */
  function renderAfterLogin(name) {
    username.innerHTML = name;
    headingTitle.classList.remove('hidden');
    form.classList.add('hidden');
    slider.classList.remove('hidden');
    logoutButton.classList.remove('hidden');
    saveSession(name);
  }


  /**
   * @description
   * {Public} - Render page after logout.
   */
  function renderAfterLogout() {
    headingTitle.classList.add('hidden');
    slider.classList.add('hidden');
    logoutButton.classList.add('hidden');
    form.classList.remove('hidden');
    clearStorage();
  }


  /**
   * @description
   * {Private} - Save users data from storage.
   * @param name {String} - value to save in storage
   */
  function saveSession(name) {
    var value = [{}];
    if (window.localStorage) {
      value[0].username = name;
      window.localStorage.setItem('sessionInfo', JSON.stringify(value));
    }
  }


  /**
   * @description
   * {Public} - Get users data from storage. Used to check auth status. It returns empty array if no users data are saved.
   * @param key {String} - key used in local storage.
   * @returns {Array} - json user data
   */
  function getFromStorage(key) {
    if (window.localStorage) {
      return JSON.parse(window.localStorage.getItem(key)) || [];
    }
    return [];
  }


  /**
   * @description
   * {Private} - Helper method to clear data from storage. Can be used after logout.
   */
  function clearStorage() {
    if (window.localStorage) {
      window.localStorage.clear();
    }
  }

  /* add listeners*/
  logoutButton.addEventListener('click', function (e) {
    e.preventDefault();
    renderAfterLogout();
  });

  return {
    renderAfterLogin: renderAfterLogin,
    renderAfterLogout: renderAfterLogout,
    getFromStorage: getFromStorage,
    clearStorage: clearStorage
  };
})();


/**
 * Validator module. Contain main public method - validate.
 * @type {Object}
 */
var validator = (function () {
  var form = document.querySelector('.login__form');
  var username = form.querySelector('#login__username');
  var password = form.querySelector('#login__password');
  var isValid;
  var errors = {
    loginLength: form.querySelector('.login__username__error--length'),
    loginExist: form.querySelector('.login__username__error--exist'),
    passwordLength: form.querySelector('.login__password__error--length'),
    passwordInvalid: form.querySelector('.login__password__error--invalid')
  };


  /**
   * @description
   * {Public} - Method calls private validation methods. After success it calls simulation of login process.
   * @param e {Object} - event object from listener
   */
  function validate(e) {
    e.preventDefault();
    validateUserName();
    validatePassword();

    if (isValid) {
      simulateCheckingUser(username.value, password.value);
    }
  }


  /**
   * @description
   * {Private} - Validate username field. For now it only checks length of name (greater then 3).
   * But here we can perform other restrictions. If username field fits acceptance criteria
   * we put 'isValid' flag to 'true'. If no - 'false'.
   */
  function validateUserName() {
    /* Check length of username. Hide and show error messages */
    if (username.value.length < 3) {
      username.classList.add('login__input--error');
      errors.loginLength.classList.remove('hidden');
      isValid = false;
    } else {
      username.classList.remove('login__input--error');
      errors.loginLength.classList.add('hidden');
      isValid = true;
    }
  }


  /**
   * @description
   * {Private} - Validate password field. For now it only checks the length of a password (greater then 5).
   * But here we can perform other restrictions and validations.
   * If password field fits acceptance criteria we put 'isValid' flag to 'true'. If no - 'false'.
   */
  function validatePassword() {
    if (password.value.length < 5) {
      password.classList.add('login__input--error');
      errors.passwordLength.classList.remove('hidden');
      isValid = false;
    } else {
      password.classList.remove('login__input--error');
      errors.passwordLength.classList.add('hidden');
      isValid = true;
    }
  }


  /**
   * @description
   * {Private} - Perform simulating of login process. It check user input with mock data in object. If all data is valid
   * it will call app.renderAfterLogin method (imitate successful auth). If something went wrong - it will render error
   * panels on UI with description of error.
   * @param name {String} - username
   * @param pass {String} - password
   * @returns {Boolean} - true/false if process ends as predicted (or not).
   */
  function simulateCheckingUser(name, pass) {
    var user = mockUsers.filter(function (item) {
      if (item.username.toLowerCase() === name.toLowerCase()) {
        return item;
      }
    });

    if (user.length < 1) {
      username.classList.add('login__input--error');
      errors.loginExist.classList.remove('hidden');
      return false;
    } else {
      username.classList.remove('login__input--error');
      errors.loginExist.classList.add('hidden');
    }

    if (user[0].password !== MD5(pass)) {
      password.classList.add('login__input--error');
      errors.passwordInvalid.classList.remove('hidden');
    } else {
      password.classList.remove('login__input--error');
      errors.passwordInvalid.classList.add('hidden');
      app.renderAfterLogin(user[0].username);
    }
    return true;
  }

  return {
    validate: validate
  };
})();


/**
 * For now it just a function. But it can contains more complex logic for working with form.
 * Now it works like a controller by adding listener to submit button.
 * @type {Object}
 */
var form = (function () {
  var form = document.querySelector('.login__form');
  var submit = form.querySelector('.login__submit');

  /* Add listeners*/
  submit.addEventListener('click', validator.validate);
  return {};
})();


/**
 * Slider module. It return object with public method 'showNext'. Used to perform loop slider.
 * @type {Object}
 */
var slider = (function () {
  var sliderWrap = document.querySelector('.slider');
  var controlRight = sliderWrap.querySelector('.slider__controls--next');
  var controlLeft = sliderWrap.querySelector('.slider__controls--prev');
  var slides = sliderWrap.querySelectorAll('.slider__item');
  var cnt = 0;
  var length = slides.length;
  var active = slides[0];
  var activeClass = 'slider__item--current';


  /**
   * @description
   * {Public} - Perform navigation between slides. It takes direction as an argument. This parameter is a number that we
   * used to show direction of slide. '1' if we click right control button, '-1' - left control button. '0' - is used by
   * default after page loading to show first slide.
   * @params direction {Number} - direction
   */
  function showNext(direction) {
    active.classList.remove(activeClass);
    cnt += direction;
    if (direction === 1 && !slides[cnt]) {
      cnt = 0;
    } else if (direction === -1 && cnt < 0) {
      cnt = length - 1;
    }
    active = slides[cnt];
    active.classList.add(activeClass);
  }

  /* Add listeners to control buttons*/
  controlRight.addEventListener('click', function () {
    showNext(1);
  });

  controlLeft.addEventListener('click', function () {
    showNext(-1);
  });

  showNext(0);

  return {
    showNext: showNext
  };
})();
