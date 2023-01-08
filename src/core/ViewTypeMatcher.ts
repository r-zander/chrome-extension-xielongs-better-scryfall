import {ViewType} from "./ViewType";

export function findViewType() : ViewType {
    if (location.pathname === '/search') {
        return ViewType.SEARCH;
    }

    if (location.pathname.match(/\/decks\/?$/)) {
        return ViewType.DECKS_OVERVIEW;
    }

    if (location.pathname.match(/\/decks\//)) {
        if (document.querySelectorAll('.deck-list').length !== 0) {
            return ViewType.DECK_LIST;
        } else if (document.querySelectorAll('.card-grid').length !== 0) {
            return ViewType.DECK_VISUAL;
        } else {
            return ViewType.UNKNOWN;
        }
    }

    return ViewType.UNKNOWN;
}
