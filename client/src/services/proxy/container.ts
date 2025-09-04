import {
	getContainerDetailApi,
	getListContainerApi,
	killContainerApi,
	removeContainerAPi,
	restartContainerApi,
} from "@/services/api/container";
import type { IContainerDetail } from "@/type/container_detail";

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
