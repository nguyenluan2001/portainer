/**
 * @see - Fundamental - https://tanstack.com/query/v4/docs/framework/react/guides/query-keys#query-keys-are-hashed-deterministically
 * @see - https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
 */

import { templateKeys as containerKeys } from "./project";

export const useQueryKeysFactory = () => {
	return {
		containerKeys,
	};
};
