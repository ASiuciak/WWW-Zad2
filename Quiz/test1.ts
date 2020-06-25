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

let locator = By.id("cng");


/* Zapisujemy ciasteczko, zmieniany hasło, logujemy się ponownie z nowym hasłem.
 * Następnie zamieniamy aktualne ciasteczko na to pierwsze (zapisane).
 * Po odświeżeniu strony będziemy wylogowani.
 * Wypisuje na konsoli oba ciasteczka (sprzed zmiany hasła i po niej)
 * Możmy zauważyć, że różnią się one wartością. */
driver.manage().getCookie("sess").then((cookie) => {
    console.log(cookie);
    clickWhenClickable(locator, 5000).then((res) => {
      if(res) {
          let locator1 = By.id("cng2");
          driver.findElement(By.id("new1")).sendKeys("newPassword");
          driver.findElement(By.id("new2")).sendKeys("newPassword");
          clickWhenClickable(locator1, 5000).then((res1) => {
            if(res1) {
              driver.findElement(By.id("login")).sendKeys(user1);
              driver.findElement(By.id("password")).sendKeys("newPassword");
              clickWhenClickable(By.id("sub"), 5000).then((res2) => {
                driver.manage().deleteAllCookies();
                driver.manage().addCookie({name: cookie["name"], value: cookie["value"]});
                driver.navigate().refresh();
                driver.manage().getCookie("sess").then((cookie1) => {
                  if(res) {
                    console.log(cookie1);
                  }
                }).catch(() => {
                  console.log("Error in getting new cookie");
                })
              }).catch(() => {
                console.log("Error in logging after password change");
              })
            }
          }).catch(() => {
            console.log("error in changing password");
          })
      }
    }).catch(() => {
      console.log("error in changing password");
    })
}).catch(() => {
  console.log("Error in getting old cookie");
})

