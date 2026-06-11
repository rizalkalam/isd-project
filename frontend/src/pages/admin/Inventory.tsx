import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";
import { BookCard } from "../../features/catalog/components/BookCard";

interface Title {
  id: number;
  title: string;
  author: string;
  isbn: string;
  cover_url?: string;
  copies?: any[];
}

export default function Inventory() {
  const { data: titles, isLoading, error } = useQuery<Title[]>({
    queryKey: ["titles"],
    queryFn: async () => {
      const response = await api.get("/titles");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error loading inventory: {(error as any).message}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Library Inventory</h1>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors">
          Add New Book
        </button>
      </div>

      {!titles || titles.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
          <p className="text-slate-500">No books in the catalog yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {titles.map((title) => (
            <BookCard
              key={title.id}
              title={title.title}
              author={title.author}
              isbn={title.isbn}
              coverUrl={title.cover_url}
              copyCount={title.copies?.length || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
