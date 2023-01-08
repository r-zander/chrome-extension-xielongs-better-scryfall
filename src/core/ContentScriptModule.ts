import {ViewType} from "./ViewType";

export interface ContentScriptFeature {
    init() : Promise<void>;
}

export type FeaturePerView  = Partial<Record<ViewType, ContentScriptFeature | ContentScriptFeature[]>>;

export interface ContentScriptModule {
    register() : FeaturePerView;
}
