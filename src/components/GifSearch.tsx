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
  const handleNextPage = () => {setCurrentPage(currentPage + 1);};

  return (
    <div>
      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <button onClick={fetchData}>Search</button>
      <div className="grid grid-cols-2 md:grid-cols-5">
        {gifs.map((gif) => (
          <img key={gif.id} src={gif.url} alt={gif.title} className="w-52 h-52" />
        ))}
      </div>
      <button onClick={handlePreviousPage}>Previous</button>
      <button onClick={handleNextPage}>Next</button>
    </div>
  );
};

export default MyComponent;
