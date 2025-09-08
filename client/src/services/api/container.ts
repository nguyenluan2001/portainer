import type { RcFile } from "antd/es/upload";
import { apiInstance } from ".";
import {
	ADD_FOLER_PATH,
	GET_CONTAINER_DETAIL_PATH,
	GET_CONTAINER_FS_PATH,
	GET_FILE_CONTENT_PATH,
	GET_LIST_CONTAINER_PATH,
	KILL_CONTAINER_PATH,
	REMOVE_CONTAINER_PATH,
	REMOVE_ENDPOINTS_PATH,
	RESTART_CONTAINER_PATH,
	UPDATE_FILE_PATH,
	UPLOAD_TO_CONTAINER_PATH,
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

export const getContainerFsApi = (containerId: string, path: string) => {
	return apiInstance.get(join(GET_CONTAINER_FS_PATH, containerId), {
		params: {
			path,
		},
	});
};

export const uploadToContainerApi = (
	containerId: string,
	file: RcFile,
	dstPath: string,
) => {
	const form = new FormData();
	form.append("file", file);
	form.append("dstPath", dstPath);
	return apiInstance.post(join(UPLOAD_TO_CONTAINER_PATH, containerId), {
		form,
	});
};

export const removeEndpoinsApi = (containerId: string, endpoints: string[]) => {
	return apiInstance.post(join(REMOVE_ENDPOINTS_PATH, containerId), {
		endpoints,
	});
};

export const addFolderApi = (
	containerId: string,
	dstPath: string,
	name: string,
) => {
	return apiInstance.post(join(ADD_FOLER_PATH, containerId), {
		dstPath,
		name,
	});
};

export const getFileContentApi = (containerId: string, path: string) => {
	return apiInstance.get(join(GET_FILE_CONTENT_PATH, containerId), {
		params: { path },
	});
};

export const updateFileApi = ({
	containerId,
	oldPath,
	newPath,
	content,
}: {
	containerId: string;
	oldPath: string;
	newPath: string;
	content: string;
}) => {
	return apiInstance.post(join(UPDATE_FILE_PATH, containerId), {
		oldPath,
		newPath,
		content,
	});
};
