import { flattenDeep } from 'lodash';

export const templateKeys = {
    prefix: ['image'],
    createKey: (...args: any[]) => flattenDeep([templateKeys.prefix, args]),

    getImageList: (...args: any) =>
        templateKeys.createKey(['get-image-list', ...args])
};
