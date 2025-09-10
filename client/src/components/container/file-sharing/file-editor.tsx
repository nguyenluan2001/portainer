import { PencilSimpleLineIcon } from "@phosphor-icons/react";
import { Button, Input, Modal } from "antd";
import React, {
	useEffect,
	useMemo,
	useState,
	type Dispatch,
	type FC,
	type ReactElement,
	type ReactNode,
} from "react";
import {
	type Monaco,
	default as MonacoEditor,
	useMonaco,
} from "@monaco-editor/react";
import type { IFilesystem } from "@/type/filesystem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createFileProxy,
	getFileContentProxy,
	updateFileProxy,
} from "@/services/proxy/container";
import { getFileLanguage } from "@/utils/editor";
import Paragraph from "antd/es/typography/Paragraph";
import { useQueryKeysFactory } from "@/hooks/react-query/useQueryKeysFactory";
import { toast } from "react-toastify";

interface Props {
	containerId: string;
	file?: IFilesystem;
	folder_path?: string;
	children?: ReactElement;
	open?: boolean;
	setOpen?: Dispatch<React.SetStateAction<boolean>>;
}
const FileEditor: FC<Props> = ({
	containerId,
	file,
	folder_path,
	children,
	open,
	setOpen,
}) => {
	const [internalOpen, setInternalOpen] = useState(false);
	const [code, setCode] = useState<string>("");
	const [language, setLanguage] = useState("plaintext");
	const [filename, setFilename] = useState("");

	const queryClient = useQueryClient();
	const {
		containerKeys: { getFilesystem, getFileContent },
	} = useQueryKeysFactory();
	const { data, isLoading, isFetching } = useQuery({
		queryKey: getFileContent(containerId, file?.path),
		queryFn: () => {
			if (!file) return "";
			return getFileContentProxy(containerId, file?.path);
		},
		enabled: !!containerId && !!file?.path && internalOpen,
	});

	const updateFileMutation = useMutation({
		mutationFn: (input: any) => updateFileProxy(input),
		onSuccess(data) {
			if (!data) return toast.error("Update file failed. Please try again");
			if (!file) return;
			const oldPath = file.path;
			const newPath = file.path.replace(file.name, filename);
			if (oldPath === newPath) {
				queryClient.invalidateQueries({
					queryKey: getFileContent(containerId),
				});
				return;
			}
			setFilename("");
			setCode("");
			onClose();
			queryClient.invalidateQueries({
				queryKey: getFilesystem(containerId),
			});
		},
	});

	const createFileMutation = useMutation({
		mutationFn: (input: any) => createFileProxy(input),
		onSuccess(data) {
			if (!data) return toast.error("Create file failed. Please try again");
			onClose();
			queryClient.invalidateQueries({
				queryKey: getFilesystem(containerId),
			});
		},
	});

	useEffect(() => {
		if (isLoading || isFetching || !file) return;
		setCode(data);
		setLanguage(getFileLanguage(file?.name));
	}, [data, isLoading, isFetching]);

	useEffect(() => {
		if (!file) return;
		setFilename(file.name);
	}, [file, file?.name]);

	const onClose = () => {
		if (children) {
			return setInternalOpen(false);
		}
		setOpen?.(false);
	};

	const onEditChange = (value: string | undefined) => {
		if (value === undefined) return;
		setCode(value);
	};

	const onSave = () => {
		if (!file) return onCreate();
		onUpdate();
	};

	const onUpdate = async () => {
		if (!file) return;
		await updateFileMutation.mutateAsync({
			containerId,
			oldPath: file?.path,
			newPath: file?.path.replace(file.name, filename),
			content: code,
		});
	};

	const onCreate = async () => {
		await createFileMutation.mutateAsync({
			containerId,
			dstPath: [folder_path, filename]?.join("/"),
			content: code,
		});
	};

	const isContentChanged = useMemo(() => {
		return code !== data;
	}, [code, data]);
	return (
		<>
			<Modal
				title={
					<div className="w-[calc(100%-30px)]">
						{file ? (
							<Paragraph editable={{ onChange: setFilename }}>
								{filename}
							</Paragraph>
						) : (
							<Input
								placeholder="Input filename"
								className="w-full"
								onChange={(e) => setFilename(e?.target?.value)}
							/>
						)}
					</div>
				}
				centered
				open={internalOpen || open}
				onOk={onSave}
				onCancel={onClose}
				okText="Save"
				okButtonProps={{
					loading: updateFileMutation.isPending,
					disabled: !isContentChanged,
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
			{children &&
				React.cloneElement(children, {
					onClick: () => setInternalOpen(true),
				})}
		</>
	);
};
export default FileEditor;
