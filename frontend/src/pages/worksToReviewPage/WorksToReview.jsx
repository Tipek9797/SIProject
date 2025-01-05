import React, { useState, useEffect } from 'react';
import {
    InputTextarea,
    ScrollPanel,
    DataTable,
    InputText,
    Fieldset,
    TabPanel,
    DataView,
    TabView,
    Divider,
    ListBox,
    Button,
    Editor,
    Dialog,
    Rating,
    Column,
    Tag
} from "../../components/index";
import "./worksToReview.css";
import { ReviewService } from './service/ReviewService';

export default function WorksToReview() {
    // Databaza --------------------------------------------------------------------------------------------------------
    const [Reviews, setProducts] = useState([]);

    // Dialog ----------------------------------------------------------------------------------------------------------
    const [archiveVisible, setArchiveVisible] = useState(false);
    const [ratingVisible, setRatingVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);

    // Dialog Na Ohodnotenie/Upravu ------------------------------------------------------------------------------------
    const renderHeader = () => {
        return (
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
            </span>
        );
    };
    const header = renderHeader();
    const [text, setText] = useState('');
    const [plusList, setPlusList] = useState([]);
    const [minusList, setMinusList] = useState([]);
    const [selectedPlusItem, setSelectedPlusItem] = useState(null);
    const [selectedMinusItem, setSelectedMinusItem] = useState(null);
    const addToPlusList = () => {
        if (text.trim()) {
            setPlusList([...plusList, text.trim()]);
            setText('');
        }
    };
    const addToMinusList = () => {
        if (text.trim()) {
            setMinusList([...minusList, text.trim()]);
            setText('');
        }
    };
    const deleteFromPlusList = () => {
        if (selectedPlusItem) {
            setPlusList(plusList.filter(item => item !== selectedPlusItem));
            setSelectedPlusItem(null);
        }
    };
    const deleteFromMinusList = () => {
        if (selectedMinusItem) {
            setMinusList(minusList.filter(item => item !== selectedMinusItem));
            setSelectedMinusItem(null);
        }
    };
    const ratingFooterContent = (
        <div>
            <Button label="Ohodnotiť"
                    icon="pi pi-star-fill"
                    className="p-button-rounded"
                    onClick={() => setRatingVisible(false)}
            />
        </div>
    );

    // Dialog Na Upravu ------------------------------------------------------------------------------------------------
    const editFooterContent = (
        <div>
            <Button label="Upraviť"
                    icon="pi pi-user-edit"
                    severity="warning"
                    className="p-button-rounded"
                    onClick={() => setEditVisible(false)}/>
        </div>
    );

    // Placeholder -----------------------------------------------------------------------------------------------------
    const [starValue, setStarValue] = useState(null);
    const [editorTextValue, setEditorTextValue] = useState('');
    const [textValue] = useState('Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. Sem Posudok od Recenzenta. ');
    const ratings = [
        { pros: "Positive", cons: "Great design" },
        { pros: "Positive", cons: "User-friendly" },
        { pros: "Positive", cons: "Responsive layout" },
        { pros: "Negative", cons: "Slow loading" },
        { pros: "Negative", cons: "Limited features" },
        { pros: "Negative", cons: "Occasional bugs" },
    ];

    // Databaza + Grid Usporiadanie ------------------------------------------------------------------------------------
    useEffect(() => {
        ReviewService.getProducts().then((data) => setProducts(data.slice(0, 12)));
    }, []);

    const getSeverity = (hodnotenie) => {
        switch (hodnotenie.inventoryStatus) {
            case 'OHODNOTENÉ':
                return 'success';

            case 'UPRAVENÉ':
                return 'warning';

            case 'NEOHODNOTENÉ':
                return 'danger';

            default:
                return null;
        }
    };

    const gridItemToReview = (review) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={review.id}>
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-tag"></i>
                            <span className="font-semibold">{review.category}</span>
                        </div>
                        <Tag value={review.inventoryStatus} severity={getSeverity(review)}></Tag>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <div className="text-2xl font-bold">{review.name}</div>
                        <div className="font-semibold">{review.description}</div>
                        <div className="font-bold">Škola: <i className="font-semibold">{review.school}</i></div>
                        <div className="font-bold">Odbor: <i className="font-semibold">{review.odbor}</i></div>
                        <div className="font-bold ">Termín: <i className="text-2xl">{review.price}</i></div>
                    </div>
                    <div className="botombutton align-items-center justify-content-between">
                        <Button label="Ohodnotiť" icon="pi pi-star-fill" className="p-button-rounded" onClick={() => setRatingVisible(true)}/>
                    </div>
                </div>
            </div>
        );
    };

    const gridItemUpdate = (review) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={review.id}>
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-tag"></i>
                            <span className="font-semibold">{review.category}</span>
                        </div>
                        <Tag value={review.inventoryStatus} severity={getSeverity(review)}></Tag>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <div className="text-2xl font-bold">{review.name}</div>
                        <div className="font-semibold">{review.description}</div>
                        <div className="font-bold">Škola: <i className="font-semibold">{review.school}</i></div>
                        <div className="font-bold">Odbor: <i className="font-semibold">{review.odbor}</i></div>
                        <Rating value={review.rating} readOnly cancel={false}></Rating>
                        <div className="font-bold ">Termín: <i className="text-2xl">{review.price}</i></div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <Button label="Otvoriť" icon="pi pi-external-link" severity="secondary" className="p-button-rounded" onClick={() => setArchiveVisible(true)}/>
                        <Button label="Upraviť" icon="pi pi-user-edit" severity="warning" className="p-button-rounded" onClick={() => setEditVisible(true)}/>
                        <Button label="Sťiahnuť" icon="pi pi-download" severity="success" className="p-button-rounded"/>
                    </div>
                </div>
            </div>
        );
    };

    const gridItemArchive = (review) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={review.id}>
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-tag"></i>
                            <span className="font-semibold">{review.category}</span>
                        </div>
                        <Tag value={review.inventoryStatus} severity={getSeverity(review)}></Tag>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <div className="text-2xl font-bold">{review.name}</div>
                        <div className="font-semibold">{review.description}</div>
                        <div className="font-bold">Škola: <i className="font-semibold">{review.school}</i></div>
                        <div className="font-bold">Odbor: <i className="font-semibold">{review.odbor}</i></div>
                        <Rating value={review.rating} readOnly cancel={false}></Rating>
                    </div>
                    <div className="flex botombutton align-items-center justify-content-between">
                        <Button label="Otvoriť" icon="pi pi-external-link" severity="secondary" className="p-button-rounded" onClick={() => setArchiveVisible(true)}/>
                        <Button label="Sťiahnuť" icon="pi pi-download" severity="success" className="p-button-rounded"/>
                    </div>
                </div>
            </div>
        );
    };

    const ReviewTemplate = () => {
        if (!Reviews) {
            return;
        }
        return <div className="grid grid-nogutter">{Reviews.map((review) => gridItemToReview(review))}</div>;
    };

    const UpdateTemplate = () => {
        if (!Reviews) {
            return;
        }
        return <div className="grid grid-nogutter">{Reviews.map((review) => gridItemUpdate(review))}</div>;
    };

    const ArchiveTemplate = () => {
        if (!Reviews) {
            return;
        }
        return <div className="grid grid-nogutter">{Reviews.map((review) => gridItemArchive(review))}</div>;
    };

    // Return ----------------------------------------------------------------------------------------------------------
    return (
        <div className="card">
            <Fieldset legend="Recenzent" className="recenzent">
                <TabView scrollable>
                    <TabPanel header="Na Ohodnotenie" rightIcon="pi pi-calendar-clock mr-2">
                        <DataView value={Reviews} listTemplate={ReviewTemplate}/>
                    </TabPanel>
                    <TabPanel header="Ohodnotené/Upravoť" rightIcon="pi pi-pencil ml-2">
                        <DataView value={Reviews} listTemplate={UpdateTemplate}/>
                    </TabPanel>
                    <TabPanel header="Archív" rightIcon="pi pi-building-columns ml-2">
                        <DataView value={Reviews} listTemplate={ArchiveTemplate}/>
                    </TabPanel>
                </TabView>
            </Fieldset>

            {/* Dialog - Button Otvorit  ----------------------------------------------------------------------------*/}
            <Dialog className="s:dial m:dial reviewDialog"
                    header="Názov Práce Názov Práce Názov Práce Názov Práce Názov Práce"
                    visible={archiveVisible}
                    maximizable
                    onHide={() => setArchiveVisible(false)}>
                <Divider />
                <div className="review-details-text">
                    <label htmlFor="school">Názov Konferencie Názov Konferencie Názov Konferencie Názov
                        Konferencie</label><br/>
                    <div className="review-details-row">
                        <h2>Škola</h2><i className="pi pi-angle-right"></i>
                        <Divider layout="vertical"/>
                        <label htmlFor="school">Univerzita Konštantína Filozofa v Nitre</label>
                    </div>
                    <div className="review-details-row">
                        <h2>Katedra</h2><i className="pi pi-angle-right"></i>
                        <Divider layout="vertical"/>
                        <label htmlFor="department">Katedra Informatiky</label>
                    </div>
                    <div className="review-details-row">
                        <h2>Odbor</h2><i className="pi pi-angle-right"></i>
                        <Divider layout="vertical"/>
                        <label htmlFor="field">Aplikovaná Informatika</label>
                    </div>
                    <div className="review-details-row">
                        <h2>Hodnotenie</h2><i className="pi pi-angle-right"></i>
                        <Divider layout="vertical"/>
                        <Rating value={4} readOnly cancel={false}/>
                    </div>
                    <div className="review-details-row">
                        <h2>Posudok</h2><i className="pi pi-angle-down"></i>
                        <Divider layout="vertical"/>
                    </div>
                    <ScrollPanel className="scrollP">
                        <InputTextarea className="inpTextArea font-bold" disabled  autoResize value={textValue}/>
                    </ScrollPanel>
                </div>
                <div className="rating-table-container">
                    <DataTable value={ratings} className="p-datatable-sm" showGridlines>
                        <Column className="rating-column" field="pros" header="Pozitíva +"/>
                        <Column className="rating-column" field="cons" header="Negatíva -" />
                    </DataTable>
                </div>
            </Dialog>

            {/* Dialog - Button Ohodnotit  ----------------------------------------------------------------------------*/}
            <Dialog className="s:dial m:dial reviewDialog"
                    header="Názov Práce Názov Práce Názov Práce Názov Práce Názov Práce"
                    visible={ratingVisible}
                    footer={ratingFooterContent}
                    maximizable
                    onHide={() => setRatingVisible(false)}>
                <Divider />
                <div className="review-details-text">
                    <label htmlFor="school">Názov Konferencie Názov Konferencie Názov Konferencie Názov
                        Konferencie</label><br/>
                    <div className="review-details-row">
                        <h2>Škola</h2><i className="pi pi-angle-right"></i>
                        <Divider layout="vertical"/>
                        <label htmlFor="school">Univerzita Konštantína Filozofa v Nitre</label>
                    </div>
                    <div className="review-details-row">
                        <h2>Katedra</h2><i className="pi pi-angle-right"></i>
                        <Divider layout="vertical"/>
                        <label htmlFor="department">Katedra Informatiky</label>
                    </div>
                    <div className="review-details-row">
                        <h2>Odbor</h2><i className="pi pi-angle-right"></i>
                        <Divider layout="vertical"/>
                        <label htmlFor="field">Aplikovaná Informatika</label>
                    </div>
                    <div className="review-details-row">
                        <h2>Hodnotenie</h2><i className="pi pi-angle-right"></i>
                        <Divider layout="vertical"/>
                        <Rating value={starValue} onChange={(e) => setStarValue(e.value)} cancel={false} />
                    </div>
                    <div className="review-details-row">
                        <h2>Posudok</h2><i className="pi pi-angle-down"></i>
                        <Divider layout="vertical"/>
                    </div>
                    <Editor className="inpEditorText"
                            value={editorTextValue}
                            onTextChange={(e) => setEditorTextValue(e.htmlValue)}
                            headerTemplate={header}/>
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
                        <Button label="Pozitíva" icon="pi pi-plus" rounded severity="success" onClick={addToPlusList}/>
                        <Button label="Negatíva" icon="pi pi-minus" rounded severity="danger" onClick={addToMinusList}/>
                    </div>
                    <div className="flex gap-2">
                        <ListBox
                            value={selectedPlusItem}
                            options={plusList.map(item => ({label: item, value: item}))}
                            onChange={(e) => setSelectedPlusItem(e.value)}
                            className="p-d-block"
                            style={{width: '100%'}}
                        />
                        <ListBox
                            value={selectedMinusItem}
                            options={minusList.map(item => ({label: item, value: item}))}
                            onChange={(e) => setSelectedMinusItem(e.value)}
                            className="p-d-block"
                            style={{width: '100%'}}
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

            {/* Dialog - Button Upravit  ----------------------------------------------------------------------------*/}
            <Dialog className="s:dial m:dial reviewDialog"
                    header="Názov Práce Názov Práce Názov Práce Názov Práce Názov Práce"
                    visible={editVisible}
                    footer={editFooterContent}
                    maximizable
                    onHide={() => setEditVisible(false)}>
                <Divider />
                <div className="review-details-text">
                    <label htmlFor="school">Názov Konferencie Názov Konferencie Názov Konferencie Názov
                        Konferencie</label><br/>
                    <div className="review-details-row">
                        <h2>Hodnotenie Staré</h2><i className="pi pi-angle-right"></i>
                        <Divider layout="vertical"/>
                        <Rating value={4} readOnly cancel={false}/>
                    </div>
                    <div className="review-details-row">
                        <h2>Hodnotenie Nové</h2><i className="pi pi-angle-right"></i>
                        <Divider layout="vertical"/>
                        <Rating value={starValue} onChange={(e) => setStarValue(e.value)} cancel={false}/>
                    </div>
                    <div className="review-details-row">
                        <h2>Posudok Starý</h2><i className="pi pi-angle-down"></i>
                        <Divider layout="vertical"/>
                    </div>
                    <ScrollPanel className="scrollP">
                        <InputTextarea className="inpTextArea font-bold" disabled  autoResize value={textValue}/>
                    </ScrollPanel>
                    <div className="review-details-row">
                        <h2>Posudok Nový</h2><i className="pi pi-angle-down"></i>
                        <Divider layout="vertical"/>
                    </div>
                    <Editor className="inpEditorText"
                            value={editorTextValue}
                            onTextChange={(e) => setEditorTextValue(e.htmlValue)}
                            headerTemplate={header}/>
                </div>
                <div>
                    <Divider/>
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
                        <Button label="Pozitíva" icon="pi pi-plus" rounded severity="success" onClick={addToPlusList}/>
                        <Button label="Negatíva" icon="pi pi-minus" rounded severity="danger" onClick={addToMinusList}/>
                    </div>
                    <div className="flex gap-2">
                        <ListBox
                            value={selectedPlusItem}
                            options={plusList.map(item => ({label: item, value: item}))}
                            onChange={(e) => setSelectedPlusItem(e.value)}
                            className="p-d-block"
                            style={{width: '100%'}}
                        />
                        <ListBox
                            value={selectedMinusItem}
                            options={minusList.map(item => ({label: item, value: item}))}
                            onChange={(e) => setSelectedMinusItem(e.value)}
                            className="p-d-block"
                            style={{width: '100%'}}
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
        </div>
    )
}