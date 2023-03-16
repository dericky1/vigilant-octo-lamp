import React, { useEffect, useRef, useState } from "react";

//structure of each gif
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
  const isSearchQuery = searchQuery.trim() !== ""; // a check to see if the search query is empty
  const apiKey = import.meta.env.VITE_GIPHY_API_KEY;

  // Function call giphy api to get gifs based on searchQuery, limit of 10, and the current page
  // Sets our state variable gifs to contain all the data
  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchQuery}&limit=10&offset=${
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
    setGifs([]); // This clears the old search info so that we only display gifs that we searched for
    setCurrentPage(0) // Set page back to page 0 so we don't miss the first page of data
    await fetchData();
  };

  const handleScroll = async (event: Event) => {
    const container = event.target as HTMLDivElement;
    // Check if the user has scrolled to the bottom of the div
    // scrollHeight the height of the entire content of the div
    // scrollTop distance between top of the div and the visible content (gets larger as user scrolls down)
    // clientHeight is the height of the visible portion of the div
    if (container.scrollHeight - container.scrollTop === container.clientHeight) {
      // If so, load the next page of data
      await fetchData();
    }
  };

  useEffect(() => {
    // Add event listener to detect when the user has scrolled to the bottom of the div
    // When the user scrolls to the bottom of the div handleScroll is called
    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      // Remove event listener when the component unmounts
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [currentPage]);

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
        {/* If the gifs array == [] i.e. nothing had been search, dont display anything*/}
        {gifs.length !== 0 ? (
          <div className="rounded bg-lightorange">
            <div
              ref={containerRef}
              className="grid grid-cols-2 md:grid-cols-5 gap-4 h-96 overflow-y-scroll scrollbar-none m-6"
            >
              {" "}
              {/* Mapping through gifs and displaying each gif in a grid*/}
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
