import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";

interface BookCardProps {
  title: string;
  author: string;
  coverUrl?: string;
  isbn: string;
  copyCount: number;
  onBorrow?: () => void;
  borrowing?: boolean;
}

export const BookCard = ({ title, author, coverUrl, isbn, copyCount, onBorrow, borrowing }: BookCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="aspect-[2/3] relative bg-slate-100">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            No Cover
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
        <CardDescription className="line-clamp-1">{author}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex flex-col gap-2 text-sm text-slate-600 mt-auto">
        <div className="flex justify-between items-center">
          <span className="truncate mr-2">ISBN: {isbn}</span>
          <span className="font-medium whitespace-nowrap">{copyCount} copies</span>
        </div>
        {onBorrow !== undefined && (
          <button
            onClick={onBorrow}
            disabled={copyCount === 0 || borrowing}
            className="w-full py-1.5 rounded-md text-sm font-medium transition-colors
              bg-slate-900 text-white hover:bg-slate-700
              disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            {borrowing ? "Requesting…" : copyCount === 0 ? "Unavailable" : "Borrow"}
          </button>
        )}
      </CardContent>
    </Card>
  );
};
