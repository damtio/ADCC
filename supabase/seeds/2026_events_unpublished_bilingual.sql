-- Wolna Mata: kandydaci do importu, stan weryfikacji 2026-08-13.
-- Struktura zgodna z damtio/ADCC: public.events.
-- Wszystkie wpisy pozostajÄ… nieopublikowane do rÄ™cznej kontroli redakcyjnej.
-- Idempotencja: ponowne uruchomienie nie nadpisuje rekordÃ³w o istniejÄ…cym slugu.

INSERT INTO events (
  slug, title, category, description, instructor, organizer, academy,
  city, address, latitude, longitude, date, end_date, start_time, end_time,
  price, currency, registration_url, facebook_url, instagram_url, image_url,
  published
) VALUES
-- OBOZY
(
  'combat-camp-sierpien-2026',
  'Combat Camp SierpieÅ„ 2026',
  'Camp',
  'Czterodniowy obÃ³z sparingowo-mentalny z trzema sesjami treningowymi dziennie. SzczegÃ³Å‚y programu i dostÄ™pnoÅ›ci miejsc znajdujÄ… siÄ™ na stronie organizatora.',
  NULL, 'KMCenter', NULL,
  'Nowa SÅ‚upia', 'OÅ›rodek GoÅ‚oborze, Nowa SÅ‚upia', NULL, NULL,
  '2026-08-13', '2026-08-16', NULL, NULL,
  1799, 'PLN', 'https://kmcenter.pl/events/combat-camp-sierpien-2026/', NULL, NULL, NULL,
  false
),
(
  'rio-fit-and-chill-camp-2026',
  'Rio Fit & Chill Camp 2026',
  'Camp',
  'Weekendowy obÃ³z sportowo-rekreacyjny organizowany przez Rio Grappling Club CzÄ™stochowa. Program Å‚Ä…czy aktywnoÅ›Ä‡ fizycznÄ…, samoobronÄ™ i regeneracjÄ™.',
  NULL, 'Rio Grappling Club CzÄ™stochowa', 'Rio Grappling Club CzÄ™stochowa',
  'KaÅ‚uÅ¼e', 'Rzeka Miodu, KaÅ‚uÅ¼e 21, 98-335 KaÅ‚uÅ¼e', NULL, NULL,
  '2026-08-16', '2026-08-18', NULL, NULL,
  900, 'PLN', 'https://riofitcamp.pl/', NULL, NULL, NULL,
  false
),
(
  'bt-camp-berserkers-team-2026',
  'BT Camp â€“ ObÃ³z Berserkers Team 2026',
  'Camp',
  'Tygodniowy obÃ³z sportÃ³w walki z treningami BJJ, submission fighting, zapasÃ³w, MMA i muay thai. Organizator przewiduje trzy treningi dziennie oraz osobny program dla dzieci.',
  NULL, 'Berserkers Team', 'Berserkers Team',
  'Borowice', 'OÅ›rodek HOTTUR, Borowice, Karkonosze', NULL, NULL,
  '2026-08-17', '2026-08-24', '14:00', NULL,
  2350, 'PLN', 'https://berserkersteam.pl/bt-camp-oboz-berserkers-team-17-24-sierpnia-2026/', NULL, NULL, NULL,
  false
),
(
  'mocni-zawodnicy-2-camp-bjj-2026',
  'Mocni Zawodnicy 2 â€“ Camp BJJ',
  'Camp',
  'ObÃ³z BJJ i grapplingu nad Jeziorem Å»ywieckim, obejmujÄ…cy treningi, seminarium BJJ Gi z Bartoszem Zawadzkim oraz dodatkowe aktywnoÅ›ci integracyjne.',
  'Bartosz Zawadzki', 'Mocni Zawodnicy', NULL,
  'Tresna', 'Tresna, okolice Jeziora Å»ywieckiego', NULL, NULL,
  '2026-09-17', '2026-09-20', NULL, NULL,
  NULL, 'PLN', 'https://mocnizawodnicy.pl/', NULL, NULL, NULL,
  false
),
(
  'bjj-globetrotters-zen-camp-2026',
  'BJJ Globetrotters Zen Camp 2026',
  'Camp',
  'SzeÅ›ciodniowy miÄ™dzynarodowy obÃ³z BJJ Gi i No-Gi z zajÄ™ciami, open matami, jogÄ… i warsztatami. WedÅ‚ug strony organizatora miejsca sÄ… wyprzedane.',
  NULL, 'BJJ Globetrotters', NULL,
  'Stara WieÅ›', 'Stara WieÅ› 1, 97-570 Stara WieÅ›', NULL, NULL,
  '2026-10-05', '2026-10-11', NULL, NULL,
  NULL, 'EUR', 'https://www.bjjglobetrotters.com/zencamp2026', NULL, NULL, NULL,
  false
),

