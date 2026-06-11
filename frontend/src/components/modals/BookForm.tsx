import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/client";
import { Badge } from "../ui/badge";

interface Title {
  id: number;
  title: string;
  author: string;
  isbn: string;
  copies?: any[];
}

interface BookFormProps {
  onClose: () => void;
  selectedTitle?: Title;
}

export const BookForm = ({ onClose, selectedTitle }: BookFormProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: selectedTitle?.title || "",
    author: selectedTitle?.author || "",
    isbn: selectedTitle?.isbn || "",
    cover_url: "",
  });
  const [barcode, setBarcode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createTitleMutation = useMutation({
    mutationFn: async (newData: typeof formData) => {
      const response = await api.post("/titles", newData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["titles"] });
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || "Failed to create book");
    },
  });

  const updateTitleMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.put(`/titles/${selectedTitle?.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["titles"] });
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || "Failed to update book");
    },
  });

  const deleteTitleMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/titles/${selectedTitle?.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["titles"] });
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || "Failed to delete book");
    },
  });

  const addCopyMutation = useMutation({
    mutationFn: async (barcode: string) => {
      const response = await api.post(`/titles/${selectedTitle?.id}/copies`, { barcode });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["titles"] });
      setBarcode("");
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || "Failed to add copy");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTitle) {
      updateTitleMutation.mutate(formData);
    } else {
      createTitleMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this title and all its copies? This action cannot be undone.")) {
      deleteTitleMutation.mutate();
    }
  };

  const handleAddCopy = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode) {
      addCopyMutation.mutate(barcode);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {selectedTitle ? `Edit: ${selectedTitle.title}` : "Add New Book Title"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
              {error}
            </div>
          )}

          <section>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Book Metadata
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ISBN</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cover URL</label>
                <input
                  type="url"
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.cover_url}
                  onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                />
              </div>
              <div className="flex justify-between items-center pt-2">
                {selectedTitle ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteTitleMutation.isPending}
                    className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                  >
                    {deleteTitleMutation.isPending ? "Deleting..." : "Delete Title"}
                  </button>
                ) : <div />}
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border rounded-md hover:bg-slate-50 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createTitleMutation.isPending || updateTitleMutation.isPending}
                    className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-50 text-sm font-medium"
                  >
                    {selectedTitle 
                      ? (updateTitleMutation.isPending ? "Saving..." : "Save Changes")
                      : (createTitleMutation.isPending ? "Creating..." : "Create Title")
                    }
                  </button>
                </div>
              </div>
            </form>
          </section>

          {selectedTitle && (
            <>
              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Add Physical Copy</h3>
                <form onSubmit={handleAddCopy} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Barcode (e.g. LIB-12345)"
                    className="flex-1 border rounded-md px-3 py-2 text-sm"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={addCopyMutation.isPending}
                    className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 disabled:opacity-50 text-sm font-medium"
                  >
                    {addCopyMutation.isPending ? "Add" : "Add Copy"}
                  </button>
                </form>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Physical Copies ({selectedTitle.copies?.length || 0})
                </h3>
                <div className="border rounded-md divide-y max-h-48 overflow-y-auto bg-slate-50">
                  {!selectedTitle.copies || selectedTitle.copies.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-sm italic">
                      No copies added yet.
                    </div>
                  ) : (
                    selectedTitle.copies.map((copy: any) => (
                      <div key={copy.id} className="p-3 flex justify-between items-center bg-white">
                        <span className="font-mono text-sm">{copy.barcode}</span>
                        <Badge variant={copy.status === 'AVAILABLE' ? 'success' : 'secondary'}>
                          {copy.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
