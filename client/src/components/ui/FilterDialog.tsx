import { Combobox, type ComboboxData } from "./Combobox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./Dialog";
import { FormItem, FormLabel } from "./Form";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	file?: File;
	filter: string;
	setFilter: (value: string) => void;
}

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
						className="aspect-square h-fit overflow-auto object-contain"
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
