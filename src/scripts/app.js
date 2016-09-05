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

var app = (function () {
  var loggedInfo = getFromStorage('sessionInfo');
  var headingTitle = document.querySelector('.header__title');
  var username = headingTitle.querySelector('.js-username');
  var form = document.querySelector('.login__form');
  var slider = document.querySelector('.slider');
  var logoutButton = document.querySelector('.logout-btn');

  if (loggedInfo[0] !== undefined) {
    renderAfterLogin(loggedInfo[0].username);
  }

  function renderAfterLogin(name) {
    username.innerHTML = name;
    headingTitle.classList.remove('hidden');
    form.classList.add('hidden');
    slider.classList.remove('hidden');
    logoutButton.classList.remove('hidden');
    saveSession(name);
  }

  function renderAfterLogout() {
    headingTitle.classList.add('hidden');
    slider.classList.add('hidden');
    logoutButton.classList.add('hidden');
    form.classList.remove('hidden');
    clearStorage();
  }

  function saveSession(name) {
    var value = [{}];
    if (window.localStorage) {
      value[0].username = name;
      window.localStorage.setItem('sessionInfo', JSON.stringify(value));
    }
  }

  function getFromStorage(key) {
    if (window.localStorage) {
      return JSON.parse(window.localStorage.getItem(key)) || [];
    }
    return [];
  }

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
    getFromStorage: getFromStorage
  };
})();

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

  function validate(e) {
    e.preventDefault();
    validateUserName();
    validatePassword();

    if (isValid) {
      simulateCheckingUser(username.value, password.value);
    }
  }

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

var form = (function () {
  var form = document.querySelector('.login__form');
  var submit = form.querySelector('.login__submit');

  /* Add listeners*/
  submit.addEventListener('click', validator.validate);

})();

var slider = (function () {
  var sliderWrap = document.querySelector('.slider');
  var controlRight = sliderWrap.querySelector('.slider__controls--next');
  var controlLeft = sliderWrap.querySelector('.slider__controls--prev');
  var slides = sliderWrap.querySelectorAll('.slider__item');
  var cnt = 0;
  var length = slides.length;
  var active = slides[0];
  var activeClass = 'slider__item--current';

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
