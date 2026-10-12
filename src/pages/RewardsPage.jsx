import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../utils/api';
import confetti from 'canvas-confetti';

import {
  Trophy, Award, Sparkles, CheckCircle2, Ticket, Bus, BookOpen,
  Gift, ShieldCheck, Star, ArrowRight, Loader2
} from 'lucide-react';

export const RewardsPage = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [catalog, setCatalog] = useState([]);
  const [userPoints, setUserPoints] = useState(user?.points || 0);
  const [userBadges, setUserBadges] = useState(user?.badges || []);
  const [redeemed, setRedeemed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState(null);

  const fetchRewardsData = async () => {
    setLoading(true);
    try {
      const data = await api.getRewardsCatalog(user?.id);
      setCatalog(data.catalog || []);
      setUserPoints(data.userPoints || 0);
      setUserBadges(data.userBadges || []);
      setRedeemed(data.rewardsRedeemed || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardsData();
  }, [user]);

  const handleRedeem = async (rewardId) => {
    if (!user) {
      addToast('Please sign in to redeem rewards!', 'error');
      return;
    }
    setRedeemingId(rewardId);
    try {
      const res = await api.redeemReward(user.id, rewardId);
      setUserPoints(res.userPoints);
      setRedeemed(prev => [res.redemption, ...prev]);

      // Fire celebratory confetti animation!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      addToast(`Redeemed ${res.redemption.title}! Code: ${res.redemption.code}`, 'success', '🎉 Reward Claimed!');
      fetchRewardsData();
    } catch (err) {
      addToast(err.message || 'Failed redeeming reward.', 'error');
    } finally {
      setRedeemingId(null);
    }
  };

  const getRankName = (pts) => {
    if (pts >= 500) return { rank: "Master Civic Inspector", color: "from-amber-400 to-yellow-600", nextPts: 1000 };
    if (pts >= 300) return { rank: "Clean City Hero", color: "from-sky-400 to-indigo-600", nextPts: 500 };
    if (pts >= 150) return { rank: "Street Guardian", color: "from-emerald-400 to-teal-600", nextPts: 300 };
    return { rank: "Civic Pioneer", color: "from-slate-400 to-slate-600", nextPts: 150 };
  };

  const rankInfo = getRankName(userPoints);
  const progressPercent = Math.min(100, Math.round((userPoints / rankInfo.nextPts) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-purple-950 to-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Report Grievances & Earn Civic Perks</span>
            </span>
            <h1 className="text-3xl font-black">Civic Rewards & Hero Badges</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Citizens who snap photos and report municipal issues earn points when their reports are verified and resolved!
            </p>
          </div>

          {/* User Points Counter Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-center min-w-[220px] shadow-xl">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300">Your Civic Balance</div>
            <div className="text-4xl font-black text-amber-400 mt-1 flex items-center justify-center space-x-1">
              <Sparkles className="w-7 h-7 text-amber-300 animate-pulse" />
              <span>{userPoints}</span>
              <span className="text-sm text-slate-300 font-bold ml-1">PTS</span>
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-200">
              Rank: <span className="font-bold text-white">{rankInfo.rank}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Badges Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-lg flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Hero Level Progress</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {userPoints} / {rankInfo.nextPts} PTS to Next Rank
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${rankInfo.color} transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-slate-400 font-medium">Submit Report</div>
              <div className="font-bold text-emerald-600 mt-0.5">+50 PTS</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-slate-400 font-medium">Verified Resolution</div>
              <div className="font-bold text-sky-600 mt-0.5">+100 PTS</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-slate-400 font-medium">Rate Service</div>
              <div className="font-bold text-purple-600 mt-0.5">+25 PTS</div>
            </div>
          </div>
        </div>

        {/* User Badges */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-4">
          <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Earned Badges ({userBadges.length})</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {userBadges.length > 0 ? (
              userBadges.map((badge, idx) => (
                <span key={idx} className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-sm">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>{badge}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">Submit your first complaint to unlock badges!</span>
            )}
          </div>
        </div>

      </div>

      {/* Rewards Catalog Marketplace */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Civic Rewards Marketplace</h2>
          <p className="text-sm text-slate-500">Redeem your hard-earned points for municipal vouchers and perks.</p>
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading catalog...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {catalog.map((item) => {
              const canAfford = userPoints >= item.costPoints;
              return (
                <div key={item.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <Gift className="w-5 h-5" />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.category}</span>
                      <h3 className="font-bold text-base text-slate-900 leading-snug">{item.title}</h3>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <div className="font-black text-amber-600 text-base">
                      {item.costPoints} <span className="text-xs text-slate-400 font-bold">PTS</span>
                    </div>

                    <button
                      onClick={() => handleRedeem(item.id)}
                      disabled={!canAfford || redeemingId === item.id}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {redeemingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : canAfford ? (
                        'Redeem Now'
                      ) : (
                        'Need More PTS'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Redeemed Rewards History */}
      {redeemed.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
            <Ticket className="w-5 h-5 text-sky-600" />
            <span>My Claimed Voucher Codes ({redeemed.length})</span>
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            {redeemed.map((r, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{r.title}</div>
                  <div className="text-slate-400">Claimed: {new Date(r.redeemedAt).toLocaleDateString()}</div>
                </div>
                <div className="font-mono font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">
                  {r.code}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
