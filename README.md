# WWW-Zad2

Aplikacja z quizami algebraicznymi. Przed jej uruchomieniem należy wywołać skrypt tworzący bazę danych przechowującą quizy, loginy, hasła i podejścia do quizów użytkowników poleceniem: <b>npm run createdb</b>. Aplikację uruchamia polecenie <b>npm run app</b>, będzie ona wtedy dostępna w porcie 3000 localhosta. Strona nie posiada mechanizmu zakładania kont, aby się zalogować wystarczy wpisać w formularzu logowania wymyśloną nazwę użytkownika i hasło (można je potem zmienić). Można też skorzystać z utworzonych razem z bazą kont user1/user1 i user2/user2. Po uruchomieniu aplikacji, można wywołac testy w Selenium z innego terminala, poleceniem <b>npm run test</b>. Do ich wykonania wymagamy jest <b>Chromedriver</b>, umieszczony w katalogu głównym aplikacji. \
<b>Test 1:</b>
* zakłada konto użytkownika o losowej nazwie, zmienia hasło, loguje się ponownie (z nowym hasłem), zmienia ciasteczko na to aktualne dla starego hasła, po odświeżeniu strony jesteśmy znowu wylogowani. Wypisuje na konsoli oba ciasteczka (z sesji ze starym i nowym hasłem), widzimy, że róźnią się one wartością. \
<b>Test 2:</b>
* zakłada konto użytkownika o losowej nazwie, rozwiązuje quiz nr 2 (wpisuje losowe odpowiedzi), następnie próbuje rozwiązać ten sam quiz ponownie na tym samym koncie. Kończy się to niepowodzeniem, strona wyświetla alert informujący o błędzie. \
<b>Test 3:</b>
* zakłada konto użytkownika o losowej nazwie, rozwiązuje quiz nr 2 (wpisuje losowe odpowiedzi) przez 10 sekund, wciska przycisk "Stop", kończy na stronie z wynikami. Podczas wykonywania quizu można uruchomić zakładkę <b> Network </b> w Inspectorze i odczytać informację o requeście wysyłanym do serwera po ukończeniu quizu (metoda POST, odpowiedzi i procentowe czasy spędzone nad każdym pytaniem - w liczbach zmiennoprzecinkowych sumujących się do 1) \
<b> UWAGA! </b> \
Wywołanie <b> npm run test </b> oprócz uruchomienia ww. testów, czyści bazę danych, zostawia tylko dane wpisywane przez <b> npm run createdb </b>, czyli quizy i 2 konta: user1/user1, user2/user2.
