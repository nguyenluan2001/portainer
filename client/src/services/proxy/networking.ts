import type { IGetNetworkListResponse, INetworkItem } from "@/type/networking";
import { getNetworkListApi } from "../api/networking";

export const getNetworkListProxy = async (): Promise<IGetNetworkListResponse> => {
    try {
        const apiRes = await getNetworkListApi();
        if (apiRes.data?.status !== 0) {
            throw new Error(apiRes.data?.message || "Error");
        }
        return apiRes.data?.message;
    } catch (err: any) {
        console.log(err);
        return { networks: [] }
    }
};