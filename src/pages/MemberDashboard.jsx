import { useNavigate, Link } from 'react-router-dom';
import { UserCircle, ShieldCheck, LogOut, Lock, Star, ArrowRight, ShoppingBag, Utensils, Trophy, Zap, Gift } from 'lucide-react';
import { useAuth } from '../context/Authcontext';
import { SOCIALS } from '../data';

const getLoyaltyTier = (visits = 0) => {
    if (visits >= 20) return { name: 'Attending Physician', color: 'text-yellow-500', bg: 'bg-yellow-50 border-yellow-300', points: visits * 10 };
    if (visits >= 10) return { name: 'Senior Resident', color: 'text-[#c05621]', bg: 'bg-orange-50 border-orange-200', points: visits * 10 };
    if (visits >= 5)  return { name: 'Junior Resident', color: 'text-[#152238]', bg: 'bg-blue-50 border-blue-200', points: visits * 10 };
    return { name: 'Intern', color: 'text-[#1a110d]/60', bg: 'bg-[#f4ebd0] border-[#1a110d]/20', points: visits * 10 };
};

const LOYALTY_REWARDS = [
    { points: 50,  label: 'Free Side',          icon: Utensils },
    { points: 100, label: 'Free Sandwich',       icon: ShoppingBag },
    { points: 200, label: "Chef's Tasting Box",  icon: Gift },
    { points: 500, label: 'VIP Catering Credit', icon: Trophy },
];

