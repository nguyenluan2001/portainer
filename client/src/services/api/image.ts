import {
	GET_IMAGE_LIST_API
} from "@/constant/router";
import { apiInstance } from ".";

const join = (...args: string[]) => args.join("/");

export const getImageListApi = () => {
	return apiInstance.get(GET_IMAGE_LIST_API);
};