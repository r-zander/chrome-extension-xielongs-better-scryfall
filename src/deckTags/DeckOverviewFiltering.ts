import {ContentScriptFeature} from "../core/ContentScriptModule";

/**
 * TODO
 *  - WIP: Color filter
 *  - Add text filter to find decks
 *  - Maybe: Empty state
 *  - Maybe: Show count per filter button
 *  - Save latest filter state in some storage
 *
 */

type TagDefinition = { deckName: string, display?: string, filterName: string };
type Options = {
    tagPrefix: string,
    tagSuffix: string,
    formatFilterPrefix: string,
    formats: Array<TagDefinition>,
    tags: Array<TagDefinition>,
}

const options: Options = {
    tagPrefix: '[',
    tagSuffix: ']',

    formatFilterPrefix: '🗃️',
    formats: [
        {
            deckName: 'CC',
            filterName: 'Casual Challenge'
        }, {
            deckName: 'MDN',
            filterName: 'Modern'
        }, {
            deckName: 'EDH',
            filterName: 'Commander'
        }
    ],
    tags: [
        {
            deckName: '✔️',
            filterName: '✔️ Ready'
        }, {
            deckName: '💹',
            filterName: '💹 BP available'
        }, {
            deckName: '🚫',
            filterName: '🚫 Not legal'
        }, {
            deckName: '💰',
            filterName: '💰 Too expensive'
        }, {
            deckName: '🏗️',
            filterName: '🏗️ WIP'
        }, {
            deckName: '🧪',
            filterName: '🧪 Testing'
        }, {
            deckName: '🐣',
            filterName: '🐣 Starter'
        }, {
            deckName: '📝',
            filterName: '📝 Reference'
        }, {
            deckName: '👻',
            display: '👻',
            filterName: '👻 Not owned'
        }, {
            deckName: '😪',
            filterName: '😪 Retired'
        },
    ],
};

const CssClasses = {
    deckTable: {
        unfiltered: 'unfiltered'
    }
}

export class DeckOverviewFiltering implements ContentScriptFeature {
    deckCountElement: HTMLElement;
    deckTable = document.querySelector('.control-panel-table');

    async init() {
        this.initFilterBars();
        this.initDeckTable();
        this.initInlineFilterBar();
        this.initDeckCount();
    }

    private initFilterBars() {
        let html = DeckOverviewFiltering.createFilterBarHtml('formats', options.formats, 'Formats');
        html += DeckOverviewFiltering.createFilterBarHtml('tags', options.tags, 'Tags');
        this.deckTable.insertAdjacentHTML('beforebegin', html);

        document.querySelectorAll('.control-panel-crumbs.deck-tags > .filter-tag-button').forEach(button => {
            button.addEventListener('click', this.filterByTag.bind(this, button));
        });
    }

    private static createFilterBarHtml(tagGroup: string, tagDefinitions: Array<TagDefinition>, label: string): string {
        let html = // @formatter:off
            `<div class="control-panel-crumbs deck-tags ${tagGroup}">
    <span>${label}:</span>`; // @formatter:on
        html += tagDefinitions.map((value, index) => // @formatter:off
            `<button class="button-n tiny filter-tag-button" data-tag-group="${tagGroup}" data-tag-index="${index}">
    ${value.filterName}
</button>` // @formatter:on
        ).join('\n');
        html += '</div>';

        return html;
    }

    private initDeckTable() {
        options.formats.forEach((tag, index) => {
            this.prepareRowsForTag('format', tag, index, true);
        });
        options.tags.forEach((tag, index) => {
            this.prepareRowsForTag('tag', tag, index, false);
        });
    }

