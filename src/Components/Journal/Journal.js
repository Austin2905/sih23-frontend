import React, { Component } from "react";
import DiaryForm from "./DiaryForm";
import DiaryItem from "./DiaryItem";
import { Modal } from "react-bootstrap";
import "./journal.css"

export class Journal extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            activeItem: null,
            diaryItems: []
        };
    }

    componentDidMount() {
        const entriesFromStorage = this.getEntriesFromStorage();
        if (entriesFromStorage) {
          this.setState({ diaryItems: entriesFromStorage });
        }
    }

    getEntriesFromStorage() {
       return JSON.parse(
        window.localStorage.getItem('journalEntries')
      );
    }

    setEntriesToStorage(items){
        window.localStorage.setItem('journalEntries', JSON.stringify(items));
    }

    addItem(item) {
        const newEntries = [item, ...this.state.diaryItems];
        this.setState({diaryItems: newEntries});
        this.setEntriesToStorage(newEntries);
    }
      
    deleteItem(index) {
        const updatedItems = [...this.state.diaryItems];
        updatedItems.splice(index, 1);
        this.setState({ diaryItems: updatedItems });
        this.setEntriesToStorage(updatedItems);
    }

    render() {
        const { addItem, deleteItem } = this.props;
        const { show, activeItem } = this.state
        return (
            <div className="diary-app-container">
                <div className="grid-container">
                    <div className="diary-app">
                        <h1>Dear Diary...</h1>
                        <DiaryForm addItem={(item) => this.addItem(item)} />
                    </div>
                    <div className="diary-app" style={{ paddingTop: 20 }}>
                        {this.state.diaryItems.length > 0 ? (
                            this.state.diaryItems.map((item) => {
                                return (
                                    <DiaryItem
                                        deleteItem={(id) => this.deleteItem(id)}
                                        showModal={(item) =>
                                            this.setState({ show: true, activeItem: item })
                                        }
                                        key={item.id}
                                        item={item}
                                    />
                                );
                            })
                        ) : (
                            <h1>No Items</h1>
                        )}
                    </div>
                </div>
                <Modal
                    size="lg"
                    show={show}
                    onHide={() => this.setState({ show: false })}
                    aria-labelledby="example-modal-sizes-title-lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg">
                            {activeItem?.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{activeItem?.text}</Modal.Body>
                    <Modal.Footer>{activeItem?.date}</Modal.Footer>
                </Modal>
            </div>
        );
    }
}


export default Journal;
