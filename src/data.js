// ─────────────────────────────────────────────────────────────
//  Cała treść strony w jednym miejscu. Edytuj tutaj, nie w komponentach.
//  Pola z wartością `null` lub `TODO` pokazują się na stronie jako
//  przerywane „miejsca do uzupełnienia”.
// ─────────────────────────────────────────────────────────────

export const TODO = null

export const person = {
  name: 'Krzysztof Gołacki',
  short: 'K. Gołacki',
  roles: 'Student medycyny, przyszły kardiochirurg, twórca narzędzi',
  city: 'Gdańsk, PL',
  email: 'ja@golacki.pl',
  cvUrl: 'assets/Krzysztof-Golacki-CV.pdf',
  cvNote: 'Publikacje, staże, certyfikaty. PDF, 4 strony',
}

export const hero = {
  kicker: 'student medycyny, przyszły kardiochirurg',
  // Zmieniają się po kolei obok nazwiska
  roles: ['przyszły kardiochirurg', 'student medycyny', 'magister farmacji', 'twórca aplikacji'],
  claim: 'Idę w stronę kardiochirurgii. Po drodze buduję narzędzia.',
  // Ten sam nagłówek podzielony na wersy (każdy wjeżdża osobno)
  lines: ['Idę w stronę', 'kardiochirurgii.', 'Po drodze buduję', 'narzędzia.'],
  lead: 'Studiuję medycynę, żeby zostać kardiochirurgiem dziecięcym. Pierwsze doświadczenie zebrałem na oddziale kardiochirurgii dziecięcej. Równolegle buduję aplikacje dla lekarzy, badaczy i studentów.',
  // Krótkie fakty pod nagłówkiem
  facts: [
    ['V rok', 'kierunku lekarskiego, GUMed'],
    ['2 × mgr', 'farmacja i biologia'],
    ['3 badania', 'kliniczne w LabCorp: onkologia, pulmonologia'],
    ['4 publikacje', 'naukowe, m.in. Pharmaceutics i Molecules'],
  ],
  seeking: {
    label: 'Dokąd zmierzam',
    text: 'Chcę zostać kardiochirurgiem dziecięcym. Pierwsze doświadczenie zebrałem na oddziale kardiochirurgii dziecięcej i szukam zespołu klinicznego, w którym będę mógł uczyć się dalej: na oddziale, przy stole operacyjnym i w badaniach. Do zespołu wnoszę znajomość pacjenta, leku i danych z badań, dokładną dokumentację oraz narzędzia, które zdejmują z niego ręczną pracę.',
  },
}

export const marquee = ['Kardiochirurgia', 'Medycyna', 'Farmacja', 'Badania kliniczne', 'Health-tech', 'Medical writing', 'Genetyka']

