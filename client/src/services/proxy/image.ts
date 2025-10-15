import type { IImageItem } from "@/type/image";
import { getImageListApi } from "../api/image";

export const getImageListProxy = async (): Promise<IImageItem[]> => {
	try {
		const apiRes = await getImageListApi();
		if (apiRes.data?.status !== 0) {
			throw new Error(apiRes.data?.message || "Error");
		}
		return apiRes.data?.message;
	} catch (err: any) {
		console.log(err);
	}
	return [];
};