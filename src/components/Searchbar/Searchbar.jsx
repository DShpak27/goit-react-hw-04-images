import { useState } from 'react';
import propTypes from 'prop-types';
import { ReactComponent as FinderIcon } from '../../icons/find-icon.svg';
import css from './Searchbar.module.scss';

function Searchbar({ onSubmit, onResetButton }) {
    const [query, setQuery] = useState(() => {
        const restoredData = JSON.parse(localStorage.getItem('state'));
        return restoredData === undefined || restoredData === null
            ? ''
            : restoredData.query;
    });

    const handleInputChange = evt => {
        setQuery(evt.target.value);
    };

    const handleFormSubmit = evt => {
        evt.preventDefault();
        const query = evt.currentTarget.elements.imageFinder.value
            .trim()
            .toLowerCase();
        onSubmit(query);
    };

    const handleResetClick = () => {
        setQuery('');
        onResetButton();
    };

    return (
        <header className={css.Searchbar}>
            <form className={css.SearchForm} onSubmit={handleFormSubmit}>
                <button type="submit" className={css['SearchForm-button']}>
                    <FinderIcon width={20} height={20} />
                </button>

                <input
                    className={css['SearchForm-input']}
                    name="imageFinder"
                    type="text"
                    autoComplete="off"
                    autoFocus
                    placeholder="Search images and photos"
                    value={query}
                    onChange={handleInputChange}
                />
                <button
                    type="button"
                    className={css['SearchForm-button']}
                    onClick={handleResetClick}
                >
                    <span className={css.resetLabel}>RESET</span>
                </button>
            </form>
        </header>
    );
}

Searchbar.propTypes = {
    onSubmit: propTypes.func.isRequired,
    onResetButton: propTypes.func.isRequired,
};
export default Searchbar;
