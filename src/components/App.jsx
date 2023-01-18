import { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar.jsx';
import searchService from '../services/searchService.js';
import Loader from './Loader/Loader.jsx';
import Button from './Button/Button.jsx';
import Modal from './Modal/Modal.jsx';
import ImageGallery from './ImageGallery/ImageGallery.jsx';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import css from './App.module.scss';

const INITIAL_STATE = {
    data: [],
    totalFound: 0,
    status: 'idle',
    query: '',
    page: 1,
    showModal: false,
    chosenImageIndex: null,
    onErrorMessage: '',
};

function App() {
    const [state, setState] = useState(() => {
        return (
            JSON.parse(localStorage.getItem('state')) ?? {
                ...INITIAL_STATE,
            }
        );
    });

    useEffect(() => {
        window.localStorage.setItem('state', JSON.stringify(state));
    }, [state]);

    const handleButtonSubmit = query => {
        if (query === '') {
            setState({ ...INITIAL_STATE });
            return Notify.info('Try to type you neet to find!', {
                width: '450px',
                timeout: 1500,
                fontSize: '30px',
                position: 'center-center',
                showOnlyTheLastOne: true,
            });
        }
        setState({ ...state, status: 'pending' });
        searchService.currentQuery = query;
        searchService.pageNumber = 1;
        searchService
            .fetchImages()
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then(data => {
                if (data.hits.length === 0) {
                    setState({
                        ...state,
                        data: data.hits,
                        totalFound: data.total,
                        page: 1,
                        query: query,
                        status: 'nothing found',
                    });
                } else {
                    setState({
                        ...state,
                        data: data.hits,
                        totalFound: data.total,
                        page: 1,
                        query: query,
                        status: 'resolved',
                    });
                }
            })
            .catch(error => {
                setState({
                    ...state,
                    status: 'error',
                    onErrorMessage: error.message,
                });
            });
    };

    const handleButtonLoadMore = () => {
        if (
            state.totalFound /
                (searchService.resultsPerPage * (state.page + 1)) <
            1
        ) {
            return Notify.info('No more images to display', {
                width: '450px',
                timeout: 1500,
                fontSize: '30px',
                position: 'center-center',
                showOnlyTheLastOne: true,
            });
        }

        setState({ ...state, status: 'pending' });
        searchService.currentQuery = state.query;
        searchService.pageNumber = state.page + 1;
        searchService
            .fetchImages()
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then(data => {
                return setState(prevState => {
                    return {
                        ...prevState,
                        data: [...prevState.data, ...data.hits],
                        page: prevState.page + 1,
                        status: 'resolved',
                    };
                });
            })
            .catch(error => {
                setState({
                    ...state,
                    status: 'error',
                    onErrorMessage: error.message,
                });
            });
    };

    const handleGalleryImageClick = idx => {
        setState({ ...state, showModal: true, chosenImageIndex: idx });
    };

    const closeModal = () => {
        setState({ ...state, showModal: false });
    };

    const handleResetBtn = () => {
        setState({ ...INITIAL_STATE });
    };

    const { status } = state;

    switch (status) {
        case 'pending':
            return (
                <div className={css.App}>
                    <Searchbar
                        initialValue={state.query}
                        onSubmit={handleButtonSubmit}
                        onResetButton={handleResetBtn}
                    />
                    <Loader />
                </div>
            );

        case 'resolved':
            return (
                <div className={css.App}>
                    <Searchbar
                        initialValue={state.query}
                        onSubmit={handleButtonSubmit}
                        onResetButton={handleResetBtn}
                    />
                    <ImageGallery
                        imageSet={state.data}
                        onImageClick={handleGalleryImageClick}
                    />
                    <Button onBtnClick={handleButtonLoadMore}>Load more</Button>
                    {state.showModal && (
                        <Modal
                            imageToShow={state.data[state.chosenImageIndex]}
                            onEscBtn={closeModal}
                            onOverlayClick={closeModal}
                        />
                    )}
                </div>
            );

        case 'nothing found':
            return (
                <div className={css.App}>
                    <Searchbar
                        initialValue={state.query}
                        onSubmit={handleButtonSubmit}
                        onResetButton={handleResetBtn}
                    />
                    <div className={css.notification}>
                        <span>Sorry! But nothing found for your request!</span>
                        <span>Try change the requested word.</span>
                    </div>
                </div>
            );

        case 'error':
            return (
                <div className={css.App}>
                    <Searchbar
                        initialValue={state.query}
                        onSubmit={handleButtonSubmit}
                        onResetButton={handleResetBtn}
                    />
                    <div className={css.notification}>
                        <span>{state.onErrorMessage}</span>
                    </div>
                </div>
            );

        default:
            return (
                <div className={css.App}>
                    <Searchbar
                        initialValue={state.query}
                        onSubmit={handleButtonSubmit}
                        onResetButton={handleResetBtn}
                    />
                </div>
            );
    }
}

export default App;
