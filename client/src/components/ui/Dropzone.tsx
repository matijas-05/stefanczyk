import React from "react";
import type { DropzoneState } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { cn } from "@/lib/utils";
import { TypographyMuted } from "./Typography";
import { Button } from "./Button";

interface Props extends React.ComponentPropsWithoutRef<"div"> {
	className?: string;
	dropzone: DropzoneState;
	files: File[];
	setFiles: (files: File[]) => void;
	error?: boolean;
}

export default function Dropzone({ className, dropzone, files, setFiles, error }: Props) {
	const [parent] = useAutoAnimate({ duration: 200 });

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
					<div key={i} className="relative">
						<img
							src={URL.createObjectURL(file)}
							className="h-32 w-32 rounded-md object-cover"
							title={file.name}
						/>
						<Button
							className="absolute right-1 top-1 h-fit p-0.5"
							variant={"secondary"}
							onClick={() => {
								const newFiles = [...files];
								newFiles.splice(i, 1);
								setFiles(newFiles);
							}}
							icon={<X className="h-5 w-5" />}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
