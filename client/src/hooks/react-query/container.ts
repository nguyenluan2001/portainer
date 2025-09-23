import { flattenDeep } from "lodash";

export const templateKeys = {
	prefix: ["container"],
	createKey: (...args: any[]) => flattenDeep([templateKeys.prefix, args]),

	getFilesystem: (...args: any) =>
		templateKeys.createKey(["get-filesystem", ...args]),
	getFileContent: (...args: any) =>
		templateKeys.createKey(["get-file-content", ...args]),
};
