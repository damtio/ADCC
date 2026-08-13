-- Wolna Mata: kandydaci akademii, weryfikacja 2026-08-13.
-- Wszystkie rekordy sÄ… nieopublikowane i wymagajÄ… zatwierdzenia w /admin/academies.
-- Nie dodaje istniejÄ…cych akademii krakowskich z migracji 006.

INSERT INTO academies (
  name, address, city, district, specialization, phone, email, website,
  facebook_url, instagram_url, image_url, latitude, longitude, sort_order, published
) VALUES
  ('Copacabana Team Warszawa', 'ul. GaraÅ¼owa 4, 02-651 Warszawa', 'Warszawa', 'MokotÃ³w', 'Gi + NoGi', NULL, NULL, 'https://www.copacabana.studio/', NULL, NULL, NULL, NULL, NULL, 100, false),
  ('Gameness Team PoznaÅ„', 'ul. JastrzÄ™bska 3B, 60-184 PoznaÅ„', 'PoznaÅ„', 'Grunwald', 'Gi + NoGi', '796 488 203', NULL, 'https://www.gamenessteam.pl/', NULL, NULL, NULL, NULL, NULL, 110, false),
  ('K.S. Anakonda PoznaÅ„', 'ul. Piwoniowa 18, PoznaÅ„', 'PoznaÅ„', 'Junikowo', 'Gi + NoGi', NULL, 'bjj-poznan@wp.pl', 'https://bjj-poznan.pl/', NULL, NULL, NULL, NULL, NULL, 120, false),
  ('Rio Grappling Club WrocÅ‚aw', 'ul. Stalowa 80, 53-440 WrocÅ‚aw', 'WrocÅ‚aw', 'Fabryczna', 'Gi + NoGi', '+48 691 677 877', 'bjjwroclaw@gmail.com', 'https://bjj.wroclaw.pl/', NULL, NULL, NULL, NULL, NULL, 130, false),
  ('Next Level BJJ WrocÅ‚aw', 'ul. SÅ‚owicza 16B, WrocÅ‚aw', 'WrocÅ‚aw', 'Krzyki', 'Gi + NoGi', NULL, NULL, 'https://www.bjjwroclaw.com/', NULL, NULL, NULL, NULL, NULL, 140, false),
  ('Berserkers Team Szczecin â€“ BT Gym', 'ul. Eugeniusza Kwiatkowskiego 1/51, 71-004 Szczecin', 'Szczecin', 'GumieÅ„ce', 'Gi + NoGi', '535 750 060', 'kontakt@btgym.pl', 'https://berserkersteam.pl/filie/berserkers-team-szczecin-2/', NULL, NULL, NULL, NULL, NULL, 150, false),
  ('Berserkers Team SuwaÅ‚ki', 'ul. Sikorskiego 6/01, 16-400 SuwaÅ‚ki', 'SuwaÅ‚ki', '', 'Gi + NoGi', '531 585 375', NULL, 'https://berserkersteam.pl/filie/berserkers-team-suwalki/', NULL, NULL, NULL, NULL, NULL, 160, false),
  ('Berserkers Team KoÅ‚obrzeg', 'ul. ObroÅ„cÃ³w Westerplatte 18C, 78-100 KoÅ‚obrzeg', 'KoÅ‚obrzeg', '', 'Gi + NoGi', '784 877 903', 'mariuszilin@interia.pl', 'https://berserkersteam.pl/filie/berserkers-team-kolobrzeg/', NULL, NULL, NULL, NULL, NULL, 170, false),
  ('Shootfighters Lublin', 'Hala Globus, ul. Kazimierza Wielkiego 8, Lublin', 'Lublin', 'KonstantynÃ³w', 'Gi + NoGi', '798 720 668', 'info@mma-lublin.com', 'https://mma-lublin.com/bjj.html', NULL, NULL, NULL, NULL, NULL, 180, false),
  ('Copacabana Lublin', 'ul. Skromna 5, 20-704 Lublin', 'Lublin', 'KonstantynÃ³w', 'Gi + NoGi', '+48 791 777 830', 'kontakt@copacabanalublin.pl', 'https://copacabanalublin.pl/', NULL, NULL, NULL, NULL, NULL, 190, false),
  ('Rio Grappling Club CzÄ™stochowa', 'ul. KiedrzyÅ„ska 44/46, CzÄ™stochowa', 'CzÄ™stochowa', '', 'Gi + NoGi', '508 329 225', 'info@bjjczestochowa.pl', 'https://www.bjjczestochowa.pl/', NULL, NULL, NULL, NULL, NULL, 200, false),
  ('Rio Grappling Club DÄ…browa GÃ³rnicza', 'ul. Sienkiewicza 14, DÄ…browa GÃ³rnicza', 'DÄ…browa GÃ³rnicza', '', 'Gi + NoGi', NULL, 'kontakt@rgcdabrowagornicza.pl', 'https://rgcdabrowagornicza.pl/', NULL, NULL, NULL, NULL, NULL, 210, false),
  ('Rio Grappling Club OtmuchÃ³w', 'ul. Krakowska 38, OtmuchÃ³w', 'OtmuchÃ³w', '', 'Gi + NoGi', NULL, 'jujit@poczta.onet.pl', 'https://fugetsu.pl/', NULL, NULL, NULL, NULL, NULL, 220, false),
  ('Rio Grappling Club Zawiercie / AniMMAls', 'ul. Ignacego DaszyÅ„skiego 55, Zawiercie', 'Zawiercie', '', 'Gi + NoGi', NULL, 'krychu_beta@yahoo.com', 'https://www.animmals.pl/', NULL, NULL, NULL, NULL, NULL, 230, false),
  ('Rio Grappling Club OÅ‚awa', 'ul. 3 Maja 4, OÅ‚awa', 'OÅ‚awa', '', 'Gi + NoGi', NULL, 'rgc_olawa@onet.pl', 'https://riograpplingclub.pl/kluby/', NULL, NULL, NULL, NULL, NULL, 240, false),
  ('Rio Grappling Club KroÅ›nice / Team Krakowiak', 'ul. Åozisko 17, KroÅ›nice', 'KroÅ›nice', '', 'Gi + NoGi', NULL, NULL, 'https://riograpplingclub.pl/kluby/', NULL, NULL, NULL, NULL, NULL, 250, false)
ON CONFLICT DO NOTHING;


