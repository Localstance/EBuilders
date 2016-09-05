var MD5 = function (string) {

  function RotateLeft(lValue, iShiftBits) {
    return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
  }

  function AddUnsigned(lX,lY) {
    var lX4,lY4,lX8,lY8,lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  }

  function F(x,y,z) { return (x & y) | ((~x) & z); }
  function G(x,y,z) { return (x & z) | (y & (~z)); }
  function H(x,y,z) { return (x ^ y ^ z); }
  function I(x,y,z) { return (y ^ (x | (~z))); }

  function FF(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };

  function GG(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };

  function HH(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };

  function II(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };

  function ConvertToWordArray(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1=lMessageLength + 8;
    var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
    var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
    var lWordArray=Array(lNumberOfWords-1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while ( lByteCount < lMessageLength ) {
      lWordCount = (lByteCount-(lByteCount % 4))/4;
      lBytePosition = (lByteCount % 4)*8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount-(lByteCount % 4))/4;
    lBytePosition = (lByteCount % 4)*8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
    lWordArray[lNumberOfWords-2] = lMessageLength<<3;
    lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
    return lWordArray;
  };

  function WordToHex(lValue) {
    var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
    for (lCount = 0;lCount<=3;lCount++) {
      lByte = (lValue>>>(lCount*8)) & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
    }
    return WordToHexValue;
  };

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }

    return utftext;
  };

  var x=Array();
  var k,AA,BB,CC,DD,a,b,c,d;
  var S11=7, S12=12, S13=17, S14=22;
  var S21=5, S22=9 , S23=14, S24=20;
  var S31=4, S32=11, S33=16, S34=23;
  var S41=6, S42=10, S43=15, S44=21;

  string = Utf8Encode(string);

  x = ConvertToWordArray(string);

  a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

  for (k=0;k<x.length;k+=16) {
    AA=a; BB=b; CC=c; DD=d;
    a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
    d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
    c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
    b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
    a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
    d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
    c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
    b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
    a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
    d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
    c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
    b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
    a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
    d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
    c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
    b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
    a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
    d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
    c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
    b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
    a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
    d=GG(d,a,b,c,x[k+10],S22,0x2441453);
    c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
    b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
    a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
    d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
    c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
    b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
    a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
    d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
    c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
    b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
    a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
    d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
    c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
    b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
    a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
    d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
    c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
    b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
    a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
    d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
    c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
    b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
    a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
    d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
    c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
    b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
    a=II(a,b,c,d,x[k+0], S41,0xF4292244);
    d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
    c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
    b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
    a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
    d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
    c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
    b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
    a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
    d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
    c=II(c,d,a,b,x[k+6], S43,0xA3014314);
    b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
    a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
    d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
    c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
    b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
    a=AddUnsigned(a,AA);
    b=AddUnsigned(b,BB);
    c=AddUnsigned(c,CC);
    d=AddUnsigned(d,DD);
  }

  var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

  return temp.toLowerCase();
}
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