-- SEMINARIA
(
  'ffion-davies-open-no-gi-seminar-warsaw-2026',
  'Ffion Davies Open No-Gi Seminar',
  'Seminar - NoGi',
  'Otwarte seminarium No-Gi z mistrzyniÄ… Å›wiata IBJJF i ADCC, przeznaczone dla uczestnikÃ³w niezaleÅ¼nie od poziomu zaawansowania.',
  'Ffion Davies', 'Babskie Jiu Jitsu', 'Copacabana Team Warszawa',
  'Warszawa', 'Copacabana Team, ul. GaraÅ¼owa 4, Warszawa', NULL, NULL,
  '2026-09-06', NULL, '13:00', '16:00',
  200, 'PLN', 'https://forms.gle/eJS3fYjL8qEZSPDZ6', NULL, NULL, NULL,
  false
),
(
  'seminarium-zasad-ibjjf-lukasz-winiarski-2026',
  'Seminarium z zasad IBJJF',
  'Seminar - Gi + NoGi',
  'Otwarte szkolenie z zasad IBJJF organizowane przed XXIV Pucharem Polski BJJ. Organizator zapowiada udziaÅ‚ zarÃ³wno dla zawodnikÃ³w, jak i trenerÃ³w; dalsze szczegÃ³Å‚y majÄ… zostaÄ‡ podane pÃ³Åºniej.',
  'Åukasz Winiarski', 'Puchar Polski BJJ', NULL,
  'Warszawa', 'OSiR WÅ‚ochy, ul. GÅ‚adka 18, Warszawa', NULL, NULL,
  '2026-09-18', NULL, NULL, NULL,
  NULL, 'PLN', 'https://martialmatch.com/pl/events/814-xxiv-puchar-polski-bjj', NULL, NULL, NULL,
  false
),

