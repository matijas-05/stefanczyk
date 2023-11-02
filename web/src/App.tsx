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
        (async () => {
            const res1 = await fetch(`${apiUrl}/image`);
            const names: Array<{ name: string }> = await res1.json();

            const newImages: Image[] = [];
            for (const { name } of names) {
                const res2 = await fetch(`${apiUrl}/image/${name}`);
                const data = await res2.blob();
                newImages.push({ name, data });
            }
            setImages(newImages);
        })();
    }, []);

    return (
        <>
            <h1 className="font-bold text-2xl">Uploaded Images:</h1>
            <div className="flex gap-4 flex-wrap">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="bg-gray-700 rounded-md w-80 p-4 flex flex-col gap-4 justify-center items-center"
                    >
                        <h1>{image.name}</h1>
                        <img
                            className="object-cover"
                            src={URL.createObjectURL(image.data)}
                            alt={image.name}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}

export default App;
