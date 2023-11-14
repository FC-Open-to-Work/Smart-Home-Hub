import React, {createContext, useReducer, useContext} from "react";
import {LayoutItemsType} from "../util/layoutItemTypes";
import {
    getCurrentUserBeds,
    getCurrentUserLights,
    getCurrentUserWalls,
    setCurrentUserLights
} from "../api/layoutItemsAPI";

type Action = { type: "GET_WALLS" }
    | { type: "GET_BEDS" }
    | { type: "GET_LIGHTS" }
    | { type: "TOGGLE_LIGHT", payload: { index: number } };
type Dispatch = (action: Action) => void;
type LayoutItemsProviderProps = { children: React.ReactNode };

const LayoutItemsContext = createContext<LayoutItemsType>({walls: [], beds: [], lights: []});
const LayoutItemsDispatchContext = createContext<Dispatch>(() => null);

const layoutItemsReducer = (state: LayoutItemsType, action: Action) => {
    switch (action.type) {
        case "GET_WALLS":
            return {
                ...state,
                walls: getCurrentUserWalls()
            };
        case "GET_BEDS":
            return {
                ...state,
                beds: getCurrentUserBeds()
            };
        case "GET_LIGHTS":
            return {
                ...state,
                lights: getCurrentUserLights()
            };
        case "TOGGLE_LIGHT":
            return {
                ...state,
                lights: setCurrentUserLights(state.lights, action.payload.index)
            };
        // default:
        //   throw new Error(`Unknown action type: ${typeof action}`);
    }
}

export const LayoutItemsProvider = ({children}: LayoutItemsProviderProps) => {
    const [layoutItems, dispatch] = useReducer(layoutItemsReducer, {walls: [], beds: [], lights: []});

    return (
        <LayoutItemsDispatchContext.Provider value={dispatch}>
            <LayoutItemsContext.Provider value={layoutItems}>
                {children}
            </LayoutItemsContext.Provider>
        </LayoutItemsDispatchContext.Provider>
    );
}

export const useLayoutItemsState = () => useContext(LayoutItemsContext);
export const useLayoutItemsDispatch = () => useContext(LayoutItemsDispatchContext);