-- ZAWODY
(
  'solt-18-mistrzostwa-polski-2026-no-gi',
  'SOLT 18 x DZIK: Mistrzostwa Polski 2026 No-Gi',
  'Tournament',
  'Mistrzostwa Polski w formule No-Gi organizowane w ramach Sub Only League. Kategorie, regulamin i aktualne terminy rejestracji znajdujÄ… siÄ™ na stronie wydarzenia.',
  NULL, 'Sub Only League', NULL,
  'Warszawa', 'OSiR WÅ‚ochy, Warszawa', NULL, NULL,
  '2026-09-05', NULL, NULL, NULL,
  NULL, 'PLN', 'https://martialmatch.com/en/events/650-solt-18-x-dzik-mistrzostwa-polski-2026-no-gi-', NULL, NULL, NULL,
  false
),
(
  'adcc-amateur-world-championship-2026',
  'ADCC Amateur World Championship 2026',
  'Tournament',
  'Amatorskie mistrzostwa Å›wiata ADCC odbywajÄ…ce siÄ™ dzieÅ„ przed gÅ‚Ã³wnym ADCC World Championship w Krakowie.',
  NULL, 'ADCC', NULL,
  'KrakÃ³w', 'TAURON Arena KrakÃ³w, ul. StanisÅ‚awa Lema 7, 31-571 KrakÃ³w', NULL, NULL,
  '2026-09-11', NULL, NULL, NULL,
  NULL, 'PLN', 'https://adcombat.com/adcc-events/adcc-amateur-world-championship-2026/', NULL, NULL, NULL,
  false
),
(
  'adcc-world-championship-2026-krakow',
  'ADCC Submission Fighting World Championship 2026',
  'Tournament',
  'Mistrzostwa Å›wiata ADCC w submission grapplingu, po raz pierwszy organizowane w Polsce.',
  NULL, 'ADCC Sp. z o.o.', NULL,
  'KrakÃ³w', 'TAURON Arena KrakÃ³w, ul. StanisÅ‚awa Lema 7, 31-571 KrakÃ³w', NULL, NULL,
  '2026-09-12', '2026-09-13', NULL, NULL,
  230.90, 'PLN', 'https://www.ebilet.pl/sport/sporty-walki/adcc-world-championship', NULL, NULL, NULL,
  false
),
(
  'project-roll-jiu-jitsu-7', 'Project Roll Jiu-Jitsu 7', 'Tournament',
  'Turniej BJJ Gi i No-Gi dla dzieci i dorosÅ‚ych. SzczegÃ³Å‚y kategorii i rejestracji znajdujÄ… siÄ™ na stronie wydarzenia.',
  NULL, NULL, NULL, 'Rybnik', 'JastrzÄ™bska 3b, 44-200 Rybnik', NULL, NULL,
  '2026-09-12', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/697-project-roll-jiu-jitsu-7', NULL, NULL, NULL, false
),
(
  'xxiv-puchar-polski-bjj', 'XXIV Puchar Polski BJJ', 'Tournament',
  'Dwudniowy Puchar Polski w Brazylijskim Jiu-Jitsu rozgrywany wedÅ‚ug zasad IBJJF.',
  NULL, NULL, NULL, 'Warszawa', 'OSiR WÅ‚ochy, ul. GÅ‚adka 18, Warszawa', NULL, NULL,
  '2026-09-19', '2026-09-20', NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/814-xxiv-puchar-polski-bjj', NULL, NULL, NULL, false
),
(
  'iii-otwarte-mistrzostwa-dolnego-slaska-bjj-2026', 'III Otwarte Mistrzostwa Dolnego ÅšlÄ…ska w BJJ Gi & No Gi', 'Tournament',
  'Otwarte zawody BJJ w formuÅ‚ach Gi i No-Gi.', NULL, NULL, NULL,
  'WoÅ‚Ã³w', 'Hala Sportowa, ul. PanieÅ„ska 4a, 56-100 WoÅ‚Ã³w', NULL, NULL,
  '2026-09-19', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/718-iii-otwarte-mistrzostwa-dolnego-slaska-w-bjj-gi-no-gi', NULL, NULL, NULL, false
),
(
  'ogolnopolska-liga-ju-jitsu-katowice-2026-09', 'OgÃ³lnopolska Liga Dzieci, MÅ‚odzieÅ¼y i DorosÅ‚ych w Ju-Jitsu', 'Tournament',
  'Zawody obejmujÄ…ce m.in. BJJ Gi, BJJ No-Gi oraz ne-waza.', NULL, NULL, NULL,
  'Katowice', 'ul. Alfreda 1, Katowice', NULL, NULL,
  '2026-09-20', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/975-ogolnopolska-liga-dzieci-mlodziezy-doroslych-w-ju-jitsu', NULL, NULL, NULL, false
),
(
  'xvi-puchar-polski-no-gi-jiu-jitsu-2026', 'XVI Puchar Polski No Gi Jiu Jitsu 2026', 'Tournament',
  'Puchar Polski No-Gi Jiu-Jitsu. Aktualne kategorie, opÅ‚aty i harmonogram dostÄ™pne sÄ… na stronie wydarzenia.', NULL, NULL, NULL,
  'PoznaÅ„', 'UAM Sport, ul. Zagajnikowa 9, PoznaÅ„', NULL, NULL,
  '2026-09-26', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/662-xvi-puchar-polski-no-gi-jiu-jitsu-2026', NULL, NULL, NULL, false
),
(
  'iii-open-fire-carioca-cup', 'III Open Fire Carioca Cup', 'Tournament',
  'Turniej BJJ Gi i No-Gi.', NULL, NULL, NULL, 'Mielec', NULL, NULL, NULL,
  '2026-09-26', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/917-iii-open-fire-carioca-cup', NULL, NULL, NULL, false
),
(
  'copa-14-gi-nogi', 'COPA 14 â€“ Gi & No-Gi', 'Tournament',
  'Turniej BJJ w formuÅ‚ach Gi i No-Gi.', NULL, NULL, NULL, 'Gliwice', NULL, NULL, NULL,
  '2026-09-26', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/966-copa-14---gi-nogi', NULL, NULL, NULL, false
),
(
  'puchar-polski-grappling-kamien-pomorski-2026', 'Puchar Polski w Grapplingu 2026', 'Tournament',
  'Puchar Polski w grapplingu dla kategorii dzieciÄ™cych, mÅ‚odzieÅ¼owych i seniorskich.', NULL, 'Polski ZwiÄ…zek ZapaÅ›niczy', NULL,
  'KamieÅ„ Pomorski', NULL, NULL, NULL,
  '2026-09-26', NULL, NULL, NULL, NULL, 'PLN',
  'https://zapasy.org.pl/i/grappling/102', NULL, NULL, NULL, false
),
(
  'bone-breakers-cup-2026', 'Bone Breakers Cup', 'Tournament',
  'Turniej submission only oraz BJJ Gi i No-Gi.', NULL, NULL, NULL, 'Å»agaÅ„', NULL, NULL, NULL,
  '2026-10-03', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/683-BoneB', NULL, NULL, NULL, false
),
(
  'koledzy-cup-vol-5', 'KOLEDZY CUP vol. 5 Gi & No-Gi', 'Tournament',
  'Turniej BJJ Gi i No-Gi.', NULL, 'Pantera Academy', 'Pantera Academy Katowice',
  'Katowice', 'Pantera Academy Katowice', NULL, NULL,
  '2026-10-03', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/1004-koledzy-cup-vol-5-gi-nogi', NULL, NULL, NULL, false
),
(
  'xvii-fight-grappler-cup-2026', 'XVII Turniej BJJ No-Gi Fight Grappler Cup 2026', 'Tournament',
  'Turniej BJJ No-Gi.', NULL, NULL, NULL, 'MiÅ„sk Mazowiecki', NULL, NULL, NULL,
  '2026-10-10', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/895-xvii-turnieju-bjj-no-gi-fight-grappler-cup-2026', NULL, NULL, NULL, false
),
(
  'open-baltic-cup-2026', 'Open Baltic Cup Gi & No-Gi', 'Tournament',
  'Turniej BJJ Gi i No-Gi.', NULL, NULL, NULL, 'Koszalin', 'Hala SportÃ³w Walki, ul. FaÅ‚ata 34, Koszalin', NULL, NULL,
  '2026-10-10', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/916-open-baltic-cup-gi-and-no-gi', NULL, NULL, NULL, false
),
(
  'taga-copa-poland-2026', 'TAGA COPA POLAND', 'Tournament',
  'Turniej BJJ No-Gi.', NULL, 'TAGA Competition', NULL, 'Tarnowo PodgÃ³rne', NULL, NULL, NULL,
  '2026-10-10', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/923-taga-copa-poland', NULL, NULL, NULL, false
),
(
  'iii-bjj-colored-belts-championships', 'III BJJ Colored Belts Championships', 'Tournament',
  'Turniej BJJ Gi i No-Gi dla kolorowych pasÃ³w.', NULL, NULL, NULL, 'Szczecin', NULL, NULL, NULL,
  '2026-10-10', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/1005-iii-mistrzostwa-bjj-w-kolorowych-pasach', NULL, NULL, NULL, false
),
(
  'fall-open-2026', 'Fall Open 2026 Gi & No-Gi Jiu Jitsu', 'Tournament',
  'Turniej BJJ Gi i No-Gi.', NULL, NULL, NULL, 'PoznaÅ„', 'UAM Sport, PoznaÅ„', NULL, NULL,
  '2026-10-17', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/710-fall-open-2026-gi-no-gi-jiu-jitsu', NULL, NULL, NULL, false
),
(
  'jelcz-laskowice-cup-iv', 'Jelcz-Laskowice Cup IV â€“ DolnoÅ›lÄ…ska Liga BJJ', 'Tournament',
  'Turniej BJJ Gi i No-Gi.', NULL, NULL, NULL, 'Jelcz-Laskowice', 'CSiR Jelcz-Laskowice', NULL, NULL,
  '2026-10-17', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/801-jelcz-laskowice-cup-iv---dolnoslaska-liga-bjj-gi-nogi', NULL, NULL, NULL, false
),
(
  'malopolska-liga-salt-cup-2026', 'MaÅ‚opolska Liga Jiu-Jitsu â€“ Salt Cup', 'Tournament',
  'Turniej BJJ Gi i No-Gi.', NULL, 'MaÅ‚opolska Liga Jiu-Jitsu', NULL, 'Wieliczka', NULL, NULL, NULL,
  '2026-10-24', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/692-malopolska-liga-jiu-jitsu-salt-cup', NULL, NULL, NULL, false
),
(
  'solt-19-dzik-gi-nogi', 'SOLT 19 x DZIK: Gi & No-Gi', 'Tournament',
  'Turniej Sub Only League w formuÅ‚ach Gi i No-Gi.', NULL, 'Sub Only League', NULL,
  'Opole', 'Stegu Arena, Opole', NULL, NULL,
  '2026-11-21', NULL, NULL, NULL, NULL, 'PLN',
  'https://subonlyleague.com/', NULL, NULL, NULL, false
),
(
  'malopolska-liga-cracow-cup-2026', 'MaÅ‚opolska Liga Jiu-Jitsu â€“ Cracow Cup', 'Tournament',
  'Turniej BJJ Gi i No-Gi.', NULL, 'MaÅ‚opolska Liga Jiu-Jitsu', NULL, 'KrakÃ³w', NULL, NULL, NULL,
  '2026-11-21', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/693-malopolska-liga-jiu-jitsu-cracow-cup', NULL, NULL, NULL, false
),
(
  'ground-game-cup-9-2026', 'Ground Game Cup 9 â€“ Baltic & Eastern Europe Championships', 'Tournament',
  'Turniej BJJ Gi i No-Gi. Wpis wykorzystuje nowy termin wskazany przez organizatora.', NULL, NULL, NULL, 'SuwaÅ‚ki', NULL, NULL, NULL,
  '2026-11-21', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/1013-ground-game-cup-9-baltic-eastern-europe-championships', NULL, NULL, NULL, false
),
(
  'ii-otwarty-puchar-dolnego-slaska-bjj-2026', 'II Otwarty Puchar Dolnego ÅšlÄ…ska w BJJ Gi & No-Gi', 'Tournament',
  'Otwarty turniej BJJ Gi i No-Gi.', NULL, NULL, NULL, 'Oborniki ÅšlÄ…skie', NULL, NULL, NULL,
  '2026-11-28', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/839-ii-otwarty-puchar-dolnego-slaska-w-bjj-gi-no-gi-2026', NULL, NULL, NULL, false
),
(
  'koga-cup-iii-2026', 'KOGA CUP III: Gi & No-Gi', 'Tournament',
  'Turniej BJJ Gi i No-Gi.', NULL, NULL, NULL, 'ElblÄ…g', NULL, NULL, NULL,
  '2026-11-28', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/959-koga-cup-iii-gi-no-gi', NULL, NULL, NULL, false
),
(
  'sigma-league-viii-2026', 'Sigma League VIII Jiu Jitsu Gi & No-Gi', 'Tournament',
  'Turniej BJJ Gi i No-Gi.', NULL, 'Sigma League', NULL, 'Sosnowiec', NULL, NULL, NULL,
  '2026-11-29', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/746-SLVIII', NULL, NULL, NULL, false
),
(
  'adcc-polish-cup-2026', 'ADCC Polish Cup 2026', 'Tournament',
  'Puchar Polski rozgrywany wedÅ‚ug zasad ADCC.', NULL, 'ADCC Poland', NULL, 'Warszawa', NULL, NULL, NULL,
  '2026-12-05', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events?type=ADCC', NULL, NULL, NULL, false
),
(
  'winter-open-2026', 'Winter Open 2026 Gi & No-Gi Jiu Jitsu', 'Tournament',
  'Turniej BJJ Gi i No-Gi.', NULL, NULL, NULL, 'PoznaÅ„', 'UAM Sport, PoznaÅ„', NULL, NULL,
  '2026-12-12', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/712-winter-open-2026-gi-no-gi-jiu-jitsu', NULL, NULL, NULL, false
),
(
  'iii-zimowe-akademickie-mistrzostwa-polski-bjj-2026', 'III Zimowe Akademickie Mistrzostwa Polski Gi i No-Gi', 'Tournament',
  'Akademickie zawody BJJ Gi i No-Gi.', NULL, NULL, NULL, 'Szczytno', 'ul. Lanca 1, Szczytno', NULL, NULL,
  '2026-12-12', NULL, NULL, NULL, NULL, 'PLN',
  'https://martialmatch.com/pl/events/968-iii-zimowe-akademickie-mistrzostwa-polski-gi-i-no-gi', NULL, NULL, NULL, false
)
ON CONFLICT (slug) DO NOTHING;


