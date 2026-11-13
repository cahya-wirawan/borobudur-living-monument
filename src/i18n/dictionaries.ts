import type { ChapterId, EvidenceStatus, Locale, ReviewStatus } from '@/content/schema';

/**
 * Interface strings only. Historical statements never live here: they come
 * from the validated content pack (`src/content`) with claim + source records.
 * Indonesian copy is an unreviewed draft pending a native editor (risk R-07).
 */

const en = {
  meta: {
    siteName: 'Borobudur — The Living Monument',
    description:
      'An interactive, source-cited introduction to Borobudur. Research prototype: visuals are illustrative, not a surveyed reconstruction.',
  },
  common: {
    skipToContent: 'Skip to content',
    wordmark: 'Borobudur',
    tagline: 'The Living Monument',
    prototypeLabel: 'Research prototype',
    illustrativeLabel: 'Illustrative geometry — not a surveyed reconstruction',
    externalLink: 'opens an external site',
    languageLabel: 'Language',
    languageNames: { en: 'English', id: 'Bahasa Indonesia' },
    switchLanguage: 'Switch language to {language}',
    mainNavLabel: 'Site',
    soundOff: 'Sound: none in this prototype',
  },
  nav: {
    experience: 'Experience',
    read: 'Read',
    sources: 'Sources',
    about: 'About',
  },
  modes: {
    label: 'Viewing mode',
    guided: 'Guided',
    explore: 'Explore',
    read: 'Read',
    guidedHint: 'Step through five chapters with a guided camera.',
    exploreHint: 'Move the camera yourself.',
    readHint: 'Text-first version with diagrams and citations.',
    announce: 'Mode: {mode}',
  },
  chapters: {
    railLabel: 'Chapters',
    progress: 'Chapter {current} of {total}',
    progressShort: '{current} / {total}',
    next: 'Next',
    back: 'Back',
    nextTo: 'Next: {title}',
    backTo: 'Back: {title}',
    firstChapter: 'Back (this is the first chapter)',
    lastChapter: 'Next (this is the last chapter)',
    announce: 'Chapter {current} of {total}: {title}',
    endTitle: 'End of the journey',
    endBody: 'Review every statement and its source, or read the full story as text.',
    captions: {
      awakening:
        'The setting and the monument outline shown here are synthetic illustrations made for this prototype.',
      centuries:
        'The camera stays fixed while the drawing style changes. Each style is a visual treatment, not a record of how the monument looked.',
      architecture:
        'The diagram counts levels as UNESCO describes them. Sizes and proportions are not measured.',
      stories:
        'This chapter shows how a relief story will be presented. The artwork is a demonstration, not a carving from the monument.',
      ascent:
        'The three zones follow the interpretation described by UNESCO. The camera path is not a real or historical walking route.',
    } satisfies Record<ChapterId, string>,
  },
  hero: {
    begin: 'Begin the journey',
    exploreFreely: 'Explore freely',
    readInstead: 'Read instead',
    skipIntro: 'Skip introduction',
    entryLabel: 'Choose how to start',
    noAudio: 'No audio plays in this prototype.',
  },
  scene: {
    regionLabel: 'Monument visualization',
    show3d: 'Show 3D scene',
    loading: 'Loading the 3D scene… All text and controls are already usable.',
    cancelLoading: 'Use the still diagram instead',
    canvasDescription:
      'Interactive 3D view of the illustrative monument model. The same information is available in the text panel and in Read mode.',
    exploreHint: 'Drag to orbit. Scroll or pinch to zoom. Nothing here requires the 3D view.',
    stillLabel: 'Still diagram',
    fallbackTitle: 'The 3D scene is not available',
    fallbackBody:
      'Your browser or device could not start the 3D view. The still diagram and every chapter remain fully usable.',
    retry: 'Try the 3D scene again',
    openRead: 'Open Read mode',
    schematicNote: 'Schematic elevation. Proportions are illustrative, not measured.',
    realmBandLabel: '{realm} zone',
  },
  evidence: {
    legendTitle: 'How to read the labels',
    labels: {
      documented: 'Documented fact',
      inferred: 'Scholarly inference',
      artistic: 'Artistic illustration',
    } satisfies Record<EvidenceStatus, string>,
    descriptions: {
      documented: 'Stated by a cited institution, publication or record.',
      inferred: 'A reasoned reconstruction from cited evidence; uncertainty remains.',
      artistic: 'An illustration made for this project with no claim to historical accuracy.',
    } satisfies Record<EvidenceStatus, string>,
    review: {
      draft: 'Draft — awaiting editorial review',
      'needs-review': 'Awaiting editorial review',
      reviewed: 'Editorially reviewed',
    } satisfies Record<ReviewStatus, string>,
    visualLabel: 'Visual: {label}',
  },
  sources: {
    open: 'Sources and evidence',
    drawerTitle: 'Sources for this chapter',
    close: 'Close sources',
    statementsHeading: 'Statements in this view',
    noStatements:
      'This view makes no historical statements. It demonstrates the interface with illustrative content only.',
    sourcesHeading: 'References',
    mediaHeading: 'Visual material',
    supports: 'Source',
    publisher: 'Publisher',
    accessed: 'Accessed {date}',
    sourceTypes: {
      official: 'Official institution',
      scholarly: 'Scholarly publication',
      archival: 'Archival record',
      other: 'Other',
    },
    creator: 'Creator',
    license: 'License',
    licenseNames: { 'project-original': 'Original project work (no third-party rights)' } as Record<
      string,
      string
    >,
    rights: 'Rights status',
    rightsOriginal: 'Original work authored in this repository',
    rightsReviewed: 'Third-party work — rights reviewed',
    rightsPending: 'Third-party work — rights NOT yet reviewed',
    allSources: 'Full source list',
    citation: 'Source: {title}',
  },
  era: {
    groupLabel: 'Era',
    note: 'Changes between eras are visual transitions, not historical dates or a continuous record.',
    announce: 'Era: {label}',
    railLabel: 'Era timeline',
    previous: 'Previous era',
    next: 'Next era',
    position: 'Era {current} of {total}',
    statementHeading: 'What the source says',
    visualHeading: 'What the picture shows',
  },
  architecture: {
    viewLabel: 'View',
    view3d: '3D model',
    viewDiagram: 'Diagram',
    featuresHeading: 'Features in the drawing',
    selectHint: 'Select a feature to highlight it in the drawing.',
    clear: 'Clear highlight',
    announce: 'Highlighted: {title}',
    calloutNote: 'Numbers in the diagram match the list of features.',
  },
  realm: {
    groupLabel: 'Realm',
    note: 'A symbolic reading of the architecture, not a physical or historical route.',
    announce: 'Realm: {title}',
    up: 'Up',
    down: 'Down',
    upTo: 'Up: {title}',
    downTo: 'Down: {title}',
    top: 'Up (this is the highest zone)',
    bottom: 'Down (this is the lowest zone)',
    position: 'Zone {current} of {total}, counted from the base',
    diagramLabel: 'Position of this zone in the drawing',
  },
  recap: {
    heading: 'What this journey covered',
    intro: 'Each statement comes from the cited source and still awaits editorial review.',
  },
  relief: {
    demoBanner: 'DEMO ARTWORK — NOT ORIGINAL RELIEF',
    demoNotice: 'Demonstration artwork — not a specific original panel',
    heading: 'Relief stories',
    catalogLabel: 'Demonstration stories',
    hotspot: 'Story {n}',
    open: 'Open story {n}',
    openTitled: 'Open story {n}: {title}',
    close: 'Close story',
    previous: 'Previous story',
    next: 'Next story',
    position: 'Story {current} of {total}',
    aboutHeading: 'About this entry',
    locationHeading: 'Location on the monument',
    locationDemo:
      'None. This is a demonstration entry and does not correspond to any place on the monument.',
    descriptionHeading: 'Text description of the artwork',
    sourcesHeading: 'Statements and sources',
    noStatements:
      'This demonstration entry makes no historical statements, so it cites no sources.',
    statusHeading: 'Certainty and rights',
    announce: 'Opened story {n}: {title}',
  },
  read: {
    title: 'Borobudur — read the story',
    intro:
      'The complete five-chapter narrative as text, with diagrams and citations. No 3D graphics, sound or animation are needed.',
    tocLabel: 'Chapters on this page',
    openInExperience: 'Open “{title}” in the interactive experience',
    erasHeading: 'Four period views',
    realmsHeading: 'Three realms',
    referencesHeading: 'References',
    figureLabel: 'Figure',
  },
  sourcesPage: {
    title: 'Sources and media',
    intro:
      'Every historical statement in this project links to a reference below. Every visual lists who made it and under which rights.',
    statementsHeading: 'Statements and their evidence',
    correctionsHeading: 'Corrections',
    correctionsBody:
      'A public correction contact has not been designated yet. This is a known blocker for any public release of this prototype.',
    supportsHeading: 'Statements this reference supports',
  },
  about: {
    title: 'About this project and its visuals',
    intro:
      'This is a research prototype of an educational experience. It is not a museum-certified exhibit.',
    methodHeading: 'How the visuals were made',
    method: [
      'The 3D monument and the elevation diagram are drawn by code written for this project. They show a base, five square terraces, three circular platforms, a central stupa and small stupas, because those counts are described by the cited UNESCO source.',
      'No measurements, scans, photographs or surveyed data of the monument were used. Sizes, proportions, materials, lighting and camera positions are design choices.',
      'The way the small stupas are distributed across the three circular platforms in the drawing is a drawing choice that has not yet been checked against a source.',
      'The relief artwork is an abstract demonstration. It does not depict any carving on the monument.',
    ],
    limitsHeading: 'Limits you should know',
    limits: [
      'Historical statements are drafts taken from one official source and have not yet been reviewed by a heritage specialist.',
      'The Indonesian text has not yet been reviewed by a native editor.',
      'The four period views are visual treatments of one illustrative model. They are not reconstructions of how the monument looked.',
      'No audio, photographs, scans or third-party media are included.',
    ],
    creditsHeading: 'Credits and licenses',
    credits: [
      'Illustrations and 3D geometry: original work by the project team, authored in this repository.',
      'Typefaces: Instrument Serif and Inter, self-hosted under the SIL Open Font License 1.1.',
      'Software: Next.js, React, three.js, React Three Fiber, drei and GSAP, used under their respective open-source or standard no-charge licenses.',
    ],
    legendHeading: 'Evidence labels',
    version: 'Version {version} — research prototype',
  },
  landing: {
    heading: 'Borobudur',
    sub: 'The Living Monument',
    lead: 'An interactive introduction to a monument in Central Java, Indonesia.',
    start: 'Start the experience',
    read: 'Read the story',
  },
};

