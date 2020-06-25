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

// Rozwiązuje quiz nr 2 wpisując losowe wartości. Zwraca przycisk "STOP" 
// ( w formie gotowej do wciśnięcia funkcją clickWhenClickable)
function solveQuiz2() {
    return new Promise(function(resolve, reject){
        driver.findElement(By.id("input")).sendKeys(randomInt(1, 100))
        clickWhenClickable(By.id("nxt"), 5000).then(() => {
            driver.findElement(By.id("input")).sendKeys(randomInt(1, 100))
            clickWhenClickable(By.id("nxt"), 5000).then(() => {
                driver.findElement(By.id("input")).sendKeys(randomInt(1, 100))
                resolve(By.id("stop"))
            }).catch(() => {
                reject(new Error("next button"))
            })
        }).catch(() => {
            reject(new Error("next button"))
        })
    })
}

/* Wchodzimy do menu, robimy quiz nr 2 ,po czym ponownie próbujemy go wykonać na tym samym koncie.
 * Po wykonaniu tych operacji przeglądarka powinna wyświetlić alert "Zrobiłeś już ten quiz". */
clickWhenClickable(By.id("qz"), 5000).then(() => {
    clickWhenClickable(By.id("q2"), 5000).then(() => {
        solveQuiz2().then((res) => {
            clickWhenClickable(res, 5000).then(() => {
                clickWhenClickable(By.id("back"), 5000).then(() => {
                    clickWhenClickable(By.id("q2"), 5000).then(() => {
                        console.log("ok")
                    }).catch((err) => {
                        console.error(err)
                    })
                }).catch((err) => {
                    console.error(err)
                })
            }).catch((err) => {
                console.error(err)
            })
        }).catch((err) => {
            console.error(err)
        })
    }).catch((err) => {
        console.error(err)
    })
}).catch((err) => {
    console.error(err)
})