-- DwujÄ™zyczna aktualizacja pakietu wolnamata-events-2026-import.sql.
-- Konwencja kart: zawsze Polski / English.
-- Opis jest jednym tekstem: najpierw peÅ‚ny akapit polski, nastÄ™pnie peÅ‚ny akapit angielski.

UPDATE events AS e
SET title = v.title_bilingual,
    description = v.description_bilingual
FROM (VALUES
  ('combat-camp-sierpien-2026', 'Combat Camp SierpieÅ„ 2026 / Combat Camp August 2026', E'Czterodniowy obÃ³z sparingowo-mentalny z trzema sesjami treningowymi dziennie. SzczegÃ³Å‚y programu i dostÄ™pnoÅ›ci miejsc znajdujÄ… siÄ™ na stronie organizatora.\n\nA four-day sparring and mental-performance camp with three training sessions per day. Programme details and availability are provided on the organiserâ€™s website.'),
  ('rio-fit-and-chill-camp-2026', 'Rio Fit & Chill Camp 2026 / Rio Fit & Chill Camp 2026', E'Weekendowy obÃ³z sportowo-rekreacyjny organizowany przez Rio Grappling Club CzÄ™stochowa. Program Å‚Ä…czy aktywnoÅ›Ä‡ fizycznÄ…, samoobronÄ™ i regeneracjÄ™.\n\nA weekend sports and recreation camp organised by Rio Grappling Club CzÄ™stochowa, combining physical activity, self-defence and recovery.'),
  ('bt-camp-berserkers-team-2026', 'BT Camp â€“ ObÃ³z Berserkers Team 2026 / BT Camp â€“ Berserkers Team Camp 2026', E'Tygodniowy obÃ³z sportÃ³w walki z treningami BJJ, submission fighting, zapasÃ³w, MMA i muay thai. Organizator przewiduje trzy treningi dziennie oraz osobny program dla dzieci.\n\nA week-long martial arts camp featuring BJJ, submission fighting, wrestling, MMA and Muay Thai, with three daily sessions and a separate childrenâ€™s programme.'),
  ('mocni-zawodnicy-2-camp-bjj-2026', 'Mocni Zawodnicy 2 â€“ Camp BJJ / Strong Competitors 2 â€“ BJJ Camp', E'ObÃ³z BJJ i grapplingu nad Jeziorem Å»ywieckim, obejmujÄ…cy treningi, seminarium BJJ Gi z Bartoszem Zawadzkim oraz dodatkowe aktywnoÅ›ci integracyjne.\n\nA BJJ and grappling camp by Lake Å»ywieckie, including training, a Gi seminar with Bartosz Zawadzki and additional group activities.'),
  ('bjj-globetrotters-zen-camp-2026', 'BJJ Globetrotters Zen Camp 2026 / BJJ Globetrotters Zen Camp 2026', E'SzeÅ›ciodniowy miÄ™dzynarodowy obÃ³z BJJ Gi i No-Gi z zajÄ™ciami, open matami, jogÄ… i warsztatami. WedÅ‚ug strony organizatora miejsca sÄ… wyprzedane.\n\nA six-day international Gi and No-Gi BJJ camp with classes, open mats, yoga and workshops. The organiser currently lists the camp as sold out.'),
  ('ffion-davies-open-no-gi-seminar-warsaw-2026', 'Otwarte seminarium No-Gi z Ffion Davies / Ffion Davies Open No-Gi Seminar', E'Otwarte seminarium No-Gi z mistrzyniÄ… Å›wiata IBJJF i ADCC, przeznaczone dla uczestnikÃ³w niezaleÅ¼nie od poziomu zaawansowania.\n\nAn open No-Gi seminar with the IBJJF and ADCC world champion, suitable for participants of every experience level.'),
  ('seminarium-zasad-ibjjf-lukasz-winiarski-2026', 'Seminarium z zasad IBJJF / IBJJF Rules Seminar', E'Otwarte szkolenie z zasad IBJJF prowadzone przez Åukasza Winiarskiego przed XXIV Pucharem Polski BJJ. Dalsze szczegÃ³Å‚y majÄ… zostaÄ‡ ogÅ‚oszone.\n\nAn open IBJJF rules seminar led by Åukasz Winiarski ahead of the 24th Polish BJJ Cup. Further details are yet to be announced.'),
  ('solt-18-mistrzostwa-polski-2026-no-gi', 'SOLT 18 x DZIK: Mistrzostwa Polski No-Gi / SOLT 18 x DZIK: Polish No-Gi Championship', E'Mistrzostwa Polski w formule No-Gi organizowane w ramach Sub Only League. Kategorie, regulamin i terminy rejestracji znajdujÄ… siÄ™ na stronie wydarzenia.\n\nThe Polish No-Gi Championship held as part of the Sub Only League. Divisions, rules and registration dates are available on the event page.'),
  ('adcc-amateur-world-championship-2026', 'Amatorskie Mistrzostwa Åšwiata ADCC 2026 / ADCC Amateur World Championship 2026', E'Amatorskie mistrzostwa Å›wiata ADCC odbywajÄ…ce siÄ™ dzieÅ„ przed gÅ‚Ã³wnymi mistrzostwami ADCC w Krakowie.\n\nThe ADCC Amateur World Championship, held one day before the main ADCC championship in KrakÃ³w.'),
  ('adcc-world-championship-2026-krakow', 'Mistrzostwa Åšwiata ADCC 2026 / ADCC World Championship 2026', E'Mistrzostwa Å›wiata ADCC w submission grapplingu, po raz pierwszy organizowane w Polsce.\n\nThe ADCC Submission Fighting World Championship, hosted in Poland for the first time.'),
  ('project-roll-jiu-jitsu-7', 'Project Roll Jiu-Jitsu 7 / Project Roll Jiu-Jitsu 7', E'Turniej BJJ Gi i No-Gi dla dzieci i dorosÅ‚ych. SzczegÃ³Å‚y kategorii i rejestracji znajdujÄ… siÄ™ na stronie wydarzenia.\n\nA Gi and No-Gi BJJ tournament for children and adults. Division and registration details are available on the event page.'),
  ('xxiv-puchar-polski-bjj', 'XXIV Puchar Polski BJJ / 24th Polish BJJ Cup', E'Dwudniowy Puchar Polski w brazylijskim jiu-jitsu rozgrywany wedÅ‚ug zasad IBJJF.\n\nA two-day Polish Brazilian Jiu-Jitsu Cup contested under IBJJF rules.'),
  ('iii-otwarte-mistrzostwa-dolnego-slaska-bjj-2026', 'III Otwarte Mistrzostwa Dolnego ÅšlÄ…ska BJJ / 3rd Lower Silesia BJJ Open', E'Otwarte zawody BJJ w formuÅ‚ach Gi i No-Gi.\n\nAn open BJJ competition featuring Gi and No-Gi divisions.'),
  ('ogolnopolska-liga-ju-jitsu-katowice-2026-09', 'OgÃ³lnopolska Liga Ju-Jitsu / Polish National Ju-Jitsu League', E'Zawody dla dzieci, mÅ‚odzieÅ¼y i dorosÅ‚ych obejmujÄ…ce miÄ™dzy innymi BJJ Gi, BJJ No-Gi oraz ne-waza.\n\nA competition for children, youth and adults, including BJJ Gi, BJJ No-Gi and ne-waza divisions.'),
  ('xvi-puchar-polski-no-gi-jiu-jitsu-2026', 'XVI Puchar Polski No-Gi Jiu-Jitsu / 16th Polish No-Gi Jiu-Jitsu Cup', E'Puchar Polski No-Gi Jiu-Jitsu. Aktualne kategorie, opÅ‚aty i harmonogram znajdujÄ… siÄ™ na stronie wydarzenia.\n\nThe Polish No-Gi Jiu-Jitsu Cup. Current divisions, fees and schedule are available on the event page.'),
  ('iii-open-fire-carioca-cup', 'III Open Fire Carioca Cup / 3rd Open Fire Carioca Cup', E'Turniej BJJ Gi i No-Gi.\n\nA Gi and No-Gi BJJ tournament.'),
  ('copa-14-gi-nogi', 'COPA 14 â€“ Gi i No-Gi / COPA 14 â€“ Gi & No-Gi', E'Turniej BJJ w formuÅ‚ach Gi i No-Gi.\n\nA BJJ tournament featuring Gi and No-Gi divisions.'),
  ('puchar-polski-grappling-kamien-pomorski-2026', 'Puchar Polski w Grapplingu 2026 / Polish Grappling Cup 2026', E'Puchar Polski w grapplingu dla kategorii dzieciÄ™cych, mÅ‚odzieÅ¼owych i seniorskich.\n\nThe Polish Grappling Cup for children, youth and senior divisions.'),
  ('bone-breakers-cup-2026', 'Bone Breakers Cup 2026 / Bone Breakers Cup 2026', E'Turniej submission only oraz BJJ Gi i No-Gi.\n\nA submission-only, Gi and No-Gi BJJ tournament.'),
  ('koledzy-cup-vol-5', 'KOLEDZY CUP vol. 5 Gi i No-Gi / KOLEDZY CUP vol. 5 Gi & No-Gi', E'Turniej BJJ Gi i No-Gi.\n\nA Gi and No-Gi BJJ tournament.'),
  ('xvii-fight-grappler-cup-2026', 'XVII Fight Grappler Cup No-Gi / 17th Fight Grappler Cup No-Gi', E'Turniej BJJ No-Gi.\n\nA No-Gi BJJ tournament.'),
  ('open-baltic-cup-2026', 'Open Baltic Cup Gi i No-Gi / Open Baltic Cup Gi & No-Gi', E'Turniej BJJ Gi i No-Gi.\n\nA Gi and No-Gi BJJ tournament.'),
  ('taga-copa-poland-2026', 'TAGA COPA POLAND / TAGA COPA POLAND', E'Turniej BJJ No-Gi.\n\nA No-Gi BJJ tournament.'),
  ('iii-bjj-colored-belts-championships', 'III Mistrzostwa BJJ Kolorowych PasÃ³w / 3rd BJJ Colored Belts Championship', E'Turniej BJJ Gi i No-Gi dla kolorowych pasÃ³w.\n\nA Gi and No-Gi BJJ tournament for coloured belts.'),
  ('fall-open-2026', 'Jesienny Open 2026 Gi i No-Gi / Fall Open 2026 Gi & No-Gi', E'Turniej BJJ Gi i No-Gi.\n\nA Gi and No-Gi BJJ tournament.'),
  ('jelcz-laskowice-cup-iv', 'Jelcz-Laskowice Cup IV â€“ DolnoÅ›lÄ…ska Liga BJJ / Jelcz-Laskowice Cup IV â€“ Lower Silesia BJJ League', E'Turniej BJJ Gi i No-Gi.\n\nA Gi and No-Gi BJJ tournament.'),
  ('malopolska-liga-salt-cup-2026', 'MaÅ‚opolska Liga Jiu-Jitsu â€“ Salt Cup / Lesser Poland Jiu-Jitsu League â€“ Salt Cup', E'Turniej BJJ Gi i No-Gi.\n\nA Gi and No-Gi BJJ tournament.'),
  ('solt-19-dzik-gi-nogi', 'SOLT 19 x DZIK: Gi i No-Gi / SOLT 19 x DZIK: Gi & No-Gi', E'Turniej Sub Only League w formuÅ‚ach Gi i No-Gi.\n\nA Sub Only League tournament featuring Gi and No-Gi divisions.'),
  ('malopolska-liga-cracow-cup-2026', 'MaÅ‚opolska Liga Jiu-Jitsu â€“ Cracow Cup / Lesser Poland Jiu-Jitsu League â€“ Cracow Cup', E'Turniej BJJ Gi i No-Gi.\n\nA Gi and No-Gi BJJ tournament.'),
  ('ground-game-cup-9-2026', 'Ground Game Cup 9 â€“ Mistrzostwa BaÅ‚tyku i Europy Wschodniej / Ground Game Cup 9 â€“ Baltic & Eastern Europe Championship', E'Turniej BJJ Gi i No-Gi w nowym terminie wskazanym przez organizatora.\n\nA Gi and No-Gi BJJ tournament held on the organiserâ€™s revised date.'),
  ('ii-otwarty-puchar-dolnego-slaska-bjj-2026', 'II Otwarty Puchar Dolnego ÅšlÄ…ska BJJ / 2nd Lower Silesia BJJ Open Cup', E'Otwarty turniej BJJ Gi i No-Gi.\n\nAn open Gi and No-Gi BJJ tournament.'),
  ('koga-cup-iii-2026', 'KOGA CUP III: Gi i No-Gi / KOGA CUP III: Gi & No-Gi', E'Turniej BJJ Gi i No-Gi.\n\nA Gi and No-Gi BJJ tournament.'),
  ('sigma-league-viii-2026', 'Sigma League VIII Jiu-Jitsu Gi i No-Gi / Sigma League VIII Jiu-Jitsu Gi & No-Gi', E'Turniej BJJ Gi i No-Gi.\n\nA Gi and No-Gi BJJ tournament.'),
  ('adcc-polish-cup-2026', 'Puchar Polski ADCC 2026 / ADCC Polish Cup 2026', E'Puchar Polski rozgrywany wedÅ‚ug zasad ADCC.\n\nThe Polish Cup contested under ADCC rules.'),
  ('winter-open-2026', 'Zimowy Open 2026 Gi i No-Gi / Winter Open 2026 Gi & No-Gi', E'Turniej BJJ Gi i No-Gi.\n\nA Gi and No-Gi BJJ tournament.'),
  ('iii-zimowe-akademickie-mistrzostwa-polski-bjj-2026', 'III Zimowe Akademickie Mistrzostwa Polski BJJ / 3rd Winter Polish University BJJ Championship', E'Akademickie zawody BJJ Gi i No-Gi.\n\nA university-level Gi and No-Gi BJJ competition.')
) AS v(slug, title_bilingual, description_bilingual)
WHERE e.slug = v.slug;


