-- Sample news posts
INSERT INTO public.posts (title, slug, excerpt, content, status, is_pinned, published_at, author)
VALUES
(
  'NCC lämnar in ansökan om täkttillstånd',
  'ncc-lamnar-in-ansokan-om-takttillstand',
  'NCC AB har lämnat in en ansökan till länsstyrelsen i Skåne om tillstånd för bergtäkt i Rögleskogen. Initiativet följer processen noggrant.',
  '[{"type":"paragraph","text":"NCC AB har lämnat in en formell ansökan till Länsstyrelsen i Skåne om tillstånd för en ny bergtäkt i Rögleskogen, beläget mellan Södra Sandby och Dalby i Lunds kommun."},{"type":"heading","text":"Vad ansökan innehåller"},{"type":"paragraph","text":"Ansökan avser ett område om cirka 70 hektar och inkluderar brytningstillstånd för krosssten samt tillhörande transporter via befintliga vägar."},{"type":"factbox","title":"Nyckeluppgifter","text":"Beräknad brytningstid: 25–30 år. Planerad produktionsvolym: upp till 3 miljoner ton per år. Planerat driftstart: ej fastställt."},{"type":"paragraph","text":"Länsstyrelsen kommer att remittera ansökan till berörda myndigheter och ge allmänheten möjlighet att yttra sig under samrådstiden."}]',
  'published',
  true,
  now() - interval '5 days',
  'Initiativet Rädda Rögleskogen'
),
(
  'Informationsmöte med Lunds kommun',
  'informationsmote-med-lunds-kommun',
  'Lunds kommun bjuder in till ett informationsmöte om den planerade bergtäkten. Allmänheten är välkommen att ställa frågor.',
  '[{"type":"paragraph","text":"Lunds kommuns miljönämnd anordnar ett informationsmöte för boende och intressenter i området kring Rögleskogen."},{"type":"heading","text":"Praktisk information"},{"type":"paragraph","text":"Mötet hålls i kommunens lokaler. Representanter från planerings- och miljöförvaltningen kommer att presentera ärendet och svara på frågor."},{"type":"warning","title":"Anmälan","text":"Platser är begränsade. Anmäl ditt deltagande i förväg via kommunens hemsida."}]',
  'published',
  false,
  now() - interval '12 days',
  'Lunds kommun'
),
(
  'Ny rapport om naturvärden i Rögleskogen',
  'ny-rapport-om-naturvarden-i-rogleskogen',
  'En oberoende naturvärdesinventering visar på höga biologiska värden i det planerade täktområdet.',
  '[{"type":"paragraph","text":"En naturvärdesinventering genomförd av en oberoende konsult har nu slutförts. Rapporten identifierar flera nyckelbiotoper och artrika miljöer inom det planerade täktområdet."},{"type":"heading","text":"Viktiga fynd"},{"type":"paragraph","text":"Inventeringen identifierade bland annat förekomster av rödlistade arter och värdefulla skogsstrukturer som stående döda träd och äldre hålträd."},{"type":"sources","sources":[{"label":"Naturvårdsverkets rödlista 2024","url":"https://www.naturvardsverket.se"},{"label":"Artdatabankens artfakta","url":"https://artfakta.se"}]}]',
  'published',
  false,
  now() - interval '20 days',
  'Initiativet Rädda Rögleskogen'
);

-- Sample media items (using Pexels photo URLs for forest/landscape)
INSERT INTO public.media_items (title, description, alt_text, media_type, file_url, photographer, media_date, location, is_press_allowed, status, published_at)
VALUES
(
  'Rögleskogen — utsikt mot söder',
  'Vy över skogen mot Dalby i bakgrunden.',
  'Tät lövskog med solsken som bryts genom lövverket',
  'image',
  'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg',
  'Pexels',
  '2024-05-15',
  'Rögleskogen, Lunds kommun',
  true,
  'published',
  now() - interval '30 days'
),
(
  'Lövblandad skog — detalj',
  'Närbild på ek och hassel i skogskanten.',
  'Närbild på gröna löv och trädstammar i lövskog',
  'image',
  'https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg',
  'Pexels',
  '2024-05-15',
  'Rögleskogen',
  true,
  'published',
  now() - interval '30 days'
),
(
  'Promenadstråk i skogen',
  'Befintligt promenadstråk som löper genom det planerade täktområdet.',
  'Skogsväg omgiven av träd på båda sidor',
  'image',
  'https://images.pexels.com/photos/38537/woodland-road-falling-leaf-natural-38537.jpeg',
  'Pexels',
  '2024-05-15',
  'Rögleskogen',
  true,
  'published',
  now() - interval '29 days'
),
(
  'Flygfoto över området',
  'Översiktsbild som visar skogsområdet och intilliggande bebyggelse.',
  'Flygfoto över grön skog med åkrar runt om',
  'image',
  'https://images.pexels.com/photos/1459534/pexels-photo-1459534.jpeg',
  'Pexels',
  '2024-04-10',
  'Södra Sandby – Dalby',
  true,
  'published',
  now() - interval '28 days'
),
(
  'Planerade täktgränser — kartskiss',
  'Skiss över de planerade täktgränserna baserad på NCCs ansökan.',
  'Karta med markerat planerat täktområde',
  'map',
  NULL,
  'Initiativet Rädda Rögleskogen',
  '2024-06-01',
  NULL,
  false,
  'published',
  now() - interval '10 days'
);

-- Sample map locations
INSERT INTO public.map_locations (title, description, lat, lng, point_type, status, published_at)
VALUES
(
  'Planerat täktcentrum',
  'Det ungefärliga centrum för det planerade täktområdet enligt NCCs ansökan.',
  55.7285, 13.3210,
  'quarry_area',
  'published',
  now() - interval '15 days'
),
(
  'Södra Sandby ortsgräns',
  'Gränsen för Södra Sandby tätort. Planerat täktområde börjar ca 400 m härifrån.',
  55.7150, 13.3050,
  'residence_distance',
  'published',
  now() - interval '15 days'
),
(
  'Promenadstråk — norra delen',
  'Populärt promenadstråk som löper genom norra delen av det planerade täktområdet.',
  55.7350, 13.3180,
  'walking_trail',
  'published',
  now() - interval '15 days'
),
(
  'Observationspunkt — skogskanten',
  'Punkt med god utsikt över skogen och det planerade täktområdet.',
  55.7300, 13.3250,
  'observation_point',
  'published',
  now() - interval '14 days'
),
(
  'Planerad transportväg',
  'NCCs planerade transportväg för uttransport av krossad sten.',
  55.7200, 13.3150,
  'transport_route',
  'published',
  now() - interval '14 days'
),
(
  'Identifierat naturvärde — hålträd',
  'Område med äldre hålträd klassade som nyckelbiotop i inventeringen.',
  55.7320, 13.3190,
  'nature_value',
  'published',
  now() - interval '10 days'
);
