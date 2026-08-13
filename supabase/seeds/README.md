# Wolna Mata â€” baza kandydatÃ³w 2026

Stan badania: **13 sierpnia 2026**. Zakres: nadchodzÄ…ce wydarzenia w Polsce do koÅ„ca 2026 roku, istotne dla BJJ, submission grapplingu i spoÅ‚ecznoÅ›ci Wolnej Maty.

## ZawartoÅ›Ä‡

- 5 obozÃ³w,
- 2 seminaria,
- 29 zawodÃ³w,
- Å‚Ä…cznie 36 rekordÃ³w zgodnych z tabelÄ… `events` w repozytorium `damtio/ADCC`.

Pakiet SQL: `wolnamata-events-2026-import.sql`.

## Zasady jakoÅ›ci

1. Wszystkie rekordy majÄ… `published = false`.
2. Import jest idempotentny dziÄ™ki `ON CONFLICT (slug) DO NOTHING`.
3. BrakujÄ…ce godziny, ceny, adresy i profile spoÅ‚ecznoÅ›ciowe pozostajÄ… `NULL`; nie zostaÅ‚y wymyÅ›lone.
4. IstniejÄ…cych 21 wydarzeÅ„ widocznych na `wolnamata.pl/pl` nie dodawano ponownie.
5. `registration_url` prowadzi do strony organizatora albo platformy rejestracyjnej.
6. Rekordy wymagajÄ… krÃ³tkiej kontroli redakcyjnej bezpoÅ›rednio przed publikacjÄ…, poniewaÅ¼ terminy i status zapisÃ³w mogÄ… siÄ™ zmieniaÄ‡.

## GÅ‚Ã³wne ÅºrÃ³dÅ‚a

- MartialMatch â€” oficjalne strony rejestracji i szczegÃ³Å‚y zawodÃ³w: https://martialmatch.com/pl/events
- ADCC News â€” ADCC Amateur World Championship: https://adcombat.com/adcc-events/adcc-amateur-world-championship-2026/
- eBilet â€” ADCC World Championship: https://www.ebilet.pl/sport/sporty-walki/adcc-world-championship
- Polski ZwiÄ…zek ZapaÅ›niczy â€” kalendarz grapplingu: https://zapasy.org.pl/i/grappling/102
- Berserkers Team â€” BT Camp: https://berserkersteam.pl/bt-camp-oboz-berserkers-team-17-24-sierpnia-2026/
- Mocni Zawodnicy â€” camp BJJ: https://mocnizawodnicy.pl/
- BJJ Globetrotters â€” Zen Camp: https://www.bjjglobetrotters.com/zencamp2026
- Rio Fit & Chill Camp: https://riofitcamp.pl/
- KMCenter â€” Combat Camp: https://kmcenter.pl/events/combat-camp-sierpien-2026/
- Ffion Davies Seminar â€” karta wydarzenia i formularz organizatora: https://happeningnext.com/event/ffion-davies-open-no-gi-seminar-in-warsaw-eid3a0dm9ksq8

## Kontrola przed importem

- ZweryfikowaÄ‡, czy wydarzenia zaczynajÄ…ce siÄ™ 13â€“17 sierpnia nadal przyjmujÄ… uczestnikÃ³w.
- PotwierdziÄ‡ aktualny status Ground Game Cup 9; wczeÅ›niejsze listy pokazywaÅ‚y 24 paÅºdziernika, natomiast aktualna nazwa wydarzenia wskazuje nowy termin 21 listopada.
- PotwierdziÄ‡ dokÅ‚adne miejsce ADCC Polish Cup 2026.
- Przy Zen Camp pozostawiÄ‡ informacjÄ™ o wyprzedaniu miejsc w opisie lub zdecydowaÄ‡, czy wydarzenia `sold out` majÄ… byÄ‡ widoczne.
- SprawdziÄ‡ cenÄ™ â€žodâ€ dla ADCC World Championship â€” 230,90 PLN pochodzi z aktualnej strony biletowej i moÅ¼e siÄ™ zmieniÄ‡.

## Zalecany sposÃ³b uÅ¼ycia

UruchomiÄ‡ skrypt najpierw w Å›rodowisku testowym Supabase. NastÄ™pnie przejrzeÄ‡ wpisy w panelu `/admin`, uzupeÅ‚niÄ‡ grafiki i brakujÄ…ce dane, po czym publikowaÄ‡ selektywnie. Skrypt nie modyfikuje ani nie usuwa istniejÄ…cych wydarzeÅ„.

# Kandydaci akademii dla Wolnej Maty

Stan weryfikacji: **13 sierpnia 2026**.

Pakiet `wolnamata-academies-import.sql` dodaje 16 akademii spoza obecnej krakowskiej bazy. KaÅ¼dy rekord ma `published = false`, dlatego po imporcie pojawi siÄ™ w panelu administracyjnym, ale nie na publicznej stronie.

## Pokrycie

- Warszawa: 1
- PoznaÅ„: 2
- WrocÅ‚aw: 2
- Szczecin: 1
- SuwaÅ‚ki: 1
- KoÅ‚obrzeg: 1
- Lublin: 2
- CzÄ™stochowa, DÄ…browa GÃ³rnicza, OtmuchÃ³w, Zawiercie, OÅ‚awa i KroÅ›nice: po 1

## Å¹rÃ³dÅ‚a

- oficjalna lista klubÃ³w Rio Grappling Club Polska: https://riograpplingclub.pl/kluby/
- oficjalne strony filii Berserkers Team: https://berserkersteam.pl/nasze-filie/
- Rio Grappling WrocÅ‚aw: https://bjj.wroclaw.pl/
- Next Level WrocÅ‚aw: https://www.bjjwroclaw.com/
- Gameness Team: https://www.gamenessteam.pl/
- K.S. Anakonda PoznaÅ„: https://bjj-poznan.pl/
- Shootfighters Lublin: https://mma-lublin.com/bjj.html
- Copacabana Lublin: https://copacabanalublin.pl/kontakt/
- Copacabana Warszawa: https://www.copacabana.studio/

## Kontrola redakcyjna

Przed zatwierdzeniem naleÅ¼y wejÅ›Ä‡ na stronÄ™ kaÅ¼dego klubu i potwierdziÄ‡ aktualny adres, aktywnoÅ›Ä‡ sekcji BJJ, formuÅ‚Ä™ Gi/No-Gi oraz moÅ¼liwoÅ›Ä‡ wejÅ›cia goÅ›cinnego. WspÃ³Å‚rzÄ™dne pozostawiono puste celowo; warto uzupeÅ‚niÄ‡ je dopiero po potwierdzeniu adresu.

## KolejnoÅ›Ä‡ importu

1. `wolnamata-events-2026-import.sql`
2. `wolnamata-events-2026-bilingual.sql`
3. `wolnamata-academies-import.sql`

DwujÄ™zyczny skrypt uÅ¼ywa konwencji `Polski tytuÅ‚ / English title`. Opis pozostaje jednym tekstem: peÅ‚ny polski akapit, pusta linia i peÅ‚ny angielski akapit â€” bez etykiet jÄ™zykowych. Jest to rozwiÄ…zanie kompatybilne z obecnym pojedynczym polem `title` i `description`.