const MemberDashboard = () => {
    const { user, userProfile, logOut } = useAuth();
    const navigate = useNavigate();

    const handleLogOut = async () => {
        await logOut();
        navigate('/portal');
    };

    const isMember = userProfile?.isMember;
    const visits = userProfile?.visits ?? 0;
    const tier = getLoyaltyTier(visits);
    const points = tier.points;
    const nextReward = LOYALTY_REWARDS.find(r => r.points > points);
    const progressPct = nextReward ? Math.min(100, (points / nextReward.points) * 100) : 100;

    return (
        <div className="min-h-screen texture-burlap py-20 px-4 animate-in">
            <div className="max-w-xl mx-auto space-y-6">

                {/* Patient file card */}
                <div className="bg-white border-4 border-[#1a110d] rounded-3xl overflow-hidden shadow-xl lantern-container">
                    <div className="bg-[#152238] bg-denim-patch px-8 py-5 border-b-4 border-[#c05621] flex items-center justify-between">
                        <h1 className="text-[#f4ebd0] font-bold uppercase tracking-widest text-sm">Patient File</h1>
                        {isMember && (
                            <div className="flex items-center gap-1 bg-[#c05621] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flame-1">
                                <Star size={10} /> Member
                            </div>
                        )}
                    </div>
                    <div className="p-8 flex items-start gap-6">
                        <div className="bg-[#f4ebd0] p-4 rounded-full border-2 border-dashed border-[#1a110d]/30 shrink-0">
                            <UserCircle size={40} className="text-[#1a110d]/60" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-[#1a110d] font-serif">{userProfile?.displayName || 'Patient'}</h2>
                            <p className="text-sm text-[#1a110d]/60">{user?.email}</p>
                            {isMember && (
                                <p className="text-xs text-[#c05621] font-bold uppercase tracking-widest flame-2">Active Member</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Loyalty Points Card */}
                <div className="bg-white border-4 border-[#1a110d] rounded-3xl overflow-hidden shadow-xl">
                    <div className="bg-[#152238] bg-denim-patch px-8 py-5 border-b-4 border-[#c05621] flex items-center justify-between">
                        <h3 className="font-bold text-[#f4ebd0] uppercase tracking-widest text-sm flex items-center gap-2">
                            <Trophy size={14} className="text-[#c05621] flame-1" /> Loyalty Rx
                        </h3>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${tier.bg} ${tier.color} uppercase tracking-widest`}>
                            {tier.name}
                        </span>
                    </div>
                    <div className="p-8 space-y-5">
                        <div className="flex items-end justify-between">
                            <div>
                                <span className="text-4xl font-bold text-[#1a110d]">{points}</span>
                                <span className="text-sm text-[#1a110d]/50 ml-2">Rx Points</span>
                            </div>
                            {nextReward && (
                                <p className="text-xs text-[#1a110d]/50">
                                    <span className="font-bold text-[#c05621]">{nextReward.points - points}</span> pts to {nextReward.label}
                                </p>
                            )}
                        </div>
                        <div className="h-3 bg-[#f4ebd0] rounded-full overflow-hidden border-2 border-[#1a110d]/10">
                            <div
                                className="h-full bg-[#c05621] rounded-full transition-all duration-700 flame-2"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2">
                            {LOYALTY_REWARDS.map(r => {
                                const Icon = r.icon;
                                const unlocked = points >= r.points;
                                return (
                                    <div
                                        key={r.label}
                                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-xs ${unlocked ? 'border-[#c05621] bg-[#c05621]/5 text-[#1a110d] font-bold' : 'border-[#1a110d]/10 text-[#1a110d]/40'}`}
                                    >
                                        <Icon size={14} className={unlocked ? 'text-[#c05621]' : 'text-[#1a110d]/30'} />
                                        <span>{r.label}</span>
                                        {unlocked && <Zap size={10} className="text-[#c05621] ml-auto flame-1" />}
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-[10px] text-[#1a110d]/40 leading-relaxed">
                            Earn 10 Rx Points per visit. Points are tracked on your orders and added to your profile by our team.
                        </p>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Order', icon: ShoppingBag, to: '/order' },
                        { label: 'Shop', icon: Star, to: '/shop' },
                        { label: 'Catering', icon: Utensils, to: '/catering' },
                    ].map(({ label, icon: Icon, to }) => (
                        <Link
                            key={label}
                            to={to}
                            className="flex flex-col items-center gap-2 p-4 bg-[#f4ebd0] border-4 border-[#1a110d] rounded-2xl hover:border-[#c05621] hover:bg-white transition-all text-center"
                        >
                            <Icon size={20} className="text-[#c05621] flame-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a110d]">{label}</span>
                        </Link>
                    ))}
                </div>

                {/* Member perks or upgrade prompt */}
                {isMember ? (
                    <div className="bg-[#f4ebd0] border-4 border-[#1a110d] rounded-3xl overflow-hidden shadow-xl">
                        <div className="px-8 py-5 border-b-2 border-[#1a110d]/20">
                            <h3 className="font-bold text-[#1a110d] uppercase tracking-widest text-sm flex items-center gap-2">
                                <ShieldCheck size={14} className="text-[#c05621] flame-2" /> Member Privileges
                            </h3>
                        </div>
                        <ul className="p-8 space-y-3">
                            <li className="flex items-start gap-3 text-sm text-[#1a110d]">
                                <span className="text-[#c05621] flame-1 mt-0.5">✦</span>
                                <Link to="/recipes" className="font-bold text-[#c05621] hover:underline flex items-center gap-1 flame-2">
                                    The Rx Vault — exclusive recipes <ArrowRight size={12} />
                                </Link>
                            </li>
                            {[
                                'Early access to new menu items',
                                'Priority order pickup slots',
                                'Member-only Lab Journal entries',
                                'Double Rx Points on all purchases',
                            ].map(perk => (
                                <li key={perk} className="flex items-start gap-3 text-sm text-[#1a110d]">
                                    <span className="text-[#c05621] flame-1 mt-0.5">✦</span>
                                    <span>{perk}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="bg-[#f4ebd0] border-4 border-[#1a110d] rounded-3xl overflow-hidden shadow-xl">
                        <div className="px-8 py-5 border-b-2 border-[#1a110d]/20">
                            <h3 className="font-bold text-[#1a110d] uppercase tracking-widest text-sm flex items-center gap-2">
                                <Lock size={14} className="text-[#1a110d]/50" /> Upgrade to Member
                            </h3>
                        </div>
                        <div className="p-8 space-y-4">
                            <p className="text-sm text-[#1a110d]/70 leading-relaxed">
                                Become a member to unlock exclusive recipes, early menu access, priority ordering, double Rx Points, and member-only Lab Journal entries.
                            </p>
                            <a
                                href={SOCIALS.membership}
                                target="_blank"
                                rel="noreferrer"
                                className="block w-full py-4 bg-[#c05621] text-white rounded font-bold text-sm uppercase tracking-widest text-center hover:bg-[#a84615] transition-colors flame-2"
                            >
                                Purchase Membership
                            </a>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleLogOut}
                    className="w-full py-3 flex items-center justify-center gap-2 text-[#1a110d]/40 hover:text-[#1a110d] text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                    <LogOut size={14} /> Sign Out
                </button>
            </div>
        </div>
    );
};

export default MemberDashboard;
