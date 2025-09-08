import { PencilSimpleLineIcon } from "@phosphor-icons/react";
import { Button, Modal } from "antd";
import { useEffect, useState, type FC } from "react";
import {
	type Monaco,
	default as MonacoEditor,
	useMonaco,
} from "@monaco-editor/react";
import type { IFilesystem } from "@/type/filesystem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getFileContentProxy,
	updateFileProxy,
} from "@/services/proxy/container";
import { getFileLanguage } from "@/utils/editor";
import Paragraph from "antd/es/typography/Paragraph";
import { useQueryKeysFactory } from "@/hooks/react-query/useQueryKeysFactory";
import { toast } from "react-toastify";

interface Props {
	title: string;
	containerId: string;
	file: IFilesystem;
}
const FileEditor: FC<Props> = ({ title, containerId, file }) => {
	const [open, setOpen] = useState(false);
	const [code, setCode] = useState<string>("Hello world");
	const [language, setLanguage] = useState("plaintext");
	const [filename, setFilename] = useState("");

	const queryClient = useQueryClient();
	const {
		containerKeys: { getFilesystem, getFileContent },
	} = useQueryKeysFactory();
	const { data, isLoading, isFetching } = useQuery({
		queryKey: getFileContent(containerId, file.path),
		queryFn: () => getFileContentProxy(containerId, file.path),
		enabled: !!containerId && !!file.path && open,
	});

	const updateFileMutation = useMutation({
		mutationFn: (input: any) => updateFileProxy(input),
		onSuccess(data, variables, context) {
			if (!data) return toast.error("Update file failed. Please try again");
			const oldPath = file.path;
			const newPath = file.path.replace(file.name, filename);
			if (oldPath === newPath) {
				queryClient.invalidateQueries({
					queryKey: getFileContent(containerId),
				});
				return;
			}

			setOpen(false);
			queryClient.invalidateQueries({
				queryKey: getFilesystem(containerId),
			});
		},
	});

	useEffect(() => {
		if (isLoading || isFetching) return;
		setCode(data);
		setLanguage(getFileLanguage(file.name));
	}, [data, isLoading, isFetching]);

	useEffect(() => {
		setFilename(file.name);
	}, [file.name]);

	const onEditChange = (value: string | undefined) => {
		if (value === undefined) return;
		setCode(value);
	};

	const onSave = async () => {
		await updateFileMutation.mutateAsync({
			containerId,
			oldPath: file.path,
			newPath: file.path.replace(file.name, filename),
			content: code,
		});
	};
	return (
		<>
			<Modal
				title={
					<Paragraph editable={{ onChange: setFilename }}>{filename}</Paragraph>
				}
				centered
				open={open}
				onOk={onSave}
				onCancel={() => setOpen(false)}
				okText="Save"
				okButtonProps={{
					loading: updateFileMutation.isPending,
				}}
				width="60vw"
				classNames={{
					content: "h-full",
				}}
			>
				<div className="h-[70vh]">
					<MonacoEditor
						theme={"vs-dark"}
						height="100%"
						defaultLanguage="plaintext"
						defaultValue={"// your code goes here"}
						value={code}
						// onMount={handleEditorDidMount}
						language={language}
						onChange={onEditChange}
						options={{
							fontSize: 14,
							folding: true,
						}}
					/>
				</div>
			</Modal>
			<Button
				size="small"
				icon={<PencilSimpleLineIcon />}
				onClick={() => setOpen(true)}
			>
				Edit
			</Button>
		</>
	);
};
export default FileEditor;
