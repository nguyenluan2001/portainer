const languageMap = {
	// Web and Frontend
	js: "javascript",
	jsx: "javascript",
	ts: "typescript",
	tsx: "typescript",
	html: "html",
	htm: "html",
	css: "css",
	scss: "scss",
	less: "less",
	json: "json",
	md: "markdown",
	xml: "xml",

	// Backend and General Purpose
	py: "python",
	java: "java",
	cpp: "cpp",
	c: "c",
	cs: "csharp",
	go: "go",
	rs: "rust",
	php: "php",
	rb: "ruby",
	swift: "swift",
	kt: "kotlin",
	sql: "sql",
	sh: "shell",
	bash: "shell",
	yaml: "yaml",
	yml: "yaml",
	dockerfile: "dockerfile",

	// Other
	txt: "plaintext",
};

type IExtension = keyof typeof languageMap;

export const getFileLanguage = (filename: string): string => {
	const arr = filename.split(".");
	if (arr.length <= 1) return languageMap.txt;
	const extension: IExtension = arr[arr.length - 1] as IExtension;
	if (typeof languageMap[extension] === "undefined") return languageMap.txt;
	return languageMap[extension];
};
