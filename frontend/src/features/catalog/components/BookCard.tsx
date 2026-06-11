import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";

interface BookCardProps {
  title: string;
  author: string;
  coverUrl?: string;
  isbn: string;
  copyCount: number;
}

export const BookCard = ({ title, author, coverUrl, isbn, copyCount }: BookCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
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
      <CardContent className="p-4 pt-0 flex justify-between items-center text-sm text-slate-600">
        <span className="truncate mr-2">ISBN: {isbn}</span>
        <span className="font-medium whitespace-nowrap">{copyCount} copies</span>
      </CardContent>
    </Card>
  );
};