    private prepareRowsForTag(tagGroup: string, tag: TagDefinition, index: number, wrapTag: boolean) {
        // const tagRegex = new RegExp(options.tagPrefix + tag.deckName + options.tagSuffix, 'u');
        let tagRegex: string = tag.deckName;
        if (wrapTag) {
            tagRegex = options.tagPrefix + tagRegex + options.tagSuffix;
        }
        this.deckTable.querySelectorAll('td:first-of-type > a').forEach(deckNameElement => {
            const deckName = deckNameElement.textContent;
            // if (deckName.match(tagRegex)) {
            if (deckName.includes(tagRegex)) {
                deckNameElement.closest('tr').classList.add('tagged-' + tagGroup + '-' + index);
            }
        });
    }

    private initInlineFilterBar() {
        const html = // @formatter:off
`<tr class="deck-table-filters">
    <td class="name-filter">
        <input id="deck-table-name-filter" class="name-filter-field" />
    </td>
    <td>
        <span class="color-filter"> 
            <button class="button-n icon-only filter-color-button conjoined-left" data-color="W" title="Filter for White decks">
                <span class="card-symbol card-symbol-W">{W}</span>
            </button>
            <button class="button-n icon-only filter-color-button conjoined-middle" data-color="U" title="Filter for Blue decks">
                <span class="card-symbol card-symbol-U">{U}</span>
            </button>
            <button class="button-n icon-only filter-color-button conjoined-middle" data-color="B" title="Filter for Black decks">
                <span class="card-symbol card-symbol-B">{B}</span>
            </button>
            <button class="button-n icon-only filter-color-button conjoined-middle" data-color="R" title="Filter for Red decks">
                <span class="card-symbol card-symbol-R">{R}</span>
            </button>
            <button class="button-n icon-only filter-color-button conjoined-right" data-color="G" title="Filter for Green decks">
                <span class="card-symbol card-symbol-G">{G}</span>
            </button>
        </span>
    </td>
    <td class="owner-filter"></td>
    <td class="updated-filter"></td>
    <th class="filter-header"><span>Filter decks</span></th>`;// @formatter:on
        this.deckTable.querySelector('thead').insertAdjacentHTML('beforeend', html)
        //    <a href="/@XieLong/decks/2a08ed88-d124-4646-b94a-84de4d55e421">

        //    </a>
    }

    private initDeckCount(): void {
        const topNavigationCrumbs = document.querySelector('.control-panel-content > .control-panel-crumbs');
        topNavigationCrumbs.classList.add('top-navigation');
        topNavigationCrumbs
            .querySelector('a.control-panel-crumb:first-child')
            .insertAdjacentHTML('afterend', '<span class="deck-count" title="This only counts the current page of decks."></span>');
        this.deckCountElement = topNavigationCrumbs.querySelector('.deck-count');
        this.updateDeckCount();
    }

    private filterByTag(button: HTMLButtonElement) {
        let tagDefinitions: Array<TagDefinition>;
        if (button.dataset.tagGroup === 'formats') {
            tagDefinitions = options.formats;
        } else if (button.dataset.tagGroup === 'tags') {
            tagDefinitions = options.tags;
        } else {
            console.warn('Invalid tagGroup ' + button.dataset.tagGroup);
            return;
        }

        const tagIndex = parseInt(button.dataset.tagIndex);
        if (tagIndex < 0 || tagIndex >= tagDefinitions.length) {
            console.warn('Invalid tagIndex ' + tagIndex);
            return;
        }

        this.deckTable.classList.toggle('hide-tag-' + button.dataset.tagGroup + '-' + tagIndex);
        button.classList.toggle('primary');

        this.updateDeckCount();
    }

    private updateDeckCount() {
        const rows = this.deckTable.querySelectorAll('tbody > tr');
        const totalCount = rows.length;

        if (this.deckTable.classList.length === 1) {
            this.deckCountElement.textContent = totalCount + ' total';
            return;
        }

        let shownCount = 0;
        rows.forEach(row => {
            const style = window.getComputedStyle(row);
            if (style.display !== 'none') {
                shownCount++;
            }
        });

        this.deckCountElement.textContent = shownCount + ' of ' + totalCount + ' total';
    }
}