export const projects = [
  {
    key: 'gen',
    name: ['Gen', 'Code'],
    meta: ['Genetyka kliniczna', 'Web app, wersja testowa'],
    url: 'https://doktorfarm.github.io/gencode/',
    description:
      'Prowadzi od wariantu DNA do raportu klinicznego w jednym miejscu: analiza wariantu, rodowód do czterech pokoleń i klasyfikacja ACMG. Oddziela fakty z laboratorium od wnioskowania klinicznego, a każde kryterium ma podane źródło.',
    tags: ['Klasyfikacja ACMG', 'Rodowód I–IV', 'ClinVar, gnomAD', 'PL / EN'],
    tech: [],
    points: [
      'Ten sam wynik w trzech raportach: klinicznym, badawczym i dla pacjenta',
      'Dowody z ClinVar i gnomAD połączone z modelem 3D białka (AlphaFold)',
      'Karta informacyjna dla pacjenta napisana prostym językiem',
    ],
    shots: {
      desktop: [
        ['gencode-app', 'Workspace GenCode: przypadek NF1 z klasyfikacją ACMG, frakcją allelu i ryzykiem dziedziczenia'],
        ['gencode-start', 'Strona główna GenCode z hasłem „Od wariantu DNA do raportu klinicznego”'],
      ],
      phone: 'gencode-phone',
      phoneAlt: 'GenCode na telefonie: przypadek NF1 z kryterium PVS1 i klasą patogenności',
    },
  },
  {
    key: 'start',
    name: ['Start', 'ownia'],
    meta: ['Dla studentów I roku', 'Web app, PWA'],
    url: TODO, // publiczny adres po wdrożeniu (lokalnie: localhost:5173/welcome)
    description:
      'Przewodnik po pierwszych tygodniach studiów, pilotaż dla I roku GUMed. Codziennie jeden krótki krok, mapa kampusu, wydarzenia z biletem QR i mentor ze starszego roku. Osobne panele dla studenta, mentora, prowadzącego i administratora, który widzi wyłącznie dane zbiorcze.',
    tags: ['Onboarding', 'Mentoring', 'Tryb offline', 'PL / EN'],
    tech: ['React', 'TypeScript', 'Vite', 'React Router'],
    // Krótkie konkrety pod opisem
    points: [
      'Plan wdrożenia w trzech fazach: przed startem, pierwszy tydzień, pierwszy miesiąc',
      'Cztery role z osobnymi panelami i uprawnieniami',
      'Mentor nie widzi ocen ani danych osobowych studenta',
      'Interfejs po polsku i angielsku, jasny i ciemny motyw',
    ],
    // Zrzuty ekranu: nazwy z media/ (npm run images)
    shots: {
      // kilka zrzutów zmienia się w jednej ramce
      desktop: [
        ['startownia-panel', 'Panel studenta w aplikacji Startownia: powitanie, pytanie o samopoczucie i postęp planu wdrożenia'],
        ['startownia-start', 'Strona powitalna Startowni z izometrycznym kampusem'],
      ],
      phone: 'startownia-plan',
      phoneAlt: 'Startownia na telefonie: plan wdrożenia podzielony na trzy fazy',
    },
  },
  {
    key: 'inf',
    name: ['Infect', 'io'],
    meta: ['Dla studentów medycyny', 'Web app, nauka powtórkowa'],
    url: null, // aplikacja jest za logowaniem (ChatGPT), więc bez linku
    description:
      'Aplikacja do nauki chorób zakaźnych: fiszki, pytania otwarte i quiz ABCDE na bazie 109 pytań z kluczem i źródłem. Powtórki wracają w ustalonych odstępach, a postęp i trafność quizów liczą się wyłącznie z Twojej nauki.',
    tags: ['Fiszki', 'Quiz ABCDE', 'Powtórki', 'Choroby zakaźne'],
    tech: [],
    points: [
      'Biblioteka z filtrami po temacie, typie pytania, statusie weryfikacji i pochodzeniu',
      'Każde pytanie pokazuje, czy klucz sprawdzono i według jakiego źródła (np. CDC)',
      'Kalendarz powtórek: „Jeszcze powtórzę” wraca po 10 minutach, „Pamiętam” po 3 dniach',
      'Dane zostają w przeglądarce, z kopią postępu do pobrania',
    ],
    shots: {
      desktop: [['infectio-screens', 'Infectio na telefonie: pulpit z fiszkami do nauki, pytanie quizu ABCDE o profil serologiczny HBV i biblioteka pytań']],
    },
  },
  {
    key: 'cal',
    draft: true, // niewidoczny na stronie, dopóki nie ma opisu i zrzutów
    name: ['Calendat', 'Stud'],
    meta: ['Dla studentów', 'Web app'],
    url: TODO,
    description: TODO,
    tags: [],
    tech: [TODO, TODO, TODO],
  },
]

export const about = {
  text: 'Jestem studentem V roku medycyny oraz magistrem farmacji i biologii. Przede wszystkim chcę zostać kardiochirurgiem dziecięcym. Pracowałem przy łóżku pacjenta na kardiochirurgii dziecięcej, w CRO, jako medical writer i w aptece. Dlatego wiem, jak wygląda problem z każdej strony, zanim zacznę budować rozwiązanie.',
}

// `to: null` = „dziś”
export const experience = [
  { from: '2025', to: null, role: 'Dyrektor operacyjny', org: 'Sarovi, Warszawa', tag: 'Biznes' },
  { from: '2025', to: '2026', role: 'Medical Writer', org: 'Centrum Wsparcia Badań Klinicznych GUMed', tag: 'Badania' },
  { from: '2025', role: 'Asystent lekarza', org: 'Oddział Kardiochirurgii Dziecięcej, Szpital im. św. Wojciecha', tag: 'Klinika' },
  { from: '2024', to: null, role: 'Farmaceuta', org: 'Apteka Gemini, Gdańsk', tag: 'Farmacja' },
  { from: '2024', to: '2026', role: 'Farmaceuta nadzorujący', org: 'Apteka pod Wagą, Zwoleń', tag: 'Farmacja' },
  { from: '2021', to: '2022', role: 'Project Coordinator', org: 'LabCorp (Covance), Warszawa', tag: 'CRO' },
  { from: '2016', to: '2021', role: 'Biolog', org: 'Gdański Uniwersytet Medyczny', tag: 'Laboratorium' },
]

export const education = [
  { from: '2022', to: null, role: 'Kierunek lekarski', org: 'Gdański Uniwersytet Medyczny', tag: 'V rok' },
  { from: '2015', to: '2021', role: 'Farmacja, magister', org: 'Gdański Uniwersytet Medyczny', tag: 'mgr farm.' },
  { from: '2011', to: '2016', role: 'Biologia, magister', org: 'Uniwersytet Gdański', tag: 'mgr' },
]

