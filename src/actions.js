export const setVersion = (version) => {
    return {
        type: 'SET_VERSION',
        payload: version
    };
};

export const setModLoader = (modLoader) => {
    return {
        type: 'SET_MODLOADER',
        payload: modLoader
    };
};
