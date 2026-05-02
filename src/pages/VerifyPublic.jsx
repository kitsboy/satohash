import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Hash, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function VerifyPublic() {
  const { id } = useParams();
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProof(id);
    }
  }, [id]);

  const fetchProof = async (proofId) => {
    try {
      const response = await fetch(`${API_URL}/api/verify/${proofId}`);
      if (!response.ok) throw new Error('Proof not found');
      const data = await response.json();
      setProof(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading proof...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!proof) return <div>No proof available.</div>;

  return (
    <div>
      <h1>Public Verification: {proof.filename}</h1>
      <p>Hash: {proof.hash}</p>
      <p>Status: {proof.status}</p>
      {proof.status === 'confirmed' && (
        <a href={`https://mempool.space/block/${proof.blockHeight}`} target="_blank">
          <ExternalLink /> View on Explorer
        </a>
      )}
      <CheckCircle />
    </div>
  );
}
