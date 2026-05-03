import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

// ─── ТИПЫ ────────────────────────────────────────────────────
type Role = "owner" | "senior_admin" | "admin" | "player";

interface User {
  vk_id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  role: Role;
  is_banned: boolean;
  ban_reason?: string;
  created_at: string;
  last_login: string;
}

interface Donation {
  id: number;
  vk_id: string;
  username: string;
  plan_name: string;
  amount: number;
  status: "completed" | "pending" | "cancelled" | "refunded";
  payment_method: string;
  created_at: string;
}

interface LogEntry {
  id: number;
  vk_id: string;
  username: string;
  action: string;
  details: Record<string, unknown>;
  ip: string;
  created_at: string;
}

// ─── MOCK DATA ────────────────────────────────────────────────
const MOCK_PLAYERS: User[] = [
  { vk_id: "111", first_name: "Иван", last_name: "Петров", avatar: "", role: "player", is_banned: false, created_at: "2024-04-01T00:00:00", last_login: "2024-05-03T08:00:00" },
  { vk_id: "222", first_name: "Алексей", last_name: "Сидоров", avatar: "", role: "player", is_banned: false, created_at: "2024-04-05T00:00:00", last_login: "2024-05-03T07:00:00" },
  { vk_id: "333", first_name: "Дмитрий", last_name: "Козлов", avatar: "", role: "player", is_banned: true, ban_reason: "Читы", created_at: "2024-04-10T00:00:00", last_login: "2024-05-01T05:00:00" },
  { vk_id: "444", first_name: "Максим", last_name: "Новиков", avatar: "", role: "player", is_banned: false, created_at: "2024-04-15T00:00:00", last_login: "2024-05-02T20:00:00" },
  { vk_id: "555", first_name: "Сергей", last_name: "Волков", avatar: "", role: "player", is_banned: false, created_at: "2024-04-20T00:00:00", last_login: "2024-05-03T06:00:00" },
];

const MOCK_ADMINS: User[] = [
  { vk_id: "demo_owner", first_name: "Владелец", last_name: "Сервера", avatar: "", role: "owner", is_banned: false, created_at: "2024-01-01T00:00:00", last_login: "2024-05-03T12:00:00" },
  { vk_id: "demo_sr", first_name: "Старший", last_name: "Администратор", avatar: "", role: "senior_admin", is_banned: false, created_at: "2024-02-01T00:00:00", last_login: "2024-05-02T18:00:00" },
  { vk_id: "demo_admin", first_name: "Администратор", last_name: "Один", avatar: "", role: "admin", is_banned: false, created_at: "2024-03-01T00:00:00", last_login: "2024-05-01T10:00:00" },
  { vk_id: "demo_admin2", first_name: "Администратор", last_name: "Два", avatar: "", role: "admin", is_banned: false, created_at: "2024-03-15T00:00:00", last_login: "2024-04-30T14:00:00" },
];

const MOCK_DONATIONS: Donation[] = [
  { id: 1, vk_id: "111", username: "Иван Петров", plan_name: "АВТОРИТЕТ", amount: 499, status: "completed", payment_method: "Карта", created_at: "2024-05-01T12:00:00" },
  { id: 2, vk_id: "222", username: "Алексей Сидоров", plan_name: "БОСС", amount: 1999, status: "completed", payment_method: "СБП", created_at: "2024-05-02T15:30:00" },
  { id: 3, vk_id: "333", username: "Дмитрий Козлов", plan_name: "ГРАЖДАНИН", amount: 199, status: "pending", payment_method: "ЮMoney", created_at: "2024-05-03T09:00:00" },
  { id: 4, vk_id: "444", username: "Максим Новиков", plan_name: "КРИМИНАЛ", amount: 999, status: "completed", payment_method: "Карта", created_at: "2024-05-03T11:00:00" },
  { id: 5, vk_id: "555", username: "Сергей Волков", plan_name: "АВТОРИТЕТ", amount: 499, status: "refunded", payment_method: "СБП", created_at: "2024-04-28T10:00:00" },
];

