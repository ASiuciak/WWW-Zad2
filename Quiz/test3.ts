const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    Until = webdriver.until;

let driver = new webdriver.Builder()
    .forBrowser('chrome').build();


// Generujemy losowo nazwy użytkowników, aby zawsze dało się zalogować z dowolnym hasłem
let user1 =  Math.random().toString(36).substring(2, 15);
console.log(user1);


driver.get("http://localhost:3000");
driver.findElement(By.id("login")).sendKeys(user1);
driver.findElement(By.id("password")).sendKeys("randomPassword");
driver.findElement(By.id("sub")).click();

function randomInt(min, max) {
	return min + Math.floor((max - min) * Math.random());
}

// Wciska przycisk, jeśli ten pojawi się na stronie w określonym czasie.
function clickWhenClickable(locator, timeout){
    return driver.wait(function(){
      return driver.findElement(locator).then(function(element){
        return element.click().then(function(){
          return true;
        }, function(err){
          return false;
        })
      }, function(err){
        return false;
      });
    }, timeout, 'Timeout waiting for ' + locator.value);    ;
  }

function solveTask() {
  driver.findElement(By.id("input")).sendKeys(randomInt(1, 100))
}

clickWhenClickable(By.id("qz"), 5000).then(() => {
  clickWhenClickable(By.id("q2"), 5000).then(() => {
    setTimeout(function() {
      solveTask()
      clickWhenClickable(By.id("nxt"), 5000).then(() => {
        setTimeout(function() {
          solveTask()
          clickWhenClickable(By.id("nxt"), 5000).then(() => {
            setTimeout(function() {
              solveTask()
              clickWhenClickable(By.id("stop"), 5000).then(() => {
                console.log("ok")
              })
            }, 6000)
          })
        }, 1000)
      })
    }, 3000)
  })
})