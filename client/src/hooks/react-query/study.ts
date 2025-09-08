import { flattenDeep } from 'lodash';

export const templateKeys = {
    prefix: ['study'],
    createKey: (...args: any[]) => flattenDeep([templateKeys.prefix, args]),

    //Query keys
    getListStudy: (...args: any) =>
        templateKeys.createKey(['get-list-study', ...args]),
    getListDeletedStudy: (...args: any) =>
        templateKeys.createKey(['deletedStudy', ...args]),

    //Mutation keys
    createFromBatch: (...args: any) =>
        templateKeys.createKey(['create-from-batch', ...args]),
    updateStudy: (...args: any) =>
        templateKeys.createKey(['update-study', ...args])
};
