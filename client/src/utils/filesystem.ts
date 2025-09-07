import {
	DOWNLOAD_FROM_CONTAINER_PATH,
	UPLOAD_TO_CONTAINER_PATH,
} from "@/constant/router";

export function formatFileSize(bytes: number, decimalPoint = 2) {
	if (bytes === 0) return "0 Bytes";

	const k = 1024; // Use 1000 for SI units (KB, MB, etc.)
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return (
		parseFloat((bytes / Math.pow(k, i)).toFixed(decimalPoint)) + " " + sizes[i]
	);
}

export const buildUploadUrl = (containerId: string, dstPath: string) => {
	return (
		window.API_URL +
		[UPLOAD_TO_CONTAINER_PATH, containerId].join("/") +
		`?dstPath=${dstPath}`
	);
};

export const buildDownloadUrl = (containerId: string, srcPath: string) => {
	return encodeURI(
		window.API_URL +
			[DOWNLOAD_FROM_CONTAINER_PATH, containerId].join("/") +
			`?srcPath=${srcPath}`,
	);
};

export const onDownload = (url: string, filename: string) => {
	console.log("url", url);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
};
