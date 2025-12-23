import { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, Shield } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading)
    return <div className="p-4 text-slate-500">Loading profile...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">User Profile</h1>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              {profile?.name}
            </h2>
            <p className="text-slate-500">Member since 2023</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
            <Mail className="text-slate-400" size={20} />
            <div>
              <p className="text-sm text-slate-500">Email Address</p>
              <p className="font-medium text-slate-700">{profile?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
            <Shield className="text-slate-400" size={20} />
            <div>
              <p className="text-sm text-slate-500">User ID</p>
              <p className="font-mono text-sm text-slate-600">{profile?.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
