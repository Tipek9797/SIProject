export const ReviewService = {
    getProductsData() {
        return [
            {
                id: 'aktualnost_narocnost_prace',
                type: 'drop1',
                code: 'Aktuálnosť a náročnosť práce',
                name: '',
                value: '6: (A)',
            },
            {
                id: 'orientovanie_studenta_problematike',
                type: 'drop1',
                code: 'Zorientovanie sa študenta danej problematike predovšetkým analýzou domácej a zahraničnej literatúry',
                name: '',
                value: '6: (A)',
            },
            {
                id: 'vhodnost_zvolenych_metod',
                type: 'drop1',
                code: 'Vhodnosť zvolených metód spracovania riešenej problematiky',
                name: '',
                value: '6: (A)',
            },
            {
                id: 'rozsah_uroven_dosiahnutych_vysledkov',
                type: 'drop1',
                code: 'Rozsah a úroveň dosiahnutých výsledkov',
                name: '',
                value: '6: (A)',
            },
            {
                id: 'analyza_interpretacia_vysledkov',
                type: 'drop1',
                code: 'Analýza a interpretácia výsledkov a formulácia záverov práce',
                name: '',
                value: '6: (A)',
            },
            {
                id: 'prehladnost_logicka_struktura_prace',
                type: 'drop1',
                code: 'Prehľadnosť a logická štruktúra práce',
                name: '',
                value: '6: (A)',
            },
            {
                id: 'formalna_jazykova_stylisticka_uroven_prace',
                type: 'drop1',
                code: 'Formálna, jazyková a štylistická úroveň práce',
                name: '',
                value: '6: (A)',
            },
            {
                id: 'praca_zodpoveda_sablone',
                type: 'drop2',
                code: 'Práca zodpovedá šablóne určenej pre ŠVK',
                name: '',
                value: '2: (Áno)',
            },
            {
                id: 'chyba_nazov_prace',
                type: 'bool',
                code: 'Chýba názov práce v slovenskom alebo anglickom jazyku',
                name: false,
                value: false,
            },
            {
                id: 'chyba_meno_autora',
                type: 'bool',
                code: 'Chýba meno autora alebo školiteľa',
                name: false,
                value: false,
            },
            {
                id: 'chyba_pracovna_emailova_adresa',
                type: 'bool',
                code: 'Chýba pracovná emailová adresa autora alebo školiteľa',
                name: false,
                value: false,
            },
            {
                id: 'chyba_abstrakt',
                type: 'bool',
                code: 'Chýba abstrakt v slovenskom alebo anglickom jazyku',
                name: false,
                value: false,
            },
            {
                id: 'abstrakt_nesplna_rozsah',
                type: 'bool',
                code: 'Abstrakt nesplňa rozsah 100 - 150 slov',
                name: false,
                value: false,
            },
            {
                id: 'chybaju_klucove_slova',
                type: 'bool',
                code: 'Chýbajú kľučové slová v slovenskom alebo anglickom jazyku',
                name: false,
                value: false,
            },
            {
                id: 'chybaju_uvod_vysledky_diskusia',
                type: 'bool',
                code: 'Chýba "Úvod", "Výsledky a diskusia" alebo "Záver"',
                name: false,
                value: false,
            },
            {
                id: 'nie_su_uvedene_zdroje',
                type: 'bool',
                code: 'Nie su uvedené zdroje a použita literatúra',
                name: false,
                value: false,
            },
            {
                id: 'chyba_ref',
                type: 'bool',
                code: 'V texte chýbajú referencie na zoznam bibliografie',
                name: false,
                value: false,
            },
            {
                id: 'chyba_ref_obr',
                type: 'bool',
                code: 'V texte chýbajú referencie na použité obrázky a/alebo tabuľky',
                name: false,
                value: false,
            },
            {
                id: 'obrazkom_chyba_popis',
                type: 'bool',
                code: 'Obrázkom a/alebo tabuľkám chýba popis',
                name: false,
                value: false,
            },
            {
                id: 'prinos',
                type: 'str',
                code: 'Prínos (silné stránky) práce',
                name: '',
                value: '',
            },
            {
                id: 'nedostatky',
                type: 'str',
                code: 'Nedostatky (slabé stránky) práce',
                name: '',
                value: '',
            }
        ];
    },


    getProducts() {
        return Promise.resolve(this.getProductsData());
    },
};