const MOCK_LOGS: LogEntry[] = [
  { id: 1, vk_id: "demo_owner", username: "Владелец Сервера", action: "login", details: { method: "vk_oauth" }, ip: "127.0.0.1", created_at: "2024-05-03T12:00:00" },
  { id: 2, vk_id: "demo_sr", username: "Старший Администратор", action: "ban_player", details: { target: "333", reason: "Читы" }, ip: "192.168.1.1", created_at: "2024-05-03T11:30:00" },
  { id: 3, vk_id: "demo_admin", username: "Администратор Один", action: "login", details: { method: "vk_oauth" }, ip: "10.0.0.1", created_at: "2024-05-03T10:00:00" },
  { id: 4, vk_id: "111", username: "Иван Петров", action: "donate", details: { plan: "АВТОРИТЕТ", amount: 499 }, ip: "5.5.5.5", created_at: "2024-05-01T12:00:00" },
  { id: 5, vk_id: "demo_sr", username: "Старший Администратор", action: "set_role", details: { target: "demo_admin2", role: "admin" }, ip: "192.168.1.1", created_at: "2024-04-30T16:00:00" },
  { id: 6, vk_id: "222", username: "Алексей Сидоров", action: "donate", details: { plan: "БОСС", amount: 1999 }, ip: "8.8.8.8", created_at: "2024-05-02T15:30:00" },
];

// ─── КОНСТАНТЫ ────────────────────────────────────────────────
const ROLE_LEVEL: Record<Role, number> = { owner: 100, senior_admin: 50, admin: 20, player: 0 };

const ROLE_LABELS: Record<Role, string> = {
  owner: "Владелец",
  senior_admin: "Ст. Администратор",
  admin: "Администратор",
  player: "Игрок",
};

const ROLE_COLORS: Record<Role, string> = {
  owner: "#F59E0B",
  senior_admin: "#A855F7",
  admin: "#3B82F6",
  player: "#6B7280",
};

const STATUS_COLORS: Record<string, string> = {
  completed: "#10B981",
  pending: "#F59E0B",
  cancelled: "#EF4444",
  refunded: "#6B7280",
};

const STATUS_LABELS: Record<string, string> = {
  completed: "Выполнен",
  pending: "Ожидает",
  cancelled: "Отменён",
  refunded: "Возврат",
};

const ACTION_LABELS: Record<string, string> = {
  login: "Вход в систему",
  logout: "Выход",
  ban_player: "Бан игрока",
  unban_player: "Разбан игрока",
  donate: "Пополнение",
  set_role: "Смена роли",
  delete_admin: "Удаление администратора",
};

