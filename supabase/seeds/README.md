# Wolna Mata — baza kandydatów 2026

Stan badania: **13 sierpnia 2026**. Zakres: nadchodzące wydarzenia w Polsce do końca 2026 roku, istotne dla BJJ, submission grapplingu i społeczności Wolnej Maty.

## Zawartość

- 5 obozów,
- 2 seminaria,
- 29 zawodów,
- łącznie 36 rekordów zgodnych z tabelą `events` w repozytorium `damtio/ADCC`.

Pakiet SQL: `wolnamata-events-2026-import.sql`.

## Zasady jakości

1. Wszystkie rekordy mają `published = false`.
2. Import jest idempotentny dzięki `ON CONFLICT (slug) DO NOTHING`.
3. Brakujące godziny, ceny, adresy i profile społecznościowe pozostają `NULL`; nie zostały wymyślone.
4. Istniejących 21 wydarzeń widocznych na `wolnamata.pl/pl` nie dodawano ponownie.
5. `registration_url` prowadzi do strony organizatora albo platformy rejestracyjnej.
6. Rekordy wymagają krótkiej kontroli redakcyjnej bezpośrednio przed publikacją, ponieważ terminy i status zapisów mogą się zmieniać.

## Główne źródła

- MartialMatch — oficjalne strony rejestracji i szczegóły zawodów: https://martialmatch.com/pl/events
- ADCC News — ADCC Amateur World Championship: https://adcombat.com/adcc-events/adcc-amateur-world-championship-2026/
- eBilet — ADCC World Championship: https://www.ebilet.pl/sport/sporty-walki/adcc-world-championship
- Polski Związek Zapaśniczy — kalendarz grapplingu: https://zapasy.org.pl/i/grappling/102
- Berserkers Team — BT Camp: https://berserkersteam.pl/bt-camp-oboz-berserkers-team-17-24-sierpnia-2026/
- Mocni Zawodnicy — camp BJJ: https://mocnizawodnicy.pl/
- BJJ Globetrotters — Zen Camp: https://www.bjjglobetrotters.com/zencamp2026
- Rio Fit & Chill Camp: https://riofitcamp.pl/
- KMCenter — Combat Camp: https://kmcenter.pl/events/combat-camp-sierpien-2026/
- Ffion Davies Seminar — karta wydarzenia i formularz organizatora: https://happeningnext.com/event/ffion-davies-open-no-gi-seminar-in-warsaw-eid3a0dm9ksq8

## Kontrola przed importem

- Zweryfikować, czy wydarzenia zaczynające się 13–17 sierpnia nadal przyjmują uczestników.
- Potwierdzić aktualny status Ground Game Cup 9; wcześniejsze listy pokazywały 24 października, natomiast aktualna nazwa wydarzenia wskazuje nowy termin 21 listopada.
- Potwierdzić dokładne miejsce ADCC Polish Cup 2026.
- Przy Zen Camp pozostawić informację o wyprzedaniu miejsc w opisie lub zdecydować, czy wydarzenia `sold out` mają być widoczne.
- Sprawdzić cenę „od” dla ADCC World Championship — 230,90 PLN pochodzi z aktualnej strony biletowej i może się zmienić.

## Zalecany sposób użycia

Uruchomić skrypt najpierw w środowisku testowym Supabase. Następnie przejrzeć wpisy w panelu `/admin`, uzupełnić grafiki i brakujące dane, po czym publikować selektywnie. Skrypt nie modyfikuje ani nie usuwa istniejących wydarzeń.


# Kandydaci akademii dla Wolnej Maty

Stan weryfikacji: **13 sierpnia 2026**.

Pakiet `wolnamata-academies-import.sql` dodaje 16 akademii spoza obecnej krakowskiej bazy. Każdy rekord ma `published = false`, dlatego po imporcie pojawi się w panelu administracyjnym, ale nie na publicznej stronie.

## Pokrycie

- Warszawa: 1
- Poznań: 2
- Wrocław: 2
- Szczecin: 1
- Suwałki: 1
- Kołobrzeg: 1
- Lublin: 2
- Częstochowa, Dąbrowa Górnicza, Otmuchów, Zawiercie, Oława i Krośnice: po 1

## Źródła

- oficjalna lista klubów Rio Grappling Club Polska: https://riograpplingclub.pl/kluby/
- oficjalne strony filii Berserkers Team: https://berserkersteam.pl/nasze-filie/
- Rio Grappling Wrocław: https://bjj.wroclaw.pl/
- Next Level Wrocław: https://www.bjjwroclaw.com/
- Gameness Team: https://www.gamenessteam.pl/
- K.S. Anakonda Poznań: https://bjj-poznan.pl/
- Shootfighters Lublin: https://mma-lublin.com/bjj.html
- Copacabana Lublin: https://copacabanalublin.pl/kontakt/
- Copacabana Warszawa: https://www.copacabana.studio/

## Kontrola redakcyjna

Przed zatwierdzeniem należy wejść na stronę każdego klubu i potwierdzić aktualny adres, aktywność sekcji BJJ, formułę Gi/No-Gi oraz możliwość wejścia gościnnego. Współrzędne pozostawiono puste celowo; warto uzupełnić je dopiero po potwierdzeniu adresu.

## Kolejność importu

1. `wolnamata-events-2026-import.sql`
2. `wolnamata-events-2026-bilingual.sql`
3. `wolnamata-academies-import.sql`

Dwujęzyczny skrypt używa konwencji `Polski tytuł / English title`. Opis pozostaje jednym tekstem: pełny polski akapit, pusta linia i pełny angielski akapit — bez etykiet językowych. Jest to rozwiązanie kompatybilne z obecnym pojedynczym polem `title` i `description`.