export type Dictionary = typeof en;

const id: Dictionary = {
  meta: {
    siteName: 'Borobudur — Monumen yang Hidup',
    description:
      'Pengantar interaktif tentang Borobudur dengan rujukan sumber. Prototipe riset: visual bersifat ilustratif, bukan rekonstruksi berdasarkan survei.',
  },
  common: {
    skipToContent: 'Langsung ke konten',
    wordmark: 'Borobudur',
    tagline: 'Monumen yang Hidup',
    prototypeLabel: 'Prototipe riset',
    illustrativeLabel: 'Geometri ilustratif — bukan rekonstruksi berdasarkan survei',
    externalLink: 'membuka situs eksternal',
    languageLabel: 'Bahasa',
    languageNames: { en: 'English', id: 'Bahasa Indonesia' },
    switchLanguage: 'Ganti bahasa ke {language}',
    mainNavLabel: 'Situs',
    soundOff: 'Suara: tidak ada dalam prototipe ini',
  },
  nav: {
    experience: 'Pengalaman',
    read: 'Baca',
    sources: 'Sumber',
    about: 'Tentang',
  },
  modes: {
    label: 'Mode tampilan',
    guided: 'Terpandu',
    explore: 'Jelajah',
    read: 'Baca',
    guidedHint: 'Ikuti lima bab dengan kamera terpandu.',
    exploreHint: 'Gerakkan kamera sendiri.',
    readHint: 'Versi teks dengan diagram dan rujukan.',
    announce: 'Mode: {mode}',
  },
  chapters: {
    railLabel: 'Bab',
    progress: 'Bab {current} dari {total}',
    progressShort: '{current} / {total}',
    next: 'Lanjut',
    back: 'Kembali',
    nextTo: 'Lanjut: {title}',
    backTo: 'Kembali: {title}',
    firstChapter: 'Kembali (ini bab pertama)',
    lastChapter: 'Lanjut (ini bab terakhir)',
    announce: 'Bab {current} dari {total}: {title}',
    endTitle: 'Akhir perjalanan',
    endBody:
      'Tinjau setiap pernyataan beserta sumbernya, atau baca seluruh kisah dalam bentuk teks.',
    captions: {
      awakening:
        'Latar dan garis bentuk monumen yang ditampilkan di sini adalah ilustrasi sintetis yang dibuat untuk prototipe ini.',
      centuries:
        'Kamera tetap diam sementara gaya gambar berubah. Setiap gaya adalah perlakuan visual, bukan catatan tentang rupa monumen pada masa itu.',
      architecture:
        'Diagram menghitung tingkat sebagaimana dijelaskan UNESCO. Ukuran dan proporsinya tidak diukur.',
      stories:
        'Bab ini memperlihatkan cara kisah relief akan disajikan. Karya gambarnya adalah demonstrasi, bukan pahatan dari monumen.',
      ascent:
        'Ketiga zona mengikuti penafsiran yang dijelaskan UNESCO. Lintasan kamera bukan rute berjalan yang nyata ataupun historis.',
    },
  },
  hero: {
    begin: 'Mulai perjalanan',
    exploreFreely: 'Jelajahi dengan bebas',
    readInstead: 'Baca saja',
    skipIntro: 'Lewati pembukaan',
    entryLabel: 'Pilih cara memulai',
    noAudio: 'Tidak ada audio yang diputar dalam prototipe ini.',
  },
  scene: {
    regionLabel: 'Visualisasi monumen',
    show3d: 'Tampilkan adegan 3D',
    loading: 'Memuat adegan 3D… Semua teks dan kontrol sudah dapat digunakan.',
    cancelLoading: 'Gunakan diagram diam saja',
    canvasDescription:
      'Tampilan 3D interaktif dari model monumen ilustratif. Informasi yang sama tersedia di panel teks dan di mode Baca.',
    exploreHint:
      'Seret untuk memutar. Gulir atau cubit untuk memperbesar. Tidak ada yang mengharuskan tampilan 3D.',
    stillLabel: 'Diagram diam',
    fallbackTitle: 'Adegan 3D tidak tersedia',
    fallbackBody:
      'Peramban atau perangkat Anda tidak dapat memulai tampilan 3D. Diagram diam dan semua bab tetap dapat digunakan sepenuhnya.',
    retry: 'Coba lagi adegan 3D',
    openRead: 'Buka mode Baca',
    schematicNote: 'Skema tampak. Proporsi bersifat ilustratif, tidak diukur.',
    realmBandLabel: 'Zona {realm}',
  },
  evidence: {
    legendTitle: 'Cara membaca label',
    labels: {
      documented: 'Fakta terdokumentasi',
      inferred: 'Inferensi ilmiah',
      artistic: 'Ilustrasi artistik',
    },
    descriptions: {
      documented: 'Dinyatakan oleh lembaga, publikasi, atau catatan yang dirujuk.',
      inferred: 'Rekonstruksi bernalar dari bukti yang dirujuk; ketidakpastian tetap ada.',
      artistic: 'Ilustrasi yang dibuat untuk proyek ini tanpa klaim ketepatan sejarah.',
    },
    review: {
      draft: 'Draf — menunggu peninjauan redaksi',
      'needs-review': 'Menunggu peninjauan redaksi',
      reviewed: 'Telah ditinjau redaksi',
    },
    visualLabel: 'Visual: {label}',
  },
  sources: {
    open: 'Sumber dan bukti',
    drawerTitle: 'Sumber untuk bab ini',
    close: 'Tutup sumber',
    statementsHeading: 'Pernyataan dalam tampilan ini',
    noStatements:
      'Tampilan ini tidak memuat pernyataan sejarah. Tampilan ini hanya mendemonstrasikan antarmuka dengan konten ilustratif.',
    sourcesHeading: 'Rujukan',
    mediaHeading: 'Materi visual',
    supports: 'Sumber',
    publisher: 'Penerbit',
    accessed: 'Diakses {date}',
    sourceTypes: {
      official: 'Lembaga resmi',
      scholarly: 'Publikasi ilmiah',
      archival: 'Catatan arsip',
      other: 'Lainnya',
    },
    creator: 'Pembuat',
    license: 'Lisensi',
    licenseNames: { 'project-original': 'Karya asli proyek (tanpa hak pihak ketiga)' },
    rights: 'Status hak',
    rightsOriginal: 'Karya asli yang dibuat dalam repositori ini',
    rightsReviewed: 'Karya pihak ketiga — hak telah ditinjau',
    rightsPending: 'Karya pihak ketiga — hak BELUM ditinjau',
    allSources: 'Daftar sumber lengkap',
    citation: 'Sumber: {title}',
  },
  era: {
    groupLabel: 'Era',
    note: 'Perubahan antar-era adalah transisi visual, bukan tanggal sejarah ataupun catatan yang berkesinambungan.',
    announce: 'Era: {label}',
    railLabel: 'Lini masa era',
    previous: 'Era sebelumnya',
    next: 'Era berikutnya',
    position: 'Era {current} dari {total}',
    statementHeading: 'Yang dinyatakan sumber',
    visualHeading: 'Yang diperlihatkan gambar',
  },
  architecture: {
    viewLabel: 'Tampilan',
    view3d: 'Model 3D',
    viewDiagram: 'Diagram',
    featuresHeading: 'Unsur dalam gambar',
    selectHint: 'Pilih salah satu unsur untuk menyorotnya dalam gambar.',
    clear: 'Hapus sorotan',
    announce: 'Disorot: {title}',
    calloutNote: 'Angka dalam diagram sesuai dengan daftar unsur.',
  },
  realm: {
    groupLabel: 'Alam',
    note: 'Pembacaan simbolis atas arsitektur, bukan rute fisik ataupun historis.',
    announce: 'Alam: {title}',
    up: 'Naik',
    down: 'Turun',
    upTo: 'Naik: {title}',
    downTo: 'Turun: {title}',
    top: 'Naik (ini zona tertinggi)',
    bottom: 'Turun (ini zona terendah)',
    position: 'Zona {current} dari {total}, dihitung dari dasar',
    diagramLabel: 'Letak zona ini dalam gambar',
  },
  recap: {
    heading: 'Yang dibahas dalam perjalanan ini',
    intro:
      'Setiap pernyataan berasal dari sumber yang dirujuk dan masih menunggu peninjauan redaksi.',
  },
  relief: {
    demoBanner: 'KARYA DEMO — BUKAN RELIEF ASLI',
    demoNotice: 'Karya demonstrasi — bukan panel asli tertentu',
    heading: 'Kisah relief',
    catalogLabel: 'Kisah demonstrasi',
    hotspot: 'Kisah {n}',
    open: 'Buka kisah {n}',
    openTitled: 'Buka kisah {n}: {title}',
    close: 'Tutup kisah',
    previous: 'Kisah sebelumnya',
    next: 'Kisah berikutnya',
    position: 'Kisah {current} dari {total}',
    aboutHeading: 'Tentang entri ini',
    locationHeading: 'Letak pada monumen',
    locationDemo:
      'Tidak ada. Ini entri demonstrasi dan tidak berkaitan dengan tempat mana pun pada monumen.',
    descriptionHeading: 'Deskripsi teks karya gambar',
    sourcesHeading: 'Pernyataan dan sumber',
    noStatements:
      'Entri demonstrasi ini tidak memuat pernyataan sejarah sehingga tidak merujuk sumber.',
    statusHeading: 'Kepastian dan hak',
    announce: 'Kisah {n} dibuka: {title}',
  },
  read: {
    title: 'Borobudur — baca kisahnya',
    intro:
      'Narasi lengkap lima bab dalam bentuk teks, dengan diagram dan rujukan. Tidak memerlukan grafik 3D, suara, ataupun animasi.',
    tocLabel: 'Bab di halaman ini',
    openInExperience: 'Buka “{title}” dalam pengalaman interaktif',
    erasHeading: 'Empat tampilan periode',
    realmsHeading: 'Tiga alam',
    referencesHeading: 'Rujukan',
    figureLabel: 'Gambar',
  },
  sourcesPage: {
    title: 'Sumber dan media',
    intro:
      'Setiap pernyataan sejarah dalam proyek ini terhubung ke rujukan di bawah. Setiap visual mencantumkan pembuat dan status haknya.',
    statementsHeading: 'Pernyataan dan buktinya',
    correctionsHeading: 'Koreksi',
    correctionsBody:
      'Kontak koreksi publik belum ditetapkan. Hal ini merupakan penghambat yang diketahui bagi rilis publik prototipe ini.',
    supportsHeading: 'Pernyataan yang didukung rujukan ini',
  },
  about: {
    title: 'Tentang proyek ini dan visualnya',
    intro:
      'Ini adalah prototipe riset untuk pengalaman edukatif. Ini bukan pameran bersertifikasi museum.',
    methodHeading: 'Cara visual dibuat',
    method: [
      'Monumen 3D dan diagram tampak digambar oleh kode yang ditulis untuk proyek ini. Keduanya memperlihatkan bagian dasar, lima teras persegi, tiga pelataran melingkar, stupa utama, dan stupa-stupa kecil, karena jumlah tersebut dijelaskan oleh sumber UNESCO yang dirujuk.',
      'Tidak ada pengukuran, pemindaian, foto, ataupun data survei monumen yang digunakan. Ukuran, proporsi, material, pencahayaan, dan posisi kamera adalah pilihan desain.',
      'Cara stupa-stupa kecil dibagi pada tiga pelataran melingkar dalam gambar adalah pilihan gambar yang belum diperiksa terhadap sumber.',
      'Karya relief adalah demonstrasi abstrak. Karya itu tidak menggambarkan pahatan apa pun pada monumen.',
    ],
    limitsHeading: 'Batasan yang perlu Anda ketahui',
    limits: [
      'Pernyataan sejarah masih berupa draf dari satu sumber resmi dan belum ditinjau oleh ahli warisan budaya.',
      'Teks bahasa Indonesia belum ditinjau oleh penyunting penutur asli.',
      'Empat tampilan periode adalah perlakuan visual atas satu model ilustratif, bukan rekonstruksi rupa monumen pada masa itu.',
      'Tidak ada audio, foto, pindaian, ataupun media pihak ketiga yang disertakan.',
    ],
    creditsHeading: 'Kredit dan lisensi',
    credits: [
      'Ilustrasi dan geometri 3D: karya asli tim proyek, dibuat dalam repositori ini.',
      'Huruf: Instrument Serif dan Inter, dihosting sendiri di bawah SIL Open Font License 1.1.',
      'Perangkat lunak: Next.js, React, three.js, React Three Fiber, drei, dan GSAP, digunakan sesuai lisensi sumber terbuka atau lisensi standar tanpa biaya masing-masing.',
    ],
    legendHeading: 'Label bukti',
    version: 'Versi {version} — prototipe riset',
  },
  landing: {
    heading: 'Borobudur',
    sub: 'Monumen yang Hidup',
    lead: 'Pengantar interaktif tentang sebuah monumen di Jawa Tengah, Indonesia.',
    start: 'Mulai pengalaman',
    read: 'Baca kisahnya',
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, id };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Fills `{name}` placeholders; whole sentences stay in the dictionary so grammar is never concatenated. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
