# System ekspertowy dla banku
System predyktuje, czy dany klient banku kwalifikuje się do otrzymania pożyczki/kredytu. <br>
Zbiór danych: https://www.kaggle.com/datasets/janiobachmann/bank-marketing-dataset

Założenia:
1. Działamy na danych tekstowych, nie na zdjęciach
2. Aplikacja ma być webowa
3. Nie bawimy się w uwierzytelnianie i tworzenie wielu użytkowników
4. Szyfrujemy dane wymieniane między frontendem i backendem
5. Model uczenia maszynowego działa na serwerze
6. Tworzymy testy automatyczne dla kodu backend i frontend

Aplikacja webowa podzielona na 2 sekcje, które zapewniają:
1. Uczenie (scenariusz pozytywny - nadpisanie starego modelu)
    - użytkownik wczytuje zbiór danych z komputera (button "Wczytaj zbiór danych")
    - użytkownik uruchamia uczenie algorytmu (button "Ucz się"), po czym dane są szyfrowane (HTTPS wystarczy?) i wysyłane na serwer (POST)
    - użytkownik widzi indykator ładowania, w tym czasie na serwerze w kodzie backendowym uczony jest model
    - użytkownik otrzymuje informacje z powodzeniem operacji, wyświetlana jest aktualna dokładność oraz komunikat "czy nadpisać stary model?"
    - użytkownik wybiera nadpisanie modelu, po czym na serwer wysyłana jest informacja, że stary model ma zostać nadpisany
2. Predykcja (scenariusz pozytywny)
    - użytkownik wypełnia formularz (textboxy, slidery i inne zabawki)
    - użytkownik klika button "Zatwierdź", po czym dane o próbce są wysyłane na serwer
    - użytkownik widzi indykator ładowania, w tym czasie na serwerze predyktowany jest wynik
    - wyświetlona zostaje informacja z predykcją/klasyfikacją dla danej próbki
    
Scenariusz negatywny to wyświetlenie błędu (złe dane, błąd serwera, itp.), wtedy wyświetlane jest okienko z kodem błędu i informacją. 

Do ustalenia:
1. Czy decydujemy się na ten zbiór danych?
2. W czym piszemy backend i ML (Javascript, Python?)
3. Czy korzystamy z frameworka do frontu?
4. Czy skorzystanie z protokołu TLS będzie wystarczające, aby spełnić wymóg szyfrowania?
5. ...

![Makieta](img/ui.png)
