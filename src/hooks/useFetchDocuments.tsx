

import api from '@/lib/httpClient';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const useFetchDocuments = () => {
  const { id } = useParams<{ id: string }>();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!id) return; // Prevent unnecessary calls

    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get(`/v2/admin/order/submissions/${id}`);
      // Ensure response structure is valid
      if (!data?.data?.data || !Array.isArray(data.data.data)) {
        setDocuments([]); // Return empty array instead of throwing an error
        return;
      }

      const filteredData = data.data.data.filter(
        (document: any) => document.role === 'Investor'
      );

      setDocuments(filteredData);
    } catch (err: any) {
      console.log(err);
      const errorMessage =
        err?.response?.data?.message || 'Failed to fetch documents';
      setError(errorMessage);
      toast.error(errorMessage);
      setDocuments([]); // Ensure state is cleared on error
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return { documents, loading, error, refetch: fetchDocuments };
};

export default useFetchDocuments;
