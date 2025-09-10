import { useQueryKeysFactory } from "@/hooks/react-query/useQueryKeysFactory";
import {
	createFileProxy,
	getFileContentProxy,
	updateFileProxy,
} from "@/services/proxy/container";
import type { IFilesystem } from "@/type/filesystem";
import { getFileLanguage } from "@/utils/editor";
import { default as MonacoEditor, type Monaco } from "@monaco-editor/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Modal, Tooltip } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import type { editor } from "monaco-editor";
import React, {
	useEffect,
	useMemo,
	useRef,
	useState,
	type Dispatch,
	type FC,
	type ReactElement,
} from "react";
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
	const [openWarning, setOpenWarning] = useState(false);
	const [code, setCode] = useState<string>("");
	const [language, setLanguage] = useState("plaintext");
	const [filename, setFilename] = useState("");
	const codeRef = useRef("");

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
		if (code !== data) {
			setOpenWarning(true);
			return;
		}
		if (children) {
			return setInternalOpen(false);
		}
		setOpen?.(false);
	};

	const onEditChange = (value: string | undefined) => {
		if (value === undefined) return;
		setCode(value);
		codeRef.current = value;
	};

	const onSave = () => {
		if (!file) return onCreate();
		onUpdate();
	};

	const onUpdate = async () => {
		console.log("onUpdate===");
		if (!file) return;
		await updateFileMutation.mutateAsync({
			containerId,
			oldPath: file?.path,
			newPath: file?.path.replace(file.name, filename),
			content: codeRef.current,
		});
	};

	const onCreate = async () => {
		await createFileMutation.mutateAsync({
			containerId,
			dstPath: [folder_path, filename]?.join("/"),
			content: code,
		});
	};
	function handleEditorDidMount(
		editor: editor.IStandaloneCodeEditor,
		monaco: Monaco,
	) {
		editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
			onSave();
		});
	}

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
				footer={
					<div className="w-full flex items-center justify-end gap-[8px]">
						<Button onClick={onClose}>Cancel</Button>
						<Tooltip title="Ctrl+S">
							<Button
								loading={updateFileMutation.isPending}
								disabled={!isContentChanged}
								onClick={onSave}
								type="primary"
							>
								Save
							</Button>
						</Tooltip>
					</div>
				}
			>
				<div className="h-[70vh]">
					<MonacoEditor
						theme={"vs-dark"}
						height="100%"
						defaultLanguage="plaintext"
						defaultValue={"// your code goes here"}
						value={code}
						onMount={handleEditorDidMount}
						language={language}
						onChange={onEditChange}
						options={{
							fontSize: 14,
							folding: true,
						}}
					/>
				</div>
			</Modal>
			<Modal
				title={`Do you want to save the changes you made to file ${file?.name}`}
				centered
				open={openWarning}
				onCancel={() => setOpenWarning(false)}
				width="500px"
				footer={
					<div className="w-full flex items-center justify-end gap-[8px]">
						<Button
							onClick={() => {
								setOpenWarning(false);
								setInternalOpen(false);
							}}
						>
							Don't save
						</Button>
						<Button onClick={() => setOpenWarning(false)}>Cancel</Button>
						<Tooltip title="Ctrl+S">
							<Button
								loading={updateFileMutation.isPending}
								disabled={!isContentChanged}
								onClick={() => {
									onSave();
									setOpenWarning(false);
								}}
								type="primary"
							>
								Save
							</Button>
						</Tooltip>
					</div>
				}
			>
				<div>You changes will be lost if you don't save theme.</div>
			</Modal>
			{children &&
				React.cloneElement(children as any, {
					onClick: () => setInternalOpen(true),
				})}
		</>
	);
};
export default FileEditor;
