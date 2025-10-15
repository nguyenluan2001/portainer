import { flattenDeep } from 'lodash';

export const templateKeys = {
    prefix: ['networking'],
    createKey: (...args: any[]) => flattenDeep([templateKeys.prefix, args]),

    getNetworkList: (...args: any) =>
        templateKeys.createKey(['get-network-list', ...args])
};
