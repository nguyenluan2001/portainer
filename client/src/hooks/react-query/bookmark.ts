import { flattenDeep } from 'lodash';

export const templateKeys = {
    prefix: ['bookmark'],
    createKey: (...args: any[]) => flattenDeep([templateKeys.prefix, args]),

    getBookmarkList: (...args: any) =>
        templateKeys.createKey(['bookmark', ...args])
};
