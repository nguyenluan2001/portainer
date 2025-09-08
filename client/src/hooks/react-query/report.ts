import { flattenDeep } from 'lodash';

export const templateKeys = {
    prefix: ['report'],
    createKey: (...args: any[]) => flattenDeep([templateKeys.prefix, args]),

    //Query keys
    getListReport: (...args: any) => templateKeys.createKey(['export', ...args])
};
