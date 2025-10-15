import {
	GET_IMAGE_LIST_API,
	GET_NETWORK_LIST_PATH
} from "@/constant/router";
import { apiInstance } from ".";

const join = (...args: string[]) => args.join("/");

export const getNetworkListApi = () => {
	return apiInstance.get(GET_NETWORK_LIST_PATH);
};