// ─── ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ───────────────────────────────
function Avatar({ user, size = 36 }: { user: User; size?: number }) {
  const initials = `${user.first_name[0]}${user.last_name[0]}`;
  const color = ROLE_COLORS[user.role];
  return (
    <div
      className="rounded-xl flex items-center justify-center font-oswald font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: color + "30", border: `1.5px solid ${color}50`, fontSize: size * 0.35 }}
    >
      {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-xl object-cover" /> : initials}
    </div>
  );
}

function RoleBadge({ role }: { role: Role }) {
  return (
    <span className="px-2 py-0.5 rounded-md text-xs font-oswald font-bold"
      style={{ backgroundColor: ROLE_COLORS[role] + "20", color: ROLE_COLORS[role], border: `1px solid ${ROLE_COLORS[role]}40` }}>
      {ROLE_LABELS[role]}
    </span>
  );
}

function StatCard({ icon, label, value, color, sub }: { icon: string; label: string; value: string | number; color: string; sub?: string }) {
  return (
    <div className="bg-[#110D1E] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + "20" }}>
        <Icon name={icon} size={22} style={{ color }} />
      </div>
      <div>
        <div className="text-gray-400 text-xs mb-1">{label}</div>
        <div className="font-oswald font-bold text-2xl text-white">{value}</div>
        {sub && <div className="text-xs mt-0.5" style={{ color }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── ОСНОВНОЙ КОМПОНЕНТ ───────────────────────────────────────
export default function Cabinet() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [players, setPlayers] = useState<User[]>(MOCK_PLAYERS);
  const [admins, setAdmins] = useState<User[]>(MOCK_ADMINS);
  const [donations] = useState<Donation[]>(MOCK_DONATIONS);
  const [logs] = useState<LogEntry[]>(MOCK_LOGS);
  const [banModal, setBanModal] = useState<User | null>(null);
  const [banReason, setBanReason] = useState("");
  const [roleModal, setRoleModal] = useState<User | null>(null);
  const [searchPlayers, setSearchPlayers] = useState("");
  const [searchAdmins, setSearchAdmins] = useState("");

  const canDo = (minRole: Role) =>
    currentUser ? ROLE_LEVEL[currentUser.role] >= ROLE_LEVEL[minRole] : false;

  const isOwner = currentUser?.role === "owner";

  // Табы видимые для роли
  const getTabs = () => {
    if (!currentUser) return [];
    const tabs = [
      { id: "dashboard", label: "Главная", icon: "LayoutDashboard" },
      { id: "players", label: "Игроки", icon: "Users" },
      { id: "donations", label: "Донаты", icon: "CreditCard" },
    ];
    if (canDo("senior_admin")) tabs.push({ id: "admins", label: "Администраторы", icon: "Shield" });
    if (isOwner) tabs.push({ id: "logs", label: "Логи", icon: "FileText" });
    return tabs;
  };

  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />;
  }

  const filteredPlayers = players.filter(p =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchPlayers.toLowerCase()) ||
    p.vk_id.includes(searchPlayers)
  );

  const filteredAdmins = admins.filter(a =>
    a.role !== "owner" || isOwner
  ).filter(a =>
    `${a.first_name} ${a.last_name}`.toLowerCase().includes(searchAdmins.toLowerCase())
  );

  const totalDonated = donations.filter(d => d.status === "completed").reduce((s, d) => s + d.amount, 0);

  return (
    <div className="min-h-screen bg-[#0A0612] flex font-golos">

      {/* SIDEBAR */}
      <aside className="w-64 flex-shrink-0 border-r border-white/5 bg-[#0D0A1A] flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <a href="/" className="flex items-center gap-2.5 mb-4 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] flex items-center justify-center">
              <span className="font-oswald font-bold text-white text-xs">ВЛ</span>
            </div>
            <span className="font-oswald font-bold text-white text-sm tracking-wider">ВЛАДИВОСТОК <span className="text-[#A855F7]">RP</span></span>
          </a>
          {/* User card */}
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
            <Avatar user={currentUser} size={38} />
            <div className="min-w-0">
              <div className="text-white text-sm font-semibold truncate">{currentUser.first_name} {currentUser.last_name}</div>
              <RoleBadge role={currentUser.role} />
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {getTabs().map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                activeTab === tab.id
                  ? "bg-[#7C3AED]/20 text-[#A855F7] border border-[#7C3AED]/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon name={tab.icon} size={18} />
              {tab.label}
              {tab.id === "logs" && (
                <span className="ml-auto px-1.5 py-0.5 bg-[#7C3AED]/30 text-[#A855F7] text-xs rounded font-oswald">
                  {isOwner ? "ТОП" : ""}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={() => setCurrentUser(null)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Icon name="LogOut" size={18} />
            Выйти
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl">

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div>
              <h1 className="font-oswald font-bold text-3xl text-white mb-1">Добро пожаловать, {currentUser.first_name}!</h1>
              <p className="text-gray-500 mb-8 text-sm">Панель управления сервером Владивосток RP</p>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <StatCard icon="Users" label="Всего игроков" value={players.length} color="#3B82F6" sub={`${players.filter(p => p.is_banned).length} заблокировано`} />
                <StatCard icon="CreditCard" label="Сумма донатов" value={`${totalDonated.toLocaleString("ru-RU")} ₽`} color="#10B981" sub={`${donations.filter(d => d.status === "completed").length} транзакций`} />
                <StatCard icon="Wifi" label="Онлайн сейчас" value="3 847" color="#A855F7" sub="Активных игроков" />
                {canDo("senior_admin") && (
                  <StatCard icon="Shield" label="Администраторы" value={admins.filter(a => !isOwner ? a.role !== "owner" : true).length} color="#F59E0B" />
                )}
                <StatCard icon="AlertTriangle" label="Банов" value={players.filter(p => p.is_banned).length} color="#EF4444" />
                <StatCard icon="Clock" label="Платежей ожидает" value={donations.filter(d => d.status === "pending").length} color="#6B7280" />
              </div>

              {/* Последние донаты */}
              <div className="bg-[#110D1E] border border-white/5 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-oswald font-bold text-white text-lg">Последние донаты</h2>
                  <button onClick={() => setActiveTab("donations")} className="text-[#A855F7] text-sm hover:underline">Все →</button>
                </div>
                <div className="space-y-3">
                  {donations.slice(0, 4).map(d => (
                    <div key={d.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div>
                        <span className="text-white text-sm font-medium">{d.username}</span>
                        <span className="text-gray-500 text-xs ml-2">{d.plan_name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-oswald font-bold text-white">{d.amount} ₽</span>
                        <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: STATUS_COLORS[d.status] + "20", color: STATUS_COLORS[d.status] }}>
                          {STATUS_LABELS[d.status]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Владелец: быстрые логи */}
              {isOwner && (
                <div className="bg-[#110D1E] border border-[#F59E0B]/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Icon name="Eye" size={16} className="text-[#F59E0B]" />
                    <h2 className="font-oswald font-bold text-white text-lg">Последние действия</h2>
                    <span className="px-2 py-0.5 bg-[#F59E0B]/20 text-[#F59E0B] text-xs rounded font-oswald ml-1">ТОЛЬКО ВЛАДЕЛЕЦ</span>
                  </div>
                  <div className="space-y-2">
                    {logs.slice(0, 4).map(l => (
                      <div key={l.id} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon name="Activity" size={13} className="text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-white text-sm">{l.username}</span>
                          <span className="text-gray-500 text-sm"> — {ACTION_LABELS[l.action] || l.action}</span>
                          <div className="text-gray-600 text-xs mt-0.5">{l.ip} · {new Date(l.created_at).toLocaleString("ru-RU")}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PLAYERS */}
          {activeTab === "players" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-oswald font-bold text-3xl text-white">Игроки</h1>
                  <p className="text-gray-500 text-sm mt-1">{players.length} зарегистрировано</p>
                </div>
                <div className="relative">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    value={searchPlayers}
                    onChange={e => setSearchPlayers(e.target.value)}
                    placeholder="Поиск по имени или VK ID..."
                    className="bg-[#110D1E] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#7C3AED]/50 w-72"
                  />
                </div>
              </div>

              <div className="bg-[#110D1E] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Игрок</th>
                      <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">VK ID</th>
                      <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Статус</th>
                      <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Последний вход</th>
                      {canDo("senior_admin") && <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Действия</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map(p => (
                      <tr key={p.vk_id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar user={p} size={32} />
                            <span className="text-white text-sm">{p.first_name} {p.last_name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-sm">{p.vk_id}</td>
                        <td className="px-5 py-3">
                          {p.is_banned ? (
                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30">
                              Заблокирован
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">
                              Активен
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs">{new Date(p.last_login).toLocaleString("ru-RU")}</td>
                        {canDo("senior_admin") && (
                          <td className="px-5 py-3">
                            {p.is_banned ? (
                              <button
                                onClick={() => setPlayers(prev => prev.map(x => x.vk_id === p.vk_id ? { ...x, is_banned: false, ban_reason: undefined } : x))}
                                className="text-xs px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors border border-green-500/20"
                              >
                                Разбанить
                              </button>
                            ) : (
                              <button
                                onClick={() => { setBanModal(p); setBanReason(""); }}
                                className="text-xs px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
                              >
                                Заблокировать
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DONATIONS */}
          {activeTab === "donations" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-oswald font-bold text-3xl text-white">Донаты</h1>
                  <p className="text-gray-500 text-sm mt-1">Итого: {totalDonated.toLocaleString("ru-RU")} ₽</p>
                </div>
                <div className="flex gap-3">
                  {(["completed", "pending", "refunded"] as const).map(s => (
                    <div key={s} className="flex items-center gap-1.5 text-sm">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[s] }} />
                      <span className="text-gray-400">{STATUS_LABELS[s]}: {donations.filter(d => d.status === s).length}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#110D1E] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">#</th>
                      <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Игрок</th>
                      <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Тариф</th>
                      <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Сумма</th>
                      <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Способ</th>
                      <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Статус</th>
                      <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map(d => (
                      <tr key={d.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                        <td className="px-5 py-3 text-gray-600 text-sm">#{d.id}</td>
                        <td className="px-5 py-3 text-white text-sm">{d.username}</td>
                        <td className="px-5 py-3">
                          <span className="font-oswald text-xs font-bold text-[#A855F7]">{d.plan_name}</span>
                        </td>
                        <td className="px-5 py-3 font-oswald font-bold text-white">{d.amount} ₽</td>
                        <td className="px-5 py-3 text-gray-400 text-sm">{d.payment_method}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: STATUS_COLORS[d.status] + "20", color: STATUS_COLORS[d.status], border: `1px solid ${STATUS_COLORS[d.status]}30` }}>
                            {STATUS_LABELS[d.status]}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs">{new Date(d.created_at).toLocaleString("ru-RU")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADMINS */}
          {activeTab === "admins" && canDo("senior_admin") && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-oswald font-bold text-3xl text-white">Администраторы</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {isOwner ? "Полный список, включая владельца" : "Список администраторов"}
                  </p>
                </div>
                <div className="relative">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    value={searchAdmins}
                    onChange={e => setSearchAdmins(e.target.value)}
                    placeholder="Поиск..."
                    className="bg-[#110D1E] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#7C3AED]/50 w-64"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredAdmins.map(a => (
                  <div key={a.vk_id} className="bg-[#110D1E] border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar user={a} size={44} />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">{a.first_name} {a.last_name}</span>
                          <RoleBadge role={a.role} />
                          {a.role === "owner" && <span className="text-[#F59E0B] text-xs">👑</span>}
                        </div>
                        <div className="text-gray-500 text-xs">VK: {a.vk_id} · Последний вход: {new Date(a.last_login).toLocaleString("ru-RU")}</div>
                      </div>
                    </div>
                    {isOwner && a.role !== "owner" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setRoleModal(a)}
                          className="text-xs px-3 py-1.5 bg-[#7C3AED]/10 text-[#A855F7] hover:bg-[#7C3AED]/20 rounded-lg transition-colors border border-[#7C3AED]/20"
                        >
                          Изменить роль
                        </button>
                        <button
                          onClick={() => setAdmins(prev => prev.filter(x => x.vk_id !== a.vk_id))}
                          className="text-xs px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
                        >
                          Удалить
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {isOwner && (
                <button className="mt-4 flex items-center gap-2 text-sm text-[#A855F7] hover:text-white transition-colors border border-[#7C3AED]/30 hover:border-[#7C3AED] rounded-xl px-4 py-2.5 bg-[#7C3AED]/5 hover:bg-[#7C3AED]/10">
                  <Icon name="Plus" size={16} />
                  Добавить администратора
                </button>
              )}
            </div>
          )}

          {/* LOGS (только owner) */}
          {activeTab === "logs" && isOwner && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-oswald font-bold text-3xl text-white">Логи сайта</h1>
                <span className="px-2 py-1 bg-[#F59E0B]/20 text-[#F59E0B] text-xs rounded font-oswald border border-[#F59E0B]/30">
                  ТОЛЬКО ВЛАДЕЛЕЦ
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-6">Все действия на сайте — видны только тебе</p>

              <div className="bg-[#110D1E] border border-[#F59E0B]/10 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">#</th>
                      <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Пользователь</th>
                      <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Действие</th>
                      <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Детали</th>
                      <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">IP</th>
                      <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Время</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...logs].reverse().map(l => (
                      <tr key={l.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                        <td className="px-5 py-3 text-gray-600 text-sm">#{l.id}</td>
                        <td className="px-5 py-3 text-white text-sm">{l.username}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 bg-[#7C3AED]/20 text-[#A855F7] text-xs rounded font-oswald">
                            {ACTION_LABELS[l.action] || l.action}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs font-mono">{JSON.stringify(l.details)}</td>
                        <td className="px-5 py-3 text-gray-500 text-xs font-mono">{l.ip}</td>
                        <td className="px-5 py-3 text-gray-500 text-xs">{new Date(l.created_at).toLocaleString("ru-RU")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* BAN MODAL */}
      {banModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setBanModal(null)}>
          <div className="bg-[#110D1E] border border-red-500/30 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-oswald font-bold text-xl text-white mb-1">Заблокировать игрока</h3>
            <p className="text-gray-400 text-sm mb-5">{banModal.first_name} {banModal.last_name} · VK {banModal.vk_id}</p>
            <textarea
              value={banReason}
              onChange={e => setBanReason(e.target.value)}
              placeholder="Причина блокировки..."
              rows={3}
              className="w-full bg-[#0A0612] border border-white/10 rounded-xl p-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-500/50 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setPlayers(prev => prev.map(p => p.vk_id === banModal.vk_id ? { ...p, is_banned: true, ban_reason: banReason } : p));
                  setBanModal(null);
                }}
                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-oswald font-bold py-2.5 rounded-xl transition-colors border border-red-500/30"
              >
                ЗАБЛОКИРОВАТЬ
              </button>
              <button onClick={() => setBanModal(null)} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 font-oswald font-bold py-2.5 rounded-xl transition-colors">
                ОТМЕНА
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROLE MODAL */}
      {roleModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setRoleModal(null)}>
          <div className="bg-[#110D1E] border border-[#7C3AED]/30 rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-oswald font-bold text-xl text-white mb-1">Изменить роль</h3>
            <p className="text-gray-400 text-sm mb-5">{roleModal.first_name} {roleModal.last_name}</p>
            <div className="space-y-2">
              {(["senior_admin", "admin", "player"] as Role[]).map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setAdmins(prev => prev.map(a => a.vk_id === roleModal.vk_id ? { ...a, role: r } : a));
                    setRoleModal(null);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                    roleModal.role === r ? "border-[#7C3AED]/50 bg-[#7C3AED]/10" : "border-white/5 hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <RoleBadge role={r} />
                  {roleModal.role === r && <Icon name="Check" size={16} className="text-[#A855F7]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── СТРАНИЦА ВХОДА ───────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: (u: User) => void }) {
  const [loading, setLoading] = useState(false);

  const demoLogin = (role: Role) => {
    setLoading(true);
    setTimeout(() => {
      const users: Record<Role, User> = {
        owner: { vk_id: "demo_owner", first_name: "Владелец", last_name: "Сервера", avatar: "", role: "owner", is_banned: false, created_at: "2024-01-01", last_login: new Date().toISOString() },
        senior_admin: { vk_id: "demo_sr", first_name: "Старший", last_name: "Администратор", avatar: "", role: "senior_admin", is_banned: false, created_at: "2024-02-01", last_login: new Date().toISOString() },
        admin: { vk_id: "demo_admin", first_name: "Администратор", last_name: "Один", avatar: "", role: "admin", is_banned: false, created_at: "2024-03-01", last_login: new Date().toISOString() },
        player: { vk_id: "demo_player", first_name: "Игрок", last_name: "Обычный", avatar: "", role: "player", is_banned: false, created_at: "2024-04-01", last_login: new Date().toISOString() },
      };
      onLogin(users[role]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0A0612] flex items-center justify-center font-golos relative overflow-hidden">
      {/* BG effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#7C3AED]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-[#A855F7]/5 rounded-full blur-[80px]" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] flex items-center justify-center mx-auto mb-4" style={{ boxShadow: "0 0 40px rgba(124,58,237,0.4)" }}>
            <span className="font-oswald font-bold text-white text-2xl">ВЛ</span>
          </div>
          <h1 className="font-oswald font-bold text-3xl text-white">ВЛАДИВОСТОК <span className="text-[#A855F7]">RP</span></h1>
          <p className="text-gray-500 mt-2 text-sm">Личный кабинет</p>
        </div>

        <div className="bg-[#110D1E] border border-white/10 rounded-2xl p-6">
          {/* VK Login */}
          <button className="w-full flex items-center justify-center gap-3 bg-[#0077FF] hover:bg-[#0066DD] text-white font-oswald font-bold py-4 rounded-xl transition-all text-lg tracking-wider mb-6" style={{ boxShadow: "0 4px 20px rgba(0,119,255,0.3)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm2.07 13.5h-1.47c-.56 0-.73-.45-1.73-1.45-.87-.83-1.25-.94-1.47-.94-.3 0-.38.08-.38.5v1.32c0 .36-.11.57-1.05.57-1.54 0-3.25-.93-4.45-2.67-1.81-2.54-2.3-4.44-2.3-4.83 0-.22.08-.43.5-.43h1.47c.37 0 .51.17.65.57.72 2.08 1.93 3.9 2.43 3.9.19 0 .27-.09.27-.58V9.12c-.06-1.05-.61-1.14-.61-1.52 0-.19.15-.37.4-.37h2.31c.31 0 .42.16.42.52v2.8c0 .31.14.42.23.42.19 0 .35-.11.7-.46 1.09-1.22 1.87-3.1 1.87-3.1.1-.22.27-.43.64-.43h1.47c.44 0 .54.23.44.54-.19.87-2.02 3.46-2.02 3.46-.16.26-.22.38 0 .67.16.22.69.67 1.04 1.08.65.73 1.14 1.34 1.28 1.76.12.41-.1.62-.51.62z"/>
            </svg>
            ВОЙТИ ЧЕРЕЗ ВКОНТАКТЕ
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#110D1E] px-3 text-gray-600 text-xs">или демо-вход</span>
            </div>
          </div>

          {/* Demo roles */}
          <div className="space-y-2">
            <p className="text-gray-500 text-xs text-center mb-3">Войти как (демо-режим)</p>
            {([
              { role: "owner" as Role, label: "Владелец", desc: "Полный доступ + логи", icon: "Crown" },
              { role: "senior_admin" as Role, label: "Ст. Администратор", desc: "Без логов владельца", icon: "Shield" },
              { role: "admin" as Role, label: "Администратор", desc: "Базовый доступ", icon: "User" },
            ]).map(({ role, label, desc, icon }) => (
              <button
                key={role}
                onClick={() => demoLogin(role)}
                disabled={loading}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white/3 hover:bg-white/8 border border-white/5 hover:border-white/15 rounded-xl transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: ROLE_COLORS[role] + "20" }}>
                  <Icon name={icon} size={18} style={{ color: ROLE_COLORS[role] }} />
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium group-hover:text-white">{label}</div>
                  <div className="text-gray-600 text-xs">{desc}</div>
                </div>
                <Icon name="ChevronRight" size={16} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-gray-700 text-xs mt-6">
          Авторизуясь, ты принимаешь правила сервера
        </p>
      </div>
    </div>
  );
}
