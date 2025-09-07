export type IFileType = "directory" | "file" | "link" | "char";
export interface IFilesystem {
	type: IFileType;
	name: string;
	path: string;
	mode: string;
	prot: string;
	size: number;
	time: number;
	contents: IFilesystem[] | null;
}
