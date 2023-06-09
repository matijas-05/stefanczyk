import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Carousel({ imageUrls }: { imageUrls: string[] }) {
	const [emblaRef, emblaApi] = useEmblaCarousel({ duration: 20 });

	const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
	const [nextBtnEnabled, setNextBtnEnabled] = useState(true);
	const [selected, setSelected] = useState(0);

	useEffect(() => {
		if (!emblaApi) {
			return;
		}

		const onSelect = () => {
			setTimeout(() => {
				setPrevBtnEnabled(emblaApi.canScrollPrev());
				setNextBtnEnabled(emblaApi.canScrollNext());
				setSelected(emblaApi.selectedScrollSnap());
			}, 100); // Delay to prevent unintended grabbing when the current slide is the first or last
		};
		emblaApi.on("select", onSelect);

		return () => {
			emblaApi.off("select", onSelect);
		};
	}, [emblaApi, prevBtnEnabled, nextBtnEnabled]);

	return (
		<div className="relative">
			<div ref={emblaRef} className="overflow-hidden">
				<div className="flex items-center">
					{imageUrls.map((url, i) => (
						<img
							key={i}
							className="relative min-w-0 flex-[0_0_100%] rounded-sm"
							src={url}
						/>
					))}
				</div>
			</div>

			{prevBtnEnabled && (
				<button
					className="absolute left-2 top-1/2 rounded-full p-1 backdrop-blur backdrop-invert-[30%]"
					onClick={() => emblaApi?.scrollPrev()}
				>
					<ChevronLeft className="text-white" />
				</button>
			)}
			{nextBtnEnabled && (
				<button
					className="absolute right-2 top-1/2 rounded-full p-1 backdrop-blur backdrop-invert-[30%]"
					onClick={() => emblaApi?.scrollNext()}
				>
					<ChevronRight className="text-white" />
				</button>
			)}
			<div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-1 text-white">
				{[...Array(imageUrls.length)].map((_, i) => (
					<button
						key={i}
						className={cn(
							"h-2 w-8 rounded-full backdrop-blur backdrop-invert-[30%]",
							selected === i && "backdrop-invert"
						)}
						onClick={() => emblaApi?.scrollTo(i)}
					/>
				))}
			</div>
		</div>
	);
}
