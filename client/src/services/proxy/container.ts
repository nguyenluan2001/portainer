import { getListContainerApi } from "@/services/api/container";

export const getListContainerProxy = async (
): Promise<any | null> => {
    try {
        const apiRes = await getListContainerApi();
        return apiRes.data?.message;
    } catch (err: any) {
        console.log(err);
    }
    return null;
};
