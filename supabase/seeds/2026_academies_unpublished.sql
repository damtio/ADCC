-- Wolna Mata: kandydaci akademii, weryfikacja 2026-08-13.
-- Wszystkie rekordy są nieopublikowane i wymagają zatwierdzenia w /admin/academies.
-- Nie dodaje istniejących akademii krakowskich z migracji 006.

INSERT INTO academies (
  name, address, city, district, specialization, phone, email, website,
  facebook_url, instagram_url, image_url, latitude, longitude, sort_order, published
) VALUES
  ('Copacabana Team Warszawa', 'ul. Garażowa 4, 02-651 Warszawa', 'Warszawa', 'Mokotów', 'Gi + NoGi', NULL, NULL, 'https://www.copacabana.studio/', NULL, NULL, NULL, NULL, NULL, 100, false),
  ('Gameness Team Poznań', 'ul. Jastrzębska 3B, 60-184 Poznań', 'Poznań', 'Grunwald', 'Gi + NoGi', '796 488 203', NULL, 'https://www.gamenessteam.pl/', NULL, NULL, NULL, NULL, NULL, 110, false),
  ('K.S. Anakonda Poznań', 'ul. Piwoniowa 18, Poznań', 'Poznań', 'Junikowo', 'Gi + NoGi', NULL, 'bjj-poznan@wp.pl', 'https://bjj-poznan.pl/', NULL, NULL, NULL, NULL, NULL, 120, false),
  ('Rio Grappling Club Wrocław', 'ul. Stalowa 80, 53-440 Wrocław', 'Wrocław', 'Fabryczna', 'Gi + NoGi', '+48 691 677 877', 'bjjwroclaw@gmail.com', 'https://bjj.wroclaw.pl/', NULL, NULL, NULL, NULL, NULL, 130, false),
  ('Next Level BJJ Wrocław', 'ul. Słowicza 16B, Wrocław', 'Wrocław', 'Krzyki', 'Gi + NoGi', NULL, NULL, 'https://www.bjjwroclaw.com/', NULL, NULL, NULL, NULL, NULL, 140, false),
  ('Berserkers Team Szczecin – BT Gym', 'ul. Eugeniusza Kwiatkowskiego 1/51, 71-004 Szczecin', 'Szczecin', 'Gumieńce', 'Gi + NoGi', '535 750 060', 'kontakt@btgym.pl', 'https://berserkersteam.pl/filie/berserkers-team-szczecin-2/', NULL, NULL, NULL, NULL, NULL, 150, false),
  ('Berserkers Team Suwałki', 'ul. Sikorskiego 6/01, 16-400 Suwałki', 'Suwałki', '', 'Gi + NoGi', '531 585 375', NULL, 'https://berserkersteam.pl/filie/berserkers-team-suwalki/', NULL, NULL, NULL, NULL, NULL, 160, false),
  ('Berserkers Team Kołobrzeg', 'ul. Obrońców Westerplatte 18C, 78-100 Kołobrzeg', 'Kołobrzeg', '', 'Gi + NoGi', '784 877 903', 'mariuszilin@interia.pl', 'https://berserkersteam.pl/filie/berserkers-team-kolobrzeg/', NULL, NULL, NULL, NULL, NULL, 170, false),
  ('Shootfighters Lublin', 'Hala Globus, ul. Kazimierza Wielkiego 8, Lublin', 'Lublin', 'Konstantynów', 'Gi + NoGi', '798 720 668', 'info@mma-lublin.com', 'https://mma-lublin.com/bjj.html', NULL, NULL, NULL, NULL, NULL, 180, false),
  ('Copacabana Lublin', 'ul. Skromna 5, 20-704 Lublin', 'Lublin', 'Konstantynów', 'Gi + NoGi', '+48 791 777 830', 'kontakt@copacabanalublin.pl', 'https://copacabanalublin.pl/', NULL, NULL, NULL, NULL, NULL, 190, false),
  ('Rio Grappling Club Częstochowa', 'ul. Kiedrzyńska 44/46, Częstochowa', 'Częstochowa', '', 'Gi + NoGi', '508 329 225', 'info@bjjczestochowa.pl', 'https://www.bjjczestochowa.pl/', NULL, NULL, NULL, NULL, NULL, 200, false),
  ('Rio Grappling Club Dąbrowa Górnicza', 'ul. Sienkiewicza 14, Dąbrowa Górnicza', 'Dąbrowa Górnicza', '', 'Gi + NoGi', NULL, 'kontakt@rgcdabrowagornicza.pl', 'https://rgcdabrowagornicza.pl/', NULL, NULL, NULL, NULL, NULL, 210, false),
  ('Rio Grappling Club Otmuchów', 'ul. Krakowska 38, Otmuchów', 'Otmuchów', '', 'Gi + NoGi', NULL, 'jujit@poczta.onet.pl', 'https://fugetsu.pl/', NULL, NULL, NULL, NULL, NULL, 220, false),
  ('Rio Grappling Club Zawiercie / AniMMAls', 'ul. Ignacego Daszyńskiego 55, Zawiercie', 'Zawiercie', '', 'Gi + NoGi', NULL, 'krychu_beta@yahoo.com', 'https://www.animmals.pl/', NULL, NULL, NULL, NULL, NULL, 230, false),
  ('Rio Grappling Club Oława', 'ul. 3 Maja 4, Oława', 'Oława', '', 'Gi + NoGi', NULL, 'rgc_olawa@onet.pl', 'https://riograpplingclub.pl/kluby/', NULL, NULL, NULL, NULL, NULL, 240, false),
  ('Rio Grappling Club Krośnice / Team Krakowiak', 'ul. Łozisko 17, Krośnice', 'Krośnice', '', 'Gi + NoGi', NULL, NULL, 'https://riograpplingclub.pl/kluby/', NULL, NULL, NULL, NULL, NULL, 250, false)
ON CONFLICT DO NOTHING;

