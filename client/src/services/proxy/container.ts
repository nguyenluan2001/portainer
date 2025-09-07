import {
	addFolderApi,
	getContainerDetailApi,
	getContainerFsApi,
	getListContainerApi,
	killContainerApi,
	removeContainerAPi,
	removeEndpoinsApi,
	restartContainerApi,
	uploadToContainerApi,
} from "@/services/api/container";
import type { IContainerDetail } from "@/type/container_detail";
import type { IFilesystem } from "@/type/filesystem";
import type { RcFile } from "antd/es/upload";

export const getListContainerProxy = async (): Promise<any | null> => {
	try {
		const apiRes = await getListContainerApi();
		if (apiRes.data?.status !== 0) {
			throw new Error(apiRes.data?.message || "Error");
		}
		return apiRes.data?.message;
	} catch (err: any) {
		console.log(err);
	}
	return null;
};

export const getContainerDetailProxy = async (
	containerId: string,
): Promise<IContainerDetail | null> => {
	try {
		const apiRes = await getContainerDetailApi(containerId);
		if (apiRes.data?.status !== 0) {
			throw new Error(apiRes.data?.message || "Error");
		}
		return apiRes.data?.message;
	} catch (err: any) {
		console.log(err);
	}
	return null;
};

export const killContainerProxy = async (
	containerId: string,
): Promise<any | null> => {
	try {
		const apiRes = await killContainerApi(containerId);
		if (apiRes.data?.status !== 0) {
			throw new Error(apiRes.data?.message || "Error");
		}
		return apiRes.data?.message;
	} catch (err: any) {
		console.log(err);
	}
	return null;
};

export const restartContainerProxy = async (
	containerId: string,
): Promise<any | null> => {
	try {
		const apiRes = await restartContainerApi(containerId);
		if (apiRes.data?.status !== 0) {
			throw new Error(apiRes.data?.message || "Error");
		}
		return apiRes.data?.message;
	} catch (err: any) {
		console.log(err);
	}
	return null;
};

export const removeContainerProxy = async (
	containerId: string,
): Promise<any | null> => {
	try {
		const apiRes = await removeContainerAPi(containerId);
		if (apiRes.data?.status !== 0) {
			throw new Error(apiRes.data?.message || "Error");
		}
		return apiRes.data?.message;
	} catch (err: any) {
		console.log(err);
	}
	return null;
};

export const getContainerFsProxy = async (
	containerId: string,
	path: string,
): Promise<IFilesystem[] | null> => {
	try {
		const apiRes = await getContainerFsApi(containerId, path);
		if (apiRes.data?.status !== 0) {
			throw new Error(apiRes.data?.message || "Error");
		}
		return apiRes.data?.message;
	} catch (err: any) {
		console.log(err);
	}
	return null;
};

export const uploadToContainerProxy = async (
	containerId: string,
	file: RcFile,
	dstPath: string,
): Promise<IFilesystem[] | null> => {
	try {
		const apiRes = await uploadToContainerApi(containerId, file, dstPath);
		if (apiRes.data?.status !== 0) {
			throw new Error(apiRes.data?.message || "Error");
		}
		return apiRes.data?.message;
	} catch (err: any) {
		console.log(err);
	}
	return null;
};

export const removeEndpoinsProxy = async (
	containerId: string,
	endpoints: string[],
): Promise<any> => {
	try {
		const apiRes = await removeEndpoinsApi(containerId, endpoints);
		if (apiRes.data?.status !== 0) {
			throw new Error(apiRes.data?.message || "Error");
		}
		return apiRes.data?.message;
	} catch (err: any) {
		console.log(err);
	}
	return null;
};

export const addFolderProxy = async (
	containerId: string,
	dstPath: string,
	name: string,
): Promise<any> => {
	try {
		const apiRes = await addFolderApi(containerId, dstPath, name);
		if (apiRes.data?.status !== 0) {
			throw new Error(apiRes.data?.message || "Error");
		}
		return apiRes.data?.message;
	} catch (err: any) {
		console.log(err);
	}
	return null;
};
