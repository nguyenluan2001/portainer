import { apiInstance } from ".";
import {
	GET_CONTAINER_DETAIL_PATH,
	GET_LIST_CONTAINER_PATH,
	KILL_CONTAINER_PATH,
	REMOVE_CONTAINER_PATH,
	RESTART_CONTAINER_PATH,
} from "@/constant/router";

const join = (...args: string[]) => args.join("/");

export const getListContainerApi = () => {
	return apiInstance.get(GET_LIST_CONTAINER_PATH);
};

export const getContainerDetailApi = (containerId: string) => {
	return apiInstance.get(join(GET_CONTAINER_DETAIL_PATH, containerId));
};

export const killContainerApi = (containerId: string) => {
	return apiInstance.get(join(KILL_CONTAINER_PATH, containerId));
};

export const restartContainerApi = (containerId: string) => {
	return apiInstance.get(join(RESTART_CONTAINER_PATH, containerId));
};

export const removeContainerAPi = (containerId: string) => {
	return apiInstance.get(join(REMOVE_CONTAINER_PATH, containerId));
};
