import { useEffect, useState } from "react";

const apiUrl = "http://localhost:3000";

export interface Image {
    name: string;
    data: Blob;
}

function App() {
    const [images, setImages] = useState<Image[]>([]);

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
            newImages.push({ name, data });
        }
        setImages(newImages);
    }
    async function deleteImage(name: string) {
        await fetch(`${apiUrl}/image/${name}`, { method: "DELETE" });
        fetchImages();
    }
    async function renameImage(name: string) {
        const newName = prompt("New name:");
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
            <div>
                <button onClick={fetchImages}>reload</button>
            </div>
            <div className="flex gap-4 flex-wrap">
                {images.map((image, i) => (
                    <div
                        key={i}
                        className="bg-gray-700 rounded-md w-80 p-4 flex flex-col gap-4 justify-center items-center"
                    >
                        <h1>{image.name}</h1>
                        <img
                            className="object-cover"
                            src={URL.createObjectURL(image.data)}
                            alt={image.name}
                        />

                        <button onClick={() => deleteImage(image.name)}>delete</button>
                        <button onClick={() => renameImage(image.name)}>rename</button>
                    </div>
                ))}
            </div>
        </>
    );
}

export default App;
