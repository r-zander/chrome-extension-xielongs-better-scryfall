import {ContentScriptModule, FeaturePerView} from "../core/ContentScriptModule";
import {ViewType} from "../core/ViewType";
import {DeckOverviewFiltering} from "./DeckOverviewFiltering";

export class DeckTags implements ContentScriptModule {
    register(): FeaturePerView {
        return {
            [ViewType.DECKS_OVERVIEW]: new DeckOverviewFiltering()
        };
    }

}
