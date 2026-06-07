import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { Users, Trash2, ArrowLeft, RefreshCw, AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const fetchUsers = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError('');
    try {
      const res = await API.get('/api/auth/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error('❌ Failed to fetch users log:', err.message);
      setError('Failed to load system user directories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, userEmail) => {
    if (userEmail === 'admin@crustiva.com') {
      alert('Forbidden: Cannot delete baseline system seed administrator.');
      return;
    }
    
    if (!window.confirm(`Are you absolutely sure you want to delete user account '${userEmail}'?`)) {
      return;
    }

    setDeletingId(userId);
    try {
      await API.delete(`/api/auth/users/${userId}`);
      fetchUsers(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div className="min-h-screen bg-pizza-dark text-white py-12 px-6 relative overflow-hidden">
      {/* Decorative Glow Blobs */}
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-pizza-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-pizza-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-8 z-10 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-pizza-gray hover:text-white transition-colors mb-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin Console</span>
            </Link>
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <Users className="w-8 h-8 text-pizza-primary" />
              <span>Customer Registry</span>
            </h2>
            <p className="text-xs text-white/50">Manage privilege roles and audit registered profiles</p>
          </div>

          <button 
            onClick={() => fetchUsers(true)}
            className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2 text-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Registry</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-pizza-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : users.length === 0 ? (
          <p className="text-center py-10 text-white/40 text-xs">No registered users in the database.</p>
        ) : (
          <div className="glass-dark rounded-[2rem] border border-white/5 overflow-hidden shadow-premium">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-[10px] uppercase font-bold tracking-wider text-white/50 border-b border-white/5">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Privilege Role</th>
                    <th className="py-4 px-6">Email Status</th>
                    <th className="py-4 px-6">Created On</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-white/80">
                  {users.map((client) => {
                    const isSelfAdmin = client.email === 'admin@crustiva.com';
                    return (
                      <tr key={client._id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-extrabold text-white flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-pizza-primary/10 border border-pizza-primary/20 flex items-center justify-center text-pizza-primary font-bold text-xs">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{client.name}</span>
                        </td>
                        <td className="py-4 px-6 font-mono font-bold text-white/75">{client.email}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 text-[9px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full ${
                            client.role === 'admin' 
                              ? 'bg-amber-500/10 text-pizza-gold border border-amber-500/20' 
                              : 'bg-white/5 text-white/60 border border-white/5'
                          }`}>
                            {client.role === 'admin' ? (
                              <>
                                <UserCheck className="w-3 h-3" />
                                <span>Admin Panel access</span>
                              </>
                            ) : (
                              <span>Customer</span>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {client.isVerified ? (
                            <span className="inline-flex items-center gap-1 text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified</span>
                            </span>
                          ) : (
                            <span className="text-[9px] uppercase font-bold text-white/40 bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-full">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 font-mono text-white/40">
                          {new Date(client.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleDeleteUser(client._id, client.email)}
                            disabled={deletingId === client._id || isSelfAdmin}
                            className={`p-1.5 bg-white/5 border border-white/10 rounded-lg hover:text-rose-500 transition-colors ${
                              isSelfAdmin ? 'opacity-20 cursor-not-allowed' : ''
                            }`}
                            title={isSelfAdmin ? 'Baseline system admin cannot be deleted' : 'Delete Account'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
