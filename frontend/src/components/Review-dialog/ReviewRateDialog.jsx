import React, { useState, useEffect } from 'react';
import {
    InputTextarea,
    ScrollPanel,
    InputText,
    DataTable,
    Divider,
    ListBox,
    Column,
    Button,
    Dialog,
    Rating,
} from "../index";
import axios from 'axios';
import { ReviewService } from '../../pages/worksToReviewPage/service/ReviewService';

const ReviewRateDialog = ({
    visible,
    onHide,
    selectedArticle,
    selectedConference,
    ratingFooterContent,
    starValue,
    setStarValue,
    inputTextValue,
    setInputTextValue,
    text,
    setText,
    plusList,
    addToPlusList,
    selectedPlusItem,
    setSelectedPlusItem,
    deleteFromPlusList,
    minusList,
    addToMinusList,
    selectedMinusItem,
    setSelectedMinusItem,
    deleteFromMinusList,
    columns,
    onCellEditComplete,
    cellEditor,
    boldCodeBodyTemplate,
    disabledCheckboxTemplate,
    form,
    setForm,
}) => {

    useEffect(() => {
        if (visible && selectedArticle) {
            ReviewService.fetchFormData(selectedArticle.id).then(data => {
                setForm(data);
            });
        }
    }, [visible, selectedArticle, setForm]);

    const handleSubmitForm = async () => {
        const formData = {
            reviewId: selectedArticle.id,
            aktualnostNarocnostPrace: form.find(f => f.id === 'aktualnost_narocnost_prace').name,
            orientovanieStudentaProblematike: form.find(f => f.id === 'orientovanie_studenta_problematike').name,
            vhodnostZvolenychMetod: form.find(f => f.id === 'vhodnost_zvolenych_metod').name,
            rozsahUrovenDosiahnutychVysledkov: form.find(f => f.id === 'rozsah_uroven_dosiahnutych_vysledkov').name,
            analyzaInterpretaciaVysledkov: form.find(f => f.id === 'analyza_interpretacia_vysledkov').name,
            prehladnostLogickaStrukturaPrace: form.find(f => f.id === 'prehladnost_logicka_struktura_prace').name,
            formalnaJazykovaStylistickaUrovenPrace: form.find(f => f.id === 'formalna_jazykova_stylisticka_uroven_prace').name,
            pracaZodpovedaSablone: form.find(f => f.id === 'praca_zodpoveda_sablone').name,
            chybaNazovPrace: form.find(f => f.id === 'chyba_nazov_prace').name,
            chybaMenoAutora: form.find(f => f.id === 'chyba_meno_autora').name,
            chybaPracovnaEmailovaAdresa: form.find(f => f.id === 'chyba_pracovna_emailova_adresa').name,
            chybaAbstrakt: form.find(f => f.id === 'chyba_abstrakt').name,
            abstraktNesplnaRozsah: form.find(f => f.id === 'abstrakt_nesplna_rozsah').name,
            chybajuKlucoveSlova: form.find(f => f.id === 'chybaju_klucove_slova').name,
            chybajuUvodVysledkyDiskusia: form.find(f => f.id === 'chybaju_uvod_vysledky_diskusia').name,
            nieSuUvedeneZdroje: form.find(f => f.id === 'nie_su_uvedene_zdroje').name,
            chybaRef: form.find(f => f.id === 'chyba_ref').name,
            chybaRefObr: form.find(f => f.id === 'chyba_ref_obr').name,
            obrazkomChybaPopis: form.find(f => f.id === 'obrazkom_chyba_popis').name,
            prinos: form.find(f => f.id === 'prinos').name,
            nedostatky: form.find(f => f.id === 'nedostatky').name,
        };

        try {
            const existingFormResponse = await axios.get(`http://localhost:8080/api/forms/review/${selectedArticle.id}`);
            if (existingFormResponse.data.length > 0) {
                await axios.patch(`http://localhost:8080/api/forms/${existingFormResponse.data[0].id}`, formData);
            } else {
                await axios.post('http://localhost:8080/api/forms', formData);
            }
            ReviewService.fetchFormData(selectedArticle.id).then(data => {
                setForm(data);
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <>
            {selectedArticle && (
                <Dialog
                    className="s:dial m:dial reviewDialog"
                    header={selectedArticle.name}
                    visible={visible}
                    footer={ratingFooterContent}
                    maximizable
                    onHide={() => {
                        setForm(ReviewService.getProductsData());
                        onHide();
                    }}
                >
                    <Divider />
                    <div className="review-details-text">
                        <label htmlFor="school">{selectedConference.name}</label>
                        <br />
                        <div className="review-details-row">
                            <h2>Škola</h2>
                            <i className="pi pi-angle-right"></i>
                            <Divider layout="vertical" />
                            <label htmlFor="school">{selectedArticle.users[0].school.name}</label>
                        </div>
                        <div className="review-details-row">
                            <h2>Fakulta</h2>
                            <i className="pi pi-angle-right"></i>
                            <Divider layout="vertical" />
                            <label htmlFor="department">{selectedArticle.users[0].faculty.name}</label>
                        </div>
                        <div className="review-details-row">
                            <h2>Kategória</h2>
                            <i className="pi pi-angle-right"></i>
                            <Divider layout="vertical" />
                            <label htmlFor="category">{selectedArticle.categories[0].name}</label>
                        </div>
                        <div className="review-details-row">
                            <h2>Hodnotenie</h2>
                            <i className="pi pi-angle-right"></i>
                            <Divider layout="vertical" />
                            <Rating value={starValue} onChange={(e) => setStarValue(e.value)} cancel={false} />
                        </div>
                        <div className="review-details-row">
                            <h2>Posudok</h2>
                            <i className="pi pi-angle-down"></i>
                            <Divider layout="vertical" />
                        </div>
                        <ScrollPanel className="scrollP">
                            <InputTextarea
                                className="inpTextArea font-bold"
                                autoResize
                                value={inputTextValue}
                                onChange={(e) => setInputTextValue(e.target.value)}
                            />
                        </ScrollPanel>
                    </div>
                    <div className="rating-table-container">
                        <small className="flex align-items-center justify-content-center">Vyplnte stlačením políčka v stĺpci Hodnotenie.</small>
                        <DataTable value={form} size={'small'} showGridlines editMode="cell">
                            {columns.map(({ field, header }) => {
                                const isEditable = field !== 'code';
                                return (
                                    <Column
                                        key={field}
                                        field={field}
                                        header={header}
                                        className="rating-colum"
                                        body={field === 'name' ? disabledCheckboxTemplate : (field === 'code' ? boldCodeBodyTemplate : null)}
                                        editor={isEditable ? (options) => cellEditor(options) : null}
                                        onCellEditComplete={isEditable ? onCellEditComplete : null}
                                    />
                                );
                            })}
                        </DataTable>
                        <div className="flex justify-content-center">
                            <Button
                                label="Odoslať formulár"
                                icon="pi pi-send"
                                className="p-button-rounded custom-width"
                                onClick={handleSubmitForm}
                            />
                        </div>
                    </div>
                    <div>
                        <Divider />
                        <div className="flex justify-content-center">
                            <div className="flex align-items-center flex-column gap-2">
                                <InputText
                                    value={text}
                                    placeholder="Napíšte niečo..."
                                    onChange={(e) => setText(e.target.value)}
                                    style={{ width: '30rem' }}
                                />
                                <small>Stlač + Pozitíva alebo - Negatíva, na pridanie.</small>
                            </div>
                        </div>
                        <div className="plusminus flex justify-content-between">
                            <Button
                                className="custom-width"
                                label="Pozitíva"
                                icon="pi pi-plus"
                                rounded
                                severity="success"
                                onClick={addToPlusList}
                            />
                            <Button
                                className="custom-width"
                                label="Negatíva"
                                icon="pi pi-minus"
                                rounded
                                severity="danger"
                                onClick={addToMinusList}
                            />
                        </div>
                        <div className="flex gap-2">
                            <ListBox
                                value={selectedPlusItem}
                                options={plusList.map((item) => ({ label: item, value: item }))}
                                onChange={(e) => setSelectedPlusItem(e.value)}
                                className="p-d-block"
                                style={{ width: '100%' }}
                            />
                            <ListBox
                                value={selectedMinusItem}
                                options={minusList.map((item) => ({ label: item, value: item }))}
                                onChange={(e) => setSelectedMinusItem(e.value)}
                                className="p-d-block"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div className="flex py-2 justify-content-between">
                            <Button
                                label="Delete"
                                icon="pi pi-trash"
                                onClick={deleteFromPlusList}
                                severity="danger"
                                disabled={!selectedPlusItem}
                            />
                            <Button
                                label="Delete"
                                icon="pi pi-trash"
                                onClick={deleteFromMinusList}
                                severity="danger"
                                disabled={!selectedMinusItem}
                            />
                        </div>
                    </div>
                </Dialog>
            )}
        </>
    );
};

export default ReviewRateDialog;