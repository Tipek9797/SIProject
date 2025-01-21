import axios from 'axios';

export const ReviewService = {
    getProductsData(form = null) {
        return [
            {
                id: 'aktualnost_narocnost_prace',
                type: 'drop1',
                code: 'Aktuálnosť a náročnosť práce',
                name: form ? form.aktualnostNarocnostPrace : '',
                value: form ? form.aktualnostNarocnostPrace : '',
            },
            {
                id: 'orientovanie_studenta_problematike',
                type: 'drop1',
                code: 'Zorientovanie sa študenta danej problematike predovšetkým analýzou domácej a zahraničnej literatúry',
                name: form ? form.orientovanieStudentaProblematike : '',
                value: form ? form.orientovanieStudentaProblematike : '',
            },
            {
                id: 'vhodnost_zvolenych_metod',
                type: 'drop1',
                code: 'Vhodnosť zvolených metód spracovania riešenej problematiky',
                name: form ? form.vhodnostZvolenychMetod : '',
                value: form ? form.vhodnostZvolenychMetod : '',
            },
            {
                id: 'rozsah_uroven_dosiahnutych_vysledkov',
                type: 'drop1',
                code: 'Rozsah a úroveň dosiahnutých výsledkov',
                name: form ? form.rozsahUrovenDosiahnutychVysledkov : '',
                value: form ? form.rozsahUrovenDosiahnutychVysledkov : '',
            },
            {
                id: 'analyza_interpretacia_vysledkov',
                type: 'drop1',
                code: 'Analýza a interpretácia výsledkov a formulácia záverov práce',
                name: form ? form.analyzaInterpretaciaVysledkov : '',
                value: form ? form.analyzaInterpretaciaVysledkov : '',
            },
            {
                id: 'prehladnost_logicka_struktura_prace',
                type: 'drop1',
                code: 'Prehľadnosť a logická štruktúra práce',
                name: form ? form.prehladnostLogickaStrukturaPrace : '',
                value: form ? form.prehladnostLogickaStrukturaPrace : '',
            },
            {
                id: 'formalna_jazykova_stylisticka_uroven_prace',
                type: 'drop1',
                code: 'Formálna, jazyková a štylistická úroveň práce',
                name: form ? form.formalnaJazykovaStylistickaUrovenPrace : '',
                value: form ? form.formalnaJazykovaStylistickaUrovenPrace : '',
            },
            {
                id: 'praca_zodpoveda_sablone',
                type: 'drop2',
                code: 'Práca zodpovedá šablóne určenej pre ŠVK',
                name: form ? form.pracaZodpovedaSablone : '',
                value: form ? form.pracaZodpovedaSablone : '',
            },
            {
                id: 'chyba_nazov_prace',
                type: 'bool',
                code: 'Chýba názov práce v slovenskom alebo anglickom jazyku',
                name: form ? form.chybaNazovPrace : false,
                value: form ? form.chybaNazovPrace : false,
            },
            {
                id: 'chyba_meno_autora',
                type: 'bool',
                code: 'Chýba meno autora alebo školiteľa',
                name: form ? form.chybaMenoAutora : false,
                value: form ? form.chybaMenoAutora : false,
            },
            {
                id: 'chyba_pracovna_emailova_adresa',
                type: 'bool',
                code: 'Chýba pracovná emailová adresa autora alebo školiteľa',
                name: form ? form.chybaPracovnaEmailovaAdresa : false,
                value: form ? form.chybaPracovnaEmailovaAdresa : false,
            },
            {
                id: 'chyba_abstrakt',
                type: 'bool',
                code: 'Chýba abstrakt v slovenskom alebo anglickom jazyku',
                name: form ? form.chybaAbstrakt : false,
                value: form ? form.chybaAbstrakt : false,
            },
            {
                id: 'abstrakt_nesplna_rozsah',
                type: 'bool',
                code: 'Abstrakt nesplňa rozsah 100 - 150 slov',
                name: form ? form.abstraktNesplnaRozsah : false,
                value: form ? form.abstraktNesplnaRozsah : false,
            },
            {
                id: 'chybaju_klucove_slova',
                type: 'bool',
                code: 'Chýbajú kľučové slová v slovenskom alebo anglickom jazyku',
                name: form ? form.chybajuKlucoveSlova : false,
                value: form ? form.chybajuKlucoveSlova : false,
            },
            {
                id: 'chybaju_uvod_vysledky_diskusia',
                type: 'bool',
                code: 'Chýba "Úvod", "Výsledky a diskusia" alebo "Záver"',
                name: form ? form.chybajuUvodVysledkyDiskusia : false,
                value: form ? form.chybajuUvodVysledkyDiskusia : false,
            },
            {
                id: 'nie_su_uvedene_zdroje',
                type: 'bool',
                code: 'Nie su uvedené zdroje a použita literatúra',
                name: form ? form.nieSuUvedeneZdroje : false,
                value: form ? form.nieSuUvedeneZdroje : false,
            },
            {
                id: 'chyba_ref',
                type: 'bool',
                code: 'V texte chýbajú referencie na zoznam bibliografie',
                name: form ? form.chybaRef : false,
                value: form ? form.chybaRef : false,
            },
            {
                id: 'chyba_ref_obr',
                type: 'bool',
                code: 'V texte chýbajú referencie na použité obrázky a/alebo tabuľky',
                name: form ? form.chybaRefObr : false,
                value: form ? form.chybaRefObr : false,
            },
            {
                id: 'obrazkom_chyba_popis',
                type: 'bool',
                code: 'Obrázkom a/alebo tabuľkám chýba popis',
                name: form ? form.obrazkomChybaPopis : false,
                value: form ? form.obrazkomChybaPopis : false,
            },
            {
                id: 'prinos',
                type: 'str',
                code: 'Prínos (silné stránky) práce',
                name: form ? form.prinos : '',
                value: form ? form.prinos : '',
            },
            {
                id: 'nedostatky',
                type: 'str',
                code: 'Nedostatky (slabé stránky) práce',
                name: form ? form.nedostatky : '',
                value: form ? form.nedostatky : '',
            }
        ];
    },

    getProducts() {
        return Promise.resolve(this.getProductsData());
    },

    async fetchFormData(reviewId) {
        try {
            const response = await axios.get(`http://localhost:8080/api/forms/review/${reviewId}`);
            if (response.data.length > 0) {
                const formData = response.data[0];
                return this.getProductsData(formData);
            } else {
                return this.getProductsData();
            }
        } catch (error) {
            console.error('Error fetching form data:', error);
            return this.getProductsData();
        }
    }
};