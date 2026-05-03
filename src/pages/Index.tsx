import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/b1e8094a-70fb-4f08-b428-633dc1dbd418/files/d778a50d-80e3-480f-af7e-1a7b8bca538c.jpg";
const CHAR_IMG = "https://cdn.poehali.dev/projects/b1e8094a-70fb-4f08-b428-633dc1dbd418/files/b537b64f-8496-41a9-b54f-459110145d0e.jpg";
const FEATURES_IMG = "https://cdn.poehali.dev/projects/b1e8094a-70fb-4f08-b428-633dc1dbd418/files/6c8b8f6a-3d3f-4437-9a91-9b8ce4ecb00d.jpg";

const NAV_ITEMS = ["СКАЧАТЬ", "ФОРУМ", "О СЕРВЕРЕ", "КАРЬЕРА", "ВИКИ", "МАГАЗИН", "КОНТАКТЫ"];

const DONATE_PLANS = [
  {
    name: "ГРАЖДАНИН",
    price: "199₽",
    period: "/мес",
    color: "from-slate-600 to-slate-800",
    accent: "#64748B",
    glow: "rgba(100,116,139,0.4)",
    icon: "User",
    perks: ["Уникальный префикс", "Доступ к форуму", "5 000 игровых рублей", "1 дополнительный слот персонажа"],
  },
  {
    name: "АВТОРИТЕТ",
    price: "499₽",
    period: "/мес",
    color: "from-violet-700 to-purple-900",
    accent: "#7C3AED",
    glow: "rgba(124,58,237,0.6)",
    icon: "Shield",
    popular: true,
    perks: ["Всё из «Гражданин»", "VIP-чат в дискорде", "25 000 игровых рублей", "Уникальная анимация входа", "3 слота персонажа", "Приоритет в очереди"],
  },
  {
    name: "КРИМИНАЛ",
    price: "999₽",
    period: "/мес",
    color: "from-amber-600 to-orange-900",
    accent: "#F59E0B",
    glow: "rgba(245,158,11,0.6)",
    icon: "Crown",
    perks: ["Всё из «Авторитет»", "75 000 игровых рублей", "Эксклюзивный скин авто", "Личный дом в игре", "5 слотов персонажа", "Право создать группировку", "Знак отличия на форуме"],
  },
  {
    name: "БОСС",
    price: "1999₽",
    period: "/мес",
    color: "from-rose-600 to-red-900",
    accent: "#E11D48",
    glow: "rgba(225,29,72,0.6)",
    icon: "Star",
    perks: ["Всё из «Криминал»", "200 000 игровых рублей", "Личный бизнес в игре", "Yacht & Penthouse", "Неограниченные слоты", "Прямая связь с командой", "Имя в титрах сервера"],
  },
];

const ABOUT_FEATURES = [
  { icon: "Users", title: "Живое комьюнити", desc: "Тысячи игроков каждый день создают события, конфликты и союзы" },
  { icon: "MapPin", title: "Владивосток", desc: "Детализированный город по мотивам настоящего Владивостока" },
  { icon: "Briefcase", title: "50+ профессий", desc: "Полицейский, врач, бандит, предприниматель — стань кем угодно" },
  { icon: "Car", title: "Авто из России", desc: "Жигули, Волга, ГАЗель и сотни других отечественных авто" },
  { icon: "Building2", title: "Экономика", desc: "Честная игровая экономика с бизнесом, биржей и криминалом" },
  { icon: "Zap", title: "Без лагов", desc: "Мощные сервера с минимальным пингом по всей России" },
];

