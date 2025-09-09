import { UPLOAD_TO_CONTAINER_PATH } from "@/constant/router";
import {
	addFolderProxy,
	getContainerFsProxy,
	removeEndpoinsProxy,
} from "@/services/proxy/container";
import type { IFilesystem } from "@/type/filesystem";
import {
	buildDownloadUrl,
	buildUploadUrl,
	formatFileSize,
	onDownload,
} from "@/utils/filesystem";
import {
	ArrowClockwiseIcon,
	CaretDownIcon,
	ClockClockwiseIcon,
	DownloadSimpleIcon,
	FileIcon,
	FilePlusIcon,
	FolderIcon,
	FolderSimplePlusIcon,
	HouseIcon,
	HouseSimpleIcon,
	PencilSimpleLineIcon,
	TrashIcon,
	UploadSimpleIcon,
} from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Breadcrumb,
	Button,
	Divider,
	Dropdown,
	Popconfirm,
	Table,
	Upload,
	type MenuProps,
	type UploadProps,
} from "antd";
import type { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import type { ColumnsType } from "antd/es/table";
import classNames from "classnames";
import { useMemo, useState, type FC, type Key } from "react";
import { toast } from "react-toastify";
import ModalAddFolder from "./add-folder";
import dayjs from "dayjs";
import FileEditor from "./file-editor";
import { useQueryKeysFactory } from "@/hooks/react-query/useQueryKeysFactory";

interface Props {
	containerId: string;
}
interface IBreadcumb extends BreadcrumbItemType {
	path: string;
}

const ROOT_BREADCRUMD = {
	title: <HouseIcon className="!size-[20px]" />,
	path: "/",
};
const FileManager: FC<Props> = ({ containerId }) => {
	const [path, setPath] = useState("/");
	const [breadcrumb, setBreadcrumb] = useState<IBreadcumb[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
	const [openModalAddFolder, setOpenModalAddFolder] = useState(false);
	const [openModalAddFile, setOpenModalAddFile] = useState(false);

	const queryClient = useQueryClient();
	const {
		containerKeys: { getFilesystem },
	} = useQueryKeysFactory();
	const { data, isLoading, isFetching } = useQuery<
		unknown,
		unknown,
		IFilesystem
	>({
		queryKey: getFilesystem(containerId, path),
		queryFn: () => getContainerFsProxy(containerId, path),
		enabled: !!containerId,
		staleTime: Infinity,
	});

	const addFolderMutation = useMutation({
		mutationKey: ["add-folder", containerId, path],
		mutationFn: ({ containerId, dstPath, name }: Record<string, string>) =>
			addFolderProxy(containerId, dstPath, name),
		onSuccess(data, variables, context) {
			if (!data) {
				return toast.error("Add folder failed. Please try again.");
			}
			onRefresh();
			setOpenModalAddFolder(false);
		},
	});

	const onRefresh = () => {
		queryClient.invalidateQueries({
			queryKey: getFilesystem(containerId, path),
		});
	};

	const onSelectFolder = (folder: IFilesystem) => {
		if (folder.type !== "directory") return;
		setPath(folder.path);
		setBreadcrumb((pre) => {
			const [_, ...rest] = pre;
			return [
				ROOT_BREADCRUMD,
				...rest,
				{
					title: folder.name,
					path: folder.path,
				},
			];
		});
	};
	const onSelectRoute = (route: BreadcrumbItemType) => {
		let newBreadcrumb = [];
		for (const item of breadcrumb) {
			newBreadcrumb.push(item);
			if (item.path === route.path) {
				break;
			}
		}
		if (newBreadcrumb?.length < 2) {
			newBreadcrumb = [];
		}
		setBreadcrumb(newBreadcrumb);
		setPath(route?.path || "/");
	};

	const onRemoveEndpoints = async (endpoints: string[]) => {
		try {
			const resp = await removeEndpoinsProxy(containerId, endpoints);
			if (!resp) {
				return toast.error("Remove endpoints failed. Please try again.");
			}
			onRefresh();
			setSelectedRowKeys([]);
		} catch (error) {
			toast.error("Remove endpoints failed. Please try again.");
		}
	};

	const onAddFolder = async (name: string) => {
		await addFolderMutation.mutateAsync({
			containerId,
			dstPath: path,
			name,
		});
	};

	const props: UploadProps = {
		name: "file",
		onChange(info) {
			if (info.file.status === "uploading") {
				return setIsUploading(true);
			}
			if (info.file.status === "done") {
				setIsUploading(false);
				onRefresh();
				return;
			}
			if (info.file.status === "error") {
				setIsUploading(false);
				toast.error("Upload failed. Please try again.");
				return;
			}
		},
	};
	const dropdownItems: MenuProps["items"] = [
		{
			key: "3",
			label: "Add folder",
			icon: <FolderSimplePlusIcon />,
			onClick: () => setOpenModalAddFolder(true),
		},
		{
			key: "2",
			label: "Add file",
			icon: <FilePlusIcon />,
			onClick: () => setOpenModalAddFile(true),
		},
		{
			type: "divider",
		},
		{
			key: "1",
			label: (
				<Upload
					{...props}
					showUploadList={false}
					action={() => {
						return buildUploadUrl(containerId, path);
					}}
				>
					Upload file
				</Upload>
			),
			icon: <UploadSimpleIcon />,
		},
		{
			key: "2",
			label: (
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="https://www.aliyun.com"
				>
					Upload folder
				</a>
			),
			icon: <UploadSimpleIcon />,
		},
	];
	const columns: ColumnsType<IFilesystem> = [
		{
			title: "Name",
			dataIndex: "name",
			render(value, record) {
				const isDirectory = record?.type === "directory";
				return (
					<div className="flex items-center gap-[4px]">
						{isDirectory ? <FolderIcon /> : <FileIcon />}
						<p
							className={classNames({
								"text-chart-1 underline font-bold": isDirectory,
							})}
						>
							{value}
						</p>
					</div>
				);
			},
		},
		{
			title: "Permission",
			dataIndex: "prot",
		},
		{
			title: "Owner",
			dataIndex: "user",
		},
		{
			title: "Size",
			dataIndex: "size",
			render(value) {
				return formatFileSize(value);
			},
			sorter: (a, b) => a.size - b.size,
		},
		{
			title: "Last modified",
			dataIndex: "time",
			render(value, record, index) {
				return dayjs(value * 1000).format("HH:mm:ss DD/MM/YYYY");
			},
			sorter: (a, b) => a.time - b.time,
		},
		{
			title: "Actions",
			dataIndex: "type",
			render(_, record) {
				const isDirectory = record.type === "directory";
				return (
					<div className="flex items-center gap-[8px]">
						{!isDirectory && (
							<FileEditor containerId={containerId} file={record}>
								<Button size="small" icon={<PencilSimpleLineIcon />}>
									Edit
								</Button>
							</FileEditor>
						)}
						{!isDirectory && (
							<Button
								size="small"
								icon={<DownloadSimpleIcon />}
								onClick={() =>
									onDownload(
										buildDownloadUrl(containerId, record.path),
										record.name,
									)
								}
							>
								Download
							</Button>
						)}
						<Popconfirm
							title={`Remove ${isDirectory ? "folder" : "file"}`}
							description={`Are you sure to remove this ${isDirectory ? "folder" : "file"} ?`}
							onConfirm={(e) => {
								e?.stopPropagation();
								onRemoveEndpoints([record.path]);
							}}
							okText="Remove"
							cancelText="Cancel"
						>
							<Button
								icon={<TrashIcon />}
								size="small"
								onClick={(e) => e.stopPropagation()}
							>
								Remove
							</Button>
						</Popconfirm>
					</div>
				);
			},
		},
	];
	const dataSource = useMemo(() => {
		return data?.contents?.map((item) => ({
			...item,
			path:
				data?.name === "/" ? `/${item.name}` : `${data?.name}/${item?.name}`,
		}));
	}, [data]);

	return (
		<>
			<div className="w-full flex justify-between items-center mb-4">
				<ModalAddFolder
					open={openModalAddFolder}
					onClose={() => setOpenModalAddFolder(false)}
					onAdd={onAddFolder}
					isLoading={addFolderMutation.isPending}
				/>
				<Breadcrumb
					items={breadcrumb}
					itemRender={(currentRoute, _, items) => {
						const isLast = currentRoute?.path === items[items.length - 1]?.path;

						if (isLast) return <span>{currentRoute?.title}</span>;

						return (
							<a onClick={() => onSelectRoute(currentRoute as IBreadcumb)}>
								{currentRoute?.title}
							</a>
						);
					}}
				/>
				<FileEditor
					containerId={containerId}
					folder_path={path}
					open={openModalAddFile}
					setOpen={setOpenModalAddFile}
				/>
				<div className="flex items-center gap-[8px]">
					{selectedRowKeys?.length > 0 && (
						<Popconfirm
							title="Remove files/folders"
							description="Are you sure to remove selected files/folders?"
							onConfirm={() => onRemoveEndpoints(selectedRowKeys as string[])}
							okText="Remove"
							cancelText="Cancel"
						>
							<Button color="danger" variant="solid" icon={<TrashIcon />}>
								Remove{" "}
								{selectedRowKeys?.length > 0
									? `(${selectedRowKeys?.length})`
									: ""}
							</Button>
						</Popconfirm>
					)}
					<Button icon={<ArrowClockwiseIcon />} onClick={onRefresh}>
						Refresh
					</Button>
					{/* <Upload
						{...props}
						showUploadList={false}
						action={() => {
							return buildUploadUrl(containerId, path);
						}}
					>
						<Button
							size="small"
							loading={isUploading}
							icon={<UploadSimpleIcon />}
						>
							Upload
						</Button>
					</Upload> */}
					<Dropdown
						menu={{ items: dropdownItems }}
						trigger={["click"]}
						placement="bottomRight"
					>
						<Button icon={<CaretDownIcon />}>Action</Button>
					</Dropdown>
				</div>
			</div>
			<Table
				bordered
				columns={columns}
				dataSource={dataSource}
				rowKey="path"
				loading={isLoading || isFetching}
				onRow={(record) => {
					return {
						className: classNames("[&_.ant-table-row-selected]:!bg-muted", {
							"cursor-pointer": record?.type === "directory",
						}),
						onClick: () => onSelectFolder(record),
					};
				}}
				rowSelection={{
					selectedRowKeys,
					onChange(selectedRowKeys, selectedRows, info) {
						setSelectedRowKeys(selectedRowKeys);
					},
				}}
			/>
		</>
	);
};

export default FileManager;
