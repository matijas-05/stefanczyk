import { cn } from "@/lib/utils";
import { Combobox, type ComboboxData } from "./Combobox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./Dialog";
import { FormItem, FormLabel } from "./Form";
import type { FilterName } from "@server/types";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	file?: File;
	filter: string;
	setFilter: (value: string) => void;
}

export const filterClasses: Record<FilterName, string> = {
	flip: "scale-y-[-1]",
	flop: "scale-x-[-1]",
	grayscale: "grayscale",
	negate: "invert",
};
const filterNames = ["crop", "rotate", "grayscale", "flip", "flop", "negate"];
const data: ComboboxData[] = filterNames.sort().map((name) => ({
	value: name,
	label: name.charAt(0).toUpperCase() + name.slice(1),
	filterValue: name,
}));

export default function FilterDialog(props: Props) {
	return (
		<Dialog open={props.open} onOpenChange={props.onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Filters</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-4">
					<img
						className={cn(
							"aspect-square h-fit overflow-auto object-contain",
							filterClasses[props.filter as FilterName]
						)}
						src={props.file ? URL.createObjectURL(props.file) : ""}
						alt={props.file?.name}
					/>

					<FormItem className="mx-auto space-x-2">
						<FormLabel>Filter</FormLabel>
						<Combobox
							data={data}
							value={props.filter}
							onChange={props.setFilter}
							placeholder="Select a filter"
							contentProps={{
								placeholder: "Select a filter",
							}}
						/>
					</FormItem>
				</div>
			</DialogContent>
		</Dialog>
	);
}
