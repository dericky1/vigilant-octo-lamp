import React, { useEffect, useRef, useState } from "react";

interface Gif {
  id: string;
  url: string;
  title: string;
}

const MyComponent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const isSearchQuery = searchQuery.trim() !== "";

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=HlD75vhZn7G8rI78fRoRLQaettAcYjxu&q=${searchQuery}&limit=10&offset=${
          (currentPage - 1) * 10
        }`
      );
      const data = await response.json();
      const newGifs = data.data.map((gif: any) => ({ id: gif.id, url: gif.images.original.url }));
      setGifs((gifs) => [...gifs, ...newGifs]);
      setCurrentPage((page) => page + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async () => {
    setGifs([]);
    await fetchData();
  };

  useEffect(() => {
    // Add event listener to detect when the user has scrolled to the bottom of the div
    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      // Remove event listener when the component unmounts
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [currentPage]);

  async function handleScroll(event: Event) {
    const container = event.target as HTMLDivElement;
    // Check if the user has scrolled to the bottom of the div
    if (container.scrollHeight - container.scrollTop === container.clientHeight) {
      // If so, load the next page of data
      await fetchData();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-tealgreen">
      <div className="bg-darkblue w-9/12 h-5/6 flex flex-col items-center justify-center rounded-md">
        <div className="flex w-full mb-10">
          <input
            type="text"
            className="form-input border-2 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500 w-full ml-10"
            placeholder="Search for a GIF"
            value={searchQuery}
            onChange={handleInputChange}
          />
          <button
            onClick={handleSearch}
            disabled={!isSearchQuery}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-10"
          >
            Search
          </button>
        </div>
        {gifs.length !== 0 ? (
          <div className="rounded bg-lightorange">
            <div
              ref={containerRef}
              className="grid grid-cols-2 md:grid-cols-5 gap-4 h-96 overflow-y-scroll scrollbar-none m-6"
            >
              {gifs.map((gif) => (
                <a key={gif.id} href={gif.url}>
                  <img key={gif.id} src={gif.url} alt={gif.title} className="w-48 h-48 rounded" />
                </a>
              ))}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default MyComponent;
