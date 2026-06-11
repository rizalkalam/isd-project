import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { BookCard } from '../../features/catalog/components/BookCard';
import { useState } from 'react';
import { BookForm } from '../../components/modals/BookForm';

interface Title {
  id: number;
  title: string;
  author: string;
  isbn: string;
  cover_url?: string;
  copies?: any[];
}

export default function Inventory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<Title | undefined>(undefined);

  const { data: titles, isLoading, error } = useQuery<Title[]>({
    queryKey: ['titles'],
    queryFn: async () => {
      const response = await api.get('/titles');
      return response.data;
    },
  });

  const totalBooks = titles?.length ?? 0;
  const totalCopies = titles?.reduce((sum, title) => sum + (title.copies?.length || 0), 0) ?? 0;
  const uniqueAuthors = titles
    ? new Set(titles.map((title) => title.author)).size
    : 0;

  const handleOpenAddModal = () => {
    setSelectedTitle(undefined);
    setIsModalOpen(true);
  };

  const handleSelectTitle = (title: Title) => {
    setSelectedTitle(title);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="page page-dashboard">
        <div className="loader" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page page-dashboard">
        <div className="section-card section-card--error">
          Error loading inventory: {(error as any).message}
        </div>
      </div>
    );
  }

  return (
    <div className="page page-dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1>Perpustakaan Universitas</h1>
          <p className="dashboard-description">
            Kelola koleksi, perbarui judul buku, dan pantau persediaan dengan cepat.
          </p>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary btn-large">
          Tambah Buku Baru
        </button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-value">{totalBooks}</p>
          <p className="stat-label">Judul Buku</p>
        </div>
        <div className="stat-card">
          <p className="stat-value">{uniqueAuthors}</p>
          <p className="stat-label">Penulis Unik</p>
        </div>
        <div className="stat-card">
          <p className="stat-value">{totalCopies}</p>
          <p className="stat-label">Jumlah Salinan</p>
        </div>
      </div>

      {!titles || titles.length === 0 ? (
        <div className="inventory-empty">
          <h2>Belum ada buku di katalog</h2>
          <p>Tambahkan buku baru untuk mulai mengisi inventaris perpustakaan.</p>
        </div>
      ) : (
        <div className="inventory-grid">
          {titles.map((title) => (
            <button
              key={title.id}
              type="button"
              onClick={() => handleSelectTitle(title)}
              className="inventory-card"
            >
              <BookCard
                title={title.title}
                author={title.author}
                isbn={title.isbn}
                coverUrl={title.cover_url}
                copyCount={title.copies?.length || 0}
              />
            </button>
          ))}
        </div>
      )}

      {isModalOpen && (
        <BookForm onClose={() => setIsModalOpen(false)} selectedTitle={selectedTitle} />
      )}
    </div>
  );
}
