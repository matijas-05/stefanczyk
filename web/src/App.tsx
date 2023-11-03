import { useEffect, useMemo, useState } from "react";

const apiUrl = "http://localhost:3000";

export interface Image {
    name: string;
    data: Blob;
    selected: boolean;
}

function App() {
    const [images, setImages] = useState<Image[]>([]);
    const allSelected = useMemo(() => images.every((image) => image.selected), [images]);
    const someSelected = useMemo(() => images.some((image) => image.selected), [images]);

    useEffect(() => {
        setImages([]);
        fetchImages();
    }, []);

    async function fetchImages() {
        const res = await fetch(`${apiUrl}/image`);
        const names: string[] = await res.json();

        const newImages: Image[] = [];
        for (const name of names) {
            const res = await fetch(`${apiUrl}/image/${name}`);
            const data = await res.blob();
            newImages.push({ name, data, selected: false });
        }
        setImages(newImages);
    }
    async function removeImage(name: string) {
        await fetch(`${apiUrl}/image/${name}`, { method: "DELETE" });
        fetchImages();
    }
    async function renameImage(name: string) {
        const split = name.split(".");
        split.pop();
        const placeholder = split.join(".");

        const newName = prompt("New name:", placeholder);
        if (!newName) {
            return;
        }

        const res = await fetch(`${apiUrl}/image/${name}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newName: newName + ".jpg" }),
        });

        if (res.status === 409) {
            alert("Image with that name already exists!");
            return;
        }

        fetchImages();
    }

    return (
        <>
            <h1 className="font-bold text-2xl">Uploaded Images</h1>
            <div className="space-x-2">
                <button onClick={fetchImages}>reload</button>
                <button
                    onClick={() =>
                        setImages(images.map((image) => ({ ...image, selected: !allSelected })))
                    }
                >
                    {allSelected && "de"}select all
                </button>
                <button
                    onClick={() =>
                        images.forEach((image) => {
                            if (image.selected) {
                                removeImage(image.name);
                            }
                        })
                    }
                    disabled={!someSelected}
                >
                    remove selected
                </button>
            </div>
            <div className="flex gap-4 flex-wrap">
                {images.map((image, i) => (
                    <div
                        key={i}
                        className="bg-gray-700 rounded-md w-1/6 overflow-clip p-4 flex flex-col gap-4 justify-center items-center"
                    >
                        <h1>{image.name}</h1>
                        <img src={URL.createObjectURL(image.data)} alt={image.name} />

                        <button onClick={() => removeImage(image.name)}>delete</button>
                        <button onClick={() => renameImage(image.name)}>rename</button>
                        <input
                            className="w-8 h-8"
                            type="checkbox"
                            checked={image.selected}
                            onChange={() => {
                                const newImages = [...images];
                                newImages[i].selected = !newImages[i].selected;
                                setImages(newImages);
                            }}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}

export default App;
