'use strict'

var curlconverter = require('curlconverter')

document.addEventListener('DOMContentLoaded', function () {
  var hash = window.location.hash.replace('#', '')
  if (hash === 'node') {
    changeLanguage('node')
  } else if (hash === 'php') {
    changeLanguage(('php'))
  }

  var curlCodeInput = document.getElementById('curl-code')
  curlCodeInput.addEventListener('keyup', convert)

  // listen for change in select
  var languageSelect = document.getElementById('language')
  languageSelect.addEventListener('change', function () {
    var language = document.getElementById('language').value
    changeLanguage(language)
    if (document.getElementById('curl-code').value) {
      convert()
    }
  })

  var getExample = document.getElementById('get-example')
  getExample.addEventListener('click', function () {
    showExample("curl 'http://en.wikipedia.org/' -H 'Accept-Encoding: gzip, deflate, sdch' " +
      "-H 'Accept-Language: en-US,en;q=0.8' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36' " +
      "-H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' " +
      "-H 'Referer: http://www.wikipedia.org/' " +
      " -H 'Connection: keep-alive' --compressed")
  })

  var postExample = document.getElementById('post-example')
  postExample.addEventListener('click', function () {
    showExample("curl 'http://fiddle.jshell.net/echo/html/' -H 'Origin: http://fiddle.jshell.net' " +
      "-H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: en-US,en;q=0.8' " +
      "-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/39.0.2171.95 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' " +
      "-H 'Accept: */*' -H 'Referer: http://fiddle.jshell.net/_display/' -H 'X-Requested-With: XMLHttpRequest' " +
      "-H 'Connection: keep-alive' --data 'msg1=wow&msg2=such' --compressed")
  })

  var basicAuthExample = document.getElementById('basic-auth-example')
  basicAuthExample.addEventListener('click', function () {
    showExample('curl "https://api.test.com/" -u "some_username:some_password"')
  })
})

/*
single point of truth in the dom, YEEEE HAWWWW
 */
var changeLanguage = function (language) {
  var generatedCodeTitle = document.getElementById('generated-code-title')

  if (language === 'node') {
    generatedCodeTitle.innerHTML = 'Node.js'
  } else if (language === 'php') {
    generatedCodeTitle.innerHTML = 'PHP requests'
  } else {
    generatedCodeTitle.innerHTML = 'Python requests'
  }
  window.location.hash = '#' + language
  var languageSelect = document.getElementById('language')
  languageSelect.value = language

  return language
}

var getLanguage = function () {
  var languageSelect = document.getElementById('language')
  return languageSelect.value
}

var convert = function () {
  var curlCode = document.getElementById('curl-code').value
  var generatedCode
  if (curlCode.indexOf('curl') === -1) {
    generatedCode = 'Could not parse curl command.'
  } else {
    try {
      var language = getLanguage()
      if (language === 'node') {
        generatedCode = curlconverter.toNode(curlCode)
        window['ga']('send', 'event', 'convertcode', 'tonode')
      } else if (language === 'php') {
        generatedCode = curlconverter.toPhp(curlCode)
        window['ga']('send', 'event', 'convertcode', 'tophp')
      } else {
        generatedCode = curlconverter.toPython(curlCode)
        window['ga']('send', 'event', 'convertcode', 'topython')
      }
      hideIssuePromo()
    } catch (e) {
      console.log(e)
      if (curlCode.indexOf('curl') !== 0) {
        generatedCode = 'Error parsing curl command. Your input should start with the word "curl"'
      } else {
        generatedCode = 'Error parsing curl command.'
      }
      window['ga']('send', 'event', 'convertcode', 'parseerror')
      showIssuePromo()
    }
  }
  document.getElementById('generated-code').value = generatedCode
}

var showIssuePromo = function () {
  document.getElementById('issue-promo').style.display = 'inline-block'
}

var hideIssuePromo = function () {
  document.getElementById('issue-promo').style.display = 'none'
}

var showExample = function (code) {
  document.getElementById('curl-code').value = code
  convert()
}
