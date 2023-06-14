import React, { useState } from "react";
import type { DropzoneState } from "react-dropzone";
import { Sparkles, UploadCloud, X } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { cn } from "@/lib/utils";
import { TypographyMuted } from "./Typography";
import { Button } from "./Button";
import FilterDialog from "./FilterDialog";

interface Props extends React.ComponentPropsWithoutRef<"div"> {
	className?: string;
	dropzone: DropzoneState;
	files: File[];
	setFiles: (value: File[]) => void;
	filters: string[];
	setFilters: (value: string[]) => void;
	error?: boolean;
}

export default function Dropzone({
	className,
	dropzone,
	files,
	setFiles,
	filters,
	setFilters,
	error,
}: Props) {
	const [parent] = useAutoAnimate({ duration: 200 });

	const [filtersOpen, setFiltersOpen] = useState(false);
	const [filteredFile, setFilteredFile] = useState<File | undefined>();
	const [filteredFileIndex, setFilteredFileIndex] = useState<number | undefined>();

	return (
		<div className={cn("flex w-[25rem] flex-col gap-2", className)}>
			<div
				className={cn(
					"grid h-32 place-content-center gap-2 rounded-md border-2 border-dashed border-border transition-colors hover:cursor-pointer hover:border-ring",
					dropzone.isDragActive && "border-ring",
					error && "border-destructive"
				)}
				{...dropzone.getRootProps()}
			>
				<input {...dropzone.getInputProps()} />
				<UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
				<TypographyMuted>Drop photos here...</TypographyMuted>
			</div>

			<div ref={parent} className="flex flex-wrap gap-2">
				{files.map((file, i) => (
					<div key={i} className="relative cursor-pointer">
						<img
							src={URL.createObjectURL(file)}
							className="h-32 w-32 rounded-md object-cover"
							title={file.name}
							onClick={() => {
								setFilteredFile(file);
								setFilteredFileIndex(i);
								setFiltersOpen(true);
							}}
						/>

						<Button
							className="absolute right-1 top-1 h-fit p-0.5"
							variant={"secondary"}
							onClick={() => {
								const newFiles = [...files];
								newFiles.splice(i, 1);
								setFiles(newFiles);

								const newFilters = [...filters];
								newFilters.splice(i, 1);
								setFilters(newFilters);
							}}
							icon={<X className="h-5 w-5" />}
						/>
						{filters[i] !== "" && (
							<Sparkles className="pointer-events-none absolute left-1 top-1" />
						)}

						<FilterDialog
							open={filtersOpen}
							onOpenChange={setFiltersOpen}
							file={filteredFile}
							filter={filters[filteredFileIndex ?? -1]}
							setFilter={(filter) => {
								const newFilters = [...filters];
								newFilters[filteredFileIndex ?? -1] = filter;
								setFilters(newFilters);
							}}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