export const skills = [
  { title: 'Badania kliniczne', items: ['ICH-GCP E6 (R2)', 'TMF, CTMS', 'Koordynacja badań', 'Dokumentacja dla komisji bioetycznych'] },
  { title: 'Medycyna i farmacja', items: ['Farmakoterapia i doradztwo', 'Lek recepturowy', 'Szczepienia (kurs kwalifikacyjny)', 'Dobra Praktyka Dystrybucyjna'] },
  { title: 'Nauka i laboratorium', items: ['Medical writing', 'Real-time PCR', 'Testy MIC / MBC / MBEC', 'Synteza peptydów'] },
  { title: 'Zarządzanie', items: ['Budżety i cele sprzedażowe', 'Relacje z klientami', 'Mentoring zespołów', 'MS Project, Visio, Excel'] },
]

export const contact = {
  title: 'Porozmawiajmy',
  accent: 'o współpracy.', // konturem
  text: 'Prowadzisz oddział, zespół kliniczny albo badanie i chcesz porozmawiać o współpracy? Napisz kilka zdań o zespole i o tym, czego potrzebujesz. Odpowiadam zwykle w ciągu jednego dnia.',
}

// Dowody: publikacje i certyfikaty (z CV)
export const publications = [
  {
    year: '2026',
    title: 'Hybrid mitral-Melody valve implantation as a long-term bridge in a child with critical endocarditis: 8-years survival to definitive procedure',
    venue: 'Autor',
    url: TODO, // link DOI po publikacji
  },
  {
    year: '2020',
    title: 'Ultrashort Cationic Lipopeptides: Effect of N-Terminal Amino Acid and Fatty Acid Type on Antimicrobial Activity and Hemolysis',
    venue: 'Molecules, współautor',
    url: TODO,
  },
  {
    year: '2019',
    title: 'Influence of Short Cationic Lipopeptides with Fatty Acids of Different Chain Lengths on Bacterial Biofilms Formed on Polystyrene and Hydrogel Surfaces',
    venue: 'Pharmaceutics, współautor',
    url: TODO,
  },
]

// Wystąpienia (z CV)
export const talks = [
  { year: '2026', title: 'Prezentacja przypadku klinicznego', venue: 'Kardioneptunalia, Jastarnia' },
]

export const certificates = [
  { year: '2025', name: 'ICH E6 (R2) Good Clinical Practice' },
  { year: '2025', name: 'Kurs kwalifikacyjny do szczepień' },
  { year: '2021', name: 'Clinical Trials Assistant' },
]

// FAQ: krótkie, konkretne odpowiedzi (trafiają też do JSON-LD FAQPage i llms.txt)
export const faq = [
  {
    q: 'Kim jest Krzysztof Gołacki?',
    a: 'Student V roku kierunku lekarskiego na Gdańskim Uniwersytecie Medycznym, magister farmacji (GUMed) i magister biologii (Uniwersytet Gdański). Jego cel to kardiochirurgia dziecięca. Pracuje jako farmaceuta, był koordynatorem badań klinicznych w LabCorp i medical writerem w Centrum Wsparcia Badań Klinicznych GUMed. Tworzy też własne aplikacje dla medycyny.',
  },
  {
    q: 'Czego szukam i co mogę wnieść do zespołu?',
    a: 'Szukam zespołu klinicznego, najchętniej z kardiochirurgii dziecięcej, w którym mogę się uczyć i pracować. Wnoszę doświadczenie z oddziału kardiochirurgii dziecięcej, dokumentację badań klinicznych (protokoły, streszczenia, materiały dla komisji bioetycznych), medical writing oraz narzędzia cyfrowe, które zdejmują z zespołu ręczną pracę.',
  },
  {
    q: 'Jakie mam doświadczenie w badaniach klinicznych?',
    a: 'W LabCorp (Covance) współprowadziłem 3 badania kliniczne z onkologii i pulmonologii jako Project Coordinator. Mam certyfikat ICH E6 (R2) GCP, pracuję z systemami TMF i CTMS, a jako medical writer przygotowywałem dokumentację badań w GUMed.',
  },
  {
    q: 'Czym jest GenCode?',
    a: 'GenCode to moja aplikacja, która analizuje raporty z badań genetycznych i tworzy czytelne opisy chorób genetycznych dla badaczy oraz klinicystów.',
  },
  {
    q: 'Jak się ze mną skontaktować?',
    a: 'Napisz na ja@golacki.pl. Odpowiadam zwykle w ciągu jednego dnia. Pracuję z Gdańska, zdalnie w całej Polsce, po polsku i angielsku (C1).',
  },
]

// SEO
export const seo = {
  title: 'Krzysztof Gołacki | Student medycyny, przyszły kardiochirurg',
  description:
    'Student V roku medycyny z Gdańska, przyszły kardiochirurg, magister farmacji i biologii. Szukam zespołu klinicznego. Piszę dokumentację badań (GCP) i buduję narzędzia dla lekarzy.',
  sameAs: [], // np. LinkedIn, ORCID, GitHub — pełne adresy URL
}
