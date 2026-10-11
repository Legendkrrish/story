import React from "react";
import { Users, BookOpen, Clock, Shield } from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = db.getAllProfiles();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="pb-6 border-b border-[#C8A66A]/20">
        <h1 className="font-serif text-3xl font-bold text-[#F5EBD7]">
          Seekers & Registered Accounts ({users.length})
        </h1>
        <p className="text-xs text-[#F5EBD7]/70 font-sans mt-0.5">
          Review registered readers, assigned archivist roles, and account creation dates.
        </p>
      </div>

      <div className="bg-[#10271F] border border-[#C8A66A]/30 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#091812] text-[#DFCA9B] uppercase tracking-wider border-b border-[#C8A66A]/20">
              <tr>
                <th className="py-4 px-6">Seeker</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Favorite Genre</th>
                <th className="py-4 px-4">Member Since</th>
                <th className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C8A66A]/10 text-[#F5EBD7]/90">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#091812]/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-[#091812] border border-[#C8A66A]/40 flex items-center justify-center font-bold text-[#DFCA9B]">
                        {user.display_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#F5EBD7]">
                          {user.display_name}
                        </h3>
                        <p className="text-[11px] text-[#DFCA9B]/70">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === "admin"
                          ? "bg-[#C8A66A] text-[#091812]"
                          : "bg-[#091812] text-[#DFCA9B] border border-[#C8A66A]/30"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">{user.favorite_genre || "All Genres"}</td>
                  <td className="py-4 px-4 font-mono text-[#F5EBD7]/70">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="inline-flex items-center space-x-1.5 text-emerald-400 font-semibold text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Active</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
