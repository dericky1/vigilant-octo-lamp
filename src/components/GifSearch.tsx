import React, { useEffect, useState } from "react";

interface Gif {
  id: string;
  url: string;
  title: string;
}

const MyComponent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=HlD75vhZn7G8rI78fRoRLQaettAcYjxu&q=${searchQuery}&limit=10&offset=${
          (currentPage - 1) * 10
        }`
      );
      const { data } = await response.json();

      const gifs = data.map((gif: any) => ({
        id: gif.id,
        url: gif.images.original.url,
        title: gif.title,
      }));

      setGifs(gifs);
      setIsLoading(false);

      if (gifs.length == 0) {
        setIsLoading(true);
      }
      console.log(gifs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-tealgreen">
      <div className="bg-darkblue w-10/12 h-5/6 flex flex-col items-center justify-center rounded-lg">
        <div className="flex mb-10 w-full">
          <input
            type="text"
            className="form-input border-2 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500 w-full ml-10"
            placeholder="Enter your text here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={fetchData}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-10"
          >
            Search
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5">
          {gifs.map((gif) => (
            <img key={gif.id} src={gif.url} alt={gif.title} className="w-52 h-52" />
          ))}
        </div>
        {isLoading == false ? (
          <div className=" w-full flex justify-between mt-10">
            <button
              onClick={handlePreviousPage}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-10"
            >
              Next
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default MyComponent;