const CAREERS = [
  { icon: "Shield", name: "Полиция", desc: "Охраняй порядок в городе", color: "#3B82F6" },
  { icon: "Heart", name: "Медицина", desc: "Спасай жизни на улицах", color: "#10B981" },
  { icon: "Truck", name: "Водитель", desc: "Доставка и таксование", color: "#F59E0B" },
  { icon: "Flame", name: "Пожарный", desc: "Тушение пожаров и ЧС", color: "#EF4444" },
  { icon: "Skull", name: "Криминал", desc: "Банды, наркота, рэкет", color: "#8B5CF6" },
  { icon: "Store", name: "Бизнес", desc: "Открой своё дело в городе", color: "#EC4899" },
];

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("СКАЧАТЬ");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const players = useCountUp(3847);

  return (
    <div className="min-h-screen bg-vlad-bg font-golos text-white">

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-vlad-purple/20 backdrop-blur-xl bg-vlad-bg/80">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-vlad-purple to-vlad-purple-dark flex items-center justify-center glow-purple">
              <span className="font-oswald font-bold text-white text-sm">ВЛ</span>
            </div>
            <span className="font-oswald font-bold text-xl tracking-wider text-white">
              ВЛАДИВОСТОК <span className="text-vlad-purple-light">RP</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-vlad-bg-card px-4 py-1.5 rounded-full border border-vlad-purple/30">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-sm text-gray-300">Игроков онлайн:</span>
            <span className="font-oswald font-bold text-vlad-purple-light">{players.toLocaleString("ru-RU")}</span>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => setActiveSection(item)}
                className={`px-3 py-2 text-sm font-oswald tracking-wider transition-all duration-200 rounded-lg hover:text-vlad-purple-light hover:bg-vlad-purple/10 ${
                  activeSection === item ? "text-vlad-purple-light bg-vlad-purple/10" : "text-gray-400"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <button className="hidden md:flex items-center gap-2 bg-vlad-purple hover:bg-vlad-purple-glow text-white font-oswald font-semibold px-5 py-2 rounded-lg transition-all duration-200 glow-btn text-sm tracking-wider">
            ПОПОЛНИТЬ СЧЁТ
          </button>

          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-vlad-bg-card border-t border-vlad-purple/20 px-4 py-4 flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <button key={item} className="text-left py-2 px-3 text-gray-300 font-oswald tracking-wider hover:text-vlad-purple-light hover:bg-vlad-purple/10 rounded-lg transition-colors">
                {item}
              </button>
            ))}
            <button className="mt-2 bg-vlad-purple text-white font-oswald font-semibold px-5 py-2.5 rounded-lg">
              ПОПОЛНИТЬ СЧЁТ
            </button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Владивосток RP" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-vlad-bg via-vlad-bg/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-vlad-bg via-transparent to-vlad-bg/60" />
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-vlad-purple/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-vlad-purple-light/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-12 items-center py-20">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-vlad-purple/20 border border-vlad-purple/40 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-vlad-purple-light animate-pulse"></span>
              <span className="text-sm text-vlad-purple-light font-oswald tracking-widest">GTA 5 ROLEPLAY SERVER</span>
            </div>

            <h1 className="font-oswald font-bold text-6xl md:text-7xl lg:text-8xl leading-none mb-4 tracking-tight">
              <span className="text-white">ДЛЯ</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-vlad-purple-light via-purple-300 to-vlad-purple">
                НОВЫХ
              </span>
              <br />
              <span className="text-white">ИГРОКОВ</span>
            </h1>

            <p className="text-gray-300 text-lg mb-2 font-oswald tracking-wider">
              СТАНЬ КЕМ УГОДНО В <span className="text-vlad-purple-light">ВЛАДИВОСТОК ROLEPLAY</span>
            </p>
            <p className="text-gray-400 text-base mb-8 max-w-xl leading-relaxed">
              Сервер GTA 5 RP, который погружает тебя в атмосферу настоящего русского города. 
              Стань полицейским, бандитом, бизнесменом или простым работягой — в твоих руках.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-vlad-bg-card border border-vlad-purple/30 rounded-xl px-4 py-3">
                <div className="text-xs text-gray-500 mb-1">🎁 При регистрации</div>
                <div className="font-oswald font-bold text-vlad-gold">50 000 ₽</div>
                <div className="text-xs text-gray-400">игровой валюты</div>
              </div>
              <div className="bg-vlad-bg-card border border-vlad-purple/30 rounded-xl px-4 py-3">
                <div className="text-xs text-gray-500 mb-1">👑 Промокод</div>
                <div className="flex items-center gap-2">
                  <span className="font-oswald font-bold text-white bg-vlad-bg px-2 py-0.5 rounded text-sm">VLADIVOSTOK</span>
                  <button className="text-vlad-purple-light hover:text-white transition-colors">
                    <Icon name="Copy" size={14} />
                  </button>
                </div>
                <div className="text-xs text-gray-400">Premium 7 дней</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-3 bg-vlad-purple hover:bg-vlad-purple-glow text-white font-oswald font-bold px-8 py-4 rounded-xl transition-all duration-200 glow-btn text-lg tracking-wider">
                <Icon name="Play" size={20} />
                НАЧАТЬ ИГРАТЬ
              </button>
              <button className="flex items-center gap-3 border border-vlad-purple/50 hover:border-vlad-purple text-white font-oswald font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:bg-vlad-purple/10 text-lg tracking-wider">
                <Icon name="Download" size={20} />
                СКАЧАТЬ
              </button>
            </div>

            <div className="flex items-center gap-4 mt-8">
              {["MessageCircle", "Youtube", "Send", "Users"].map((icon, i) => (
                <button key={i} className="w-10 h-10 rounded-xl bg-vlad-bg-card border border-vlad-purple/20 flex items-center justify-center text-gray-400 hover:text-vlad-purple-light hover:border-vlad-purple/50 transition-all duration-200">
                  <Icon name={icon} size={18} />
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-end relative animate-float">
            <div className="relative">
              <div className="absolute inset-0 bg-vlad-purple/30 rounded-full blur-[80px] scale-110" />
              <img
                src={CHAR_IMG}
                alt="Персонаж"
                className="relative w-[420px] h-[480px] object-cover rounded-3xl border border-vlad-purple/30"
                style={{ boxShadow: "0 0 60px rgba(124,58,237,0.4), 0 0 120px rgba(124,58,237,0.15)" }}
              />
              <div className="absolute -top-4 -right-4 bg-vlad-purple text-white font-oswald font-bold px-4 py-2 rounded-xl text-sm tracking-wider animate-glow-pulse">
                🔥 ГОРЯЧИЙ СЕРВЕР
              </div>
              <div className="absolute -bottom-4 left-8 bg-vlad-bg-card border border-vlad-purple/40 rounded-xl px-4 py-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="font-oswald text-sm text-white">{players.toLocaleString("ru-RU")} онлайн</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24 relative" id="about">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-vlad-purple/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-vlad-purple-light font-oswald tracking-[0.3em] text-sm">О СЕРВЕРЕ</span>
            <h2 className="font-oswald font-bold text-5xl mt-2 text-white">
              ПОЧЕМУ <span className="text-vlad-purple-light">ВЛАДИВОСТОК RP</span>?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-vlad-purple to-transparent mx-auto mt-4" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img src={FEATURES_IMG} alt="Особенности сервера" className="rounded-2xl w-full h-72 object-cover border border-vlad-purple/20" style={{ boxShadow: "0 0 40px rgba(124,58,237,0.2)" }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {ABOUT_FEATURES.map((f, i) => (
                <div key={i} className="bg-vlad-bg-card border border-vlad-purple/20 rounded-xl p-4 hover:border-vlad-purple/50 transition-all duration-300 hover:bg-vlad-bg-card2 group">
                  <div className="w-10 h-10 rounded-lg bg-vlad-purple/20 flex items-center justify-center mb-3 group-hover:bg-vlad-purple/30 transition-colors">
                    <Icon name={f.icon} size={20} className="text-vlad-purple-light" />
                  </div>
                  <div className="font-oswald font-bold text-white text-sm mb-1">{f.title}</div>
                  <div className="text-gray-400 text-xs leading-relaxed">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CAREERS */}
      <section className="py-24 bg-vlad-bg-card/30" id="career">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-vlad-purple-light font-oswald tracking-[0.3em] text-sm">ВОЗМОЖНОСТИ</span>
            <h2 className="font-oswald font-bold text-5xl mt-2 text-white">
              ВЫБЕРИ <span className="text-vlad-purple-light">КАРЬЕРУ</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-vlad-purple to-transparent mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CAREERS.map((c, i) => (
              <div
                key={i}
                className="bg-vlad-bg-card border border-white/5 rounded-2xl p-5 text-center transition-all duration-300 cursor-pointer hover:-translate-y-1"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = c.color + "60";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "";
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300"
                  style={{ backgroundColor: c.color + "20" }}>
                  <Icon name={c.icon} size={24} style={{ color: c.color }} />
                </div>
                <div className="font-oswald font-bold text-white text-sm mb-1">{c.name}</div>
                <div className="text-gray-500 text-xs">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DONATE */}
      <section className="py-24" id="shop">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-vlad-purple-light font-oswald tracking-[0.3em] text-sm">ПОДДЕРЖИ СЕРВЕР</span>
            <h2 className="font-oswald font-bold text-5xl mt-2 text-white">
              МАГАЗИН <span className="text-vlad-purple-light">ПРИВИЛЕГИЙ</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-vlad-purple to-transparent mx-auto mt-4" />
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">Поддержи развитие сервера и получи уникальные преимущества</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DONATE_PLANS.map((plan, i) => (
              <div
                key={i}
                onClick={() => setSelectedPlan(i === selectedPlan ? null : i)}
                className="relative bg-vlad-bg-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
                style={{
                  border: selectedPlan === i ? `2px solid ${plan.accent}` : "1px solid rgba(255,255,255,0.1)",
                  boxShadow: selectedPlan === i ? `0 0 30px ${plan.glow}` : "none",
                }}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 py-1.5 text-center font-oswald font-bold text-xs tracking-widest text-white bg-vlad-purple">
                    ⭐ ПОПУЛЯРНЫЙ
                  </div>
                )}

                <div className={`h-1.5 bg-gradient-to-r ${plan.color}`} style={{ marginTop: plan.popular ? "32px" : 0 }} />

                <div className="p-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: plan.accent + "25" }}>
                    <Icon name={plan.icon} size={24} style={{ color: plan.accent }} />
                  </div>

                  <div className="font-oswald font-bold text-xl text-white mb-1">{plan.name}</div>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="font-oswald font-bold text-3xl" style={{ color: plan.accent }}>{plan.price}</span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>

                  <div className="space-y-2.5 mb-6">
                    {plan.perks.map((perk, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm">
                        <Icon name="Check" size={14} className="mt-0.5 flex-shrink-0" style={{ color: plan.accent }} />
                        <span className="text-gray-300">{perk}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="w-full py-3 rounded-xl font-oswald font-bold tracking-wider text-sm transition-all duration-200 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${plan.accent}, ${plan.accent}99)`,
                      boxShadow: `0 4px 20px ${plan.glow}`,
                    }}
                  >
                    КУПИТЬ
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="text-gray-500 text-sm mb-4">Способы оплаты</div>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {["💳 Карта", "🏦 СБП", "💰 ЮMoney", "📱 SberPay"].map((m, i) => (
                <div key={i} className="bg-vlad-bg-card border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-400">
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WIKI */}
      <section className="py-24 bg-vlad-bg-card/20" id="wiki">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-vlad-purple-light font-oswald tracking-[0.3em] text-sm">БАЗА ЗНАНИЙ</span>
          <h2 className="font-oswald font-bold text-5xl mt-2 text-white mb-4">ВИКИ <span className="text-vlad-purple-light">СЕРВЕРА</span></h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-vlad-purple to-transparent mx-auto mb-8" />
          <p className="text-gray-400 max-w-xl mx-auto mb-12">Всё что нужно знать новичку и опытному игроку — правила, гайды, механики</p>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: "BookOpen", title: "Правила сервера", desc: "Обязательно к прочтению", color: "#7C3AED" },
              { icon: "Lightbulb", title: "Гайд новичка", desc: "Первые шаги на сервере", color: "#10B981" },
              { icon: "HelpCircle", title: "FAQ", desc: "Часто задаваемые вопросы", color: "#F59E0B" },
            ].map((item, i) => (
              <div key={i} className="bg-vlad-bg-card border border-white/10 rounded-2xl p-6 hover:border-vlad-purple/40 transition-all duration-300 cursor-pointer hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: item.color + "20" }}>
                  <Icon name={item.icon} size={24} style={{ color: item.color }} />
                </div>
                <div className="font-oswald font-bold text-white mb-1">{item.title}</div>
                <div className="text-gray-500 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORUM & CONTACTS */}
      <section className="py-24" id="contacts">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-vlad-bg-card border border-vlad-purple/20 rounded-2xl p-8">
              <div className="font-oswald font-bold text-3xl text-white mb-2">ФОРУМ</div>
              <div className="w-12 h-1 bg-vlad-purple mb-4" />
              <p className="text-gray-400 mb-6">Общайся с игроками, создавай темы, ищи команду и обсуждай события сервера</p>
              <div className="space-y-3 mb-6">
                {["Объявления администрации", "Поиск команды", "Жалобы и апелляции", "Общение игроков"].map((t, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                    <Icon name="ChevronRight" size={16} className="text-vlad-purple-light group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm">{t}</span>
                  </div>
                ))}
              </div>
              <button className="border border-vlad-purple/50 hover:bg-vlad-purple/10 text-vlad-purple-light font-oswald font-bold px-6 py-3 rounded-xl transition-all text-sm tracking-wider">
                ПЕРЕЙТИ НА ФОРУМ
              </button>
            </div>

            <div className="bg-vlad-bg-card border border-vlad-purple/20 rounded-2xl p-8">
              <div className="font-oswald font-bold text-3xl text-white mb-2">КОНТАКТЫ</div>
              <div className="w-12 h-1 bg-vlad-purple mb-4" />
              <p className="text-gray-400 mb-6">Есть вопросы? Обратись к нам удобным способом</p>
              <div className="space-y-4">
                {[
                  { icon: "Send", label: "Telegram", value: "@vladivostok_rp", color: "#229ED9" },
                  { icon: "Users", label: "ВКонтакте", value: "vk.com/vladivostokrp", color: "#4C75A3" },
                  { icon: "MessageCircle", label: "Discord", value: "discord.gg/vladivostokrp", color: "#5865F2" },
                  { icon: "Youtube", label: "YouTube", value: "Владивосток RP", color: "#FF0000" },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: c.color + "20" }}>
                      <Icon name={c.icon} size={18} style={{ color: c.color }} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{c.label}</div>
                      <div className="text-sm text-gray-300 group-hover:text-white transition-colors">{c.value}</div>
                    </div>
                    <Icon name="ExternalLink" size={14} className="ml-auto text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-vlad-purple/20 py-8 bg-vlad-bg">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-vlad-purple to-vlad-purple-dark flex items-center justify-center">
              <span className="font-oswald font-bold text-white text-xs">ВЛ</span>
            </div>
            <span className="font-oswald font-bold text-white">ВЛАДИВОСТОК <span className="text-vlad-purple-light">RP</span></span>
          </div>
          <p className="text-gray-600 text-sm">© 2024 Владивосток RP. Проект не аффилирован с Rockstar Games.</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <button className="hover:text-gray-300 transition-colors">Правила</button>
            <button className="hover:text-gray-300 transition-colors">Политика</button>
          </div>
        </div>
      </footer>
    </div>
  );
}