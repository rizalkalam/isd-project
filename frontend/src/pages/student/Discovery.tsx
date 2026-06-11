import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { searchTitles } from "../../features/catalog/api/search";
import { BookCard } from "../../features/catalog/components/BookCard";
import { Badge } from "../../components/ui/badge";
import { Search } from "lucide-react";
import { requestLoan } from "../../features/loans/api/loans";

const Discovery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState<{ id: number; message: string; ok: boolean } | null>(null);
  const queryClient = useQueryClient();

  const { data: books, isLoading } = useQuery({
    queryKey: ["titles", "search", searchQuery],
    queryFn: () => searchTitles(searchQuery),
  });

  const borrowMutation = useMutation({
    mutationFn: (titleId: number) => requestLoan(titleId),
    onSuccess: (_, titleId) => {
      setFeedback({ id: titleId, message: "Request submitted!", ok: true });
      queryClient.invalidateQueries({ queryKey: ["titles", "search"] });
      setTimeout(() => setFeedback(null), 3000);
    },
    onError: (_, titleId) => {
      setFeedback({ id: titleId, message: "Could not request — no copies available.", ok: false });
      setTimeout(() => setFeedback(null), 3000);
    },
  });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Discover Books</h1>
          <p className="text-slate-500">Search the catalog and check real-time availability.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {feedback && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            feedback.ok ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-slate-100 rounded-xl" />
          ))}
        </div>
      ) : books && books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book: any) => (
            <div key={book.id} className="relative group">
              <BookCard
                title={book.title}
                author={book.author}
                isbn={book.isbn}
                coverUrl={book.cover_url}
                copyCount={book.available_copies}
                onBorrow={() => borrowMutation.mutate(book.id)}
                borrowing={borrowMutation.isPending && borrowMutation.variables === book.id}
              />
              <div className="absolute top-2 right-2">
                <Badge variant={book.available_copies > 0 ? "default" : "destructive"}>
                  {book.available_copies > 0 ? "Available" : "Out of Stock"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed">
          <p className="text-slate-500">No books found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Discovery;
