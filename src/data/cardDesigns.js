
export const CARD_DESIGNS = {
    'standard': {
        id: 'standard',
        name: 'Standard (CSS)',
        type: 'css',
        className: 'fut-card-bg'
    },
    'time-warp': {
        id: 'time-warp',
        name: 'Time Warp',
        type: 'image',
        url: 'https://cdn3.futbin.com/content/fifa26/img/cards/hd/108_time_warp.png?fm=png&ixlib=java-2.1.0&w=644&s=4ca0c11c94d4ebb21601238a4cfb1ef3',
        textColor: '#e0faff',
        borderColor: '#00f2ff'
    },
    'custom': {
        id: 'custom',
        name: 'Custom URL',
        type: 'image',
        url: '', // User will provide
        textColor: '#fff'
    }
};

export const VALID_DESIGNS = [
    CARD_DESIGNS['standard'],
    CARD_DESIGNS['time-warp'],
    CARD_DESIGNS['custom']
];
