/* 商品数据 */
const CATEGORIES = [
  { key: "food",  name: "宠粮零食", emoji: "🍖", desc: "营养主粮 · 美味零食", grad: "linear-gradient(135deg,#ffe9dc,#fff4ec)", bg: "#fff0e6" },
  { key: "toy",   name: "玩具互动", emoji: "🎾", desc: "逗猫磨牙 · 益智玩耍", grad: "linear-gradient(135deg,#dff7f4,#eefbfa)", bg: "#dff7f4" },
  { key: "care",  name: "洗护健康", emoji: "🧴", desc: "洗浴护理 · 健康日常", grad: "linear-gradient(135deg,#e8f0fe,#f3f7ff)", bg: "#e8f0fe" },
  { key: "home",  name: "窝具家居", emoji: "🛏️", desc: "舒适窝垫 · 萌趣服饰", grad: "linear-gradient(135deg,#f7edfb,#fcf6fd)", bg: "#f7edfb" },
  { key: "gear",  name: "出行装备", emoji: "🎒", desc: "牵引出行 · 安全随行", grad: "linear-gradient(135deg,#fff4d9,#fff9ec)", bg: "#fff4d9" },
  { key: "clean", name: "清洁消毒", emoji: "🧹", desc: "猫砂除味 · 居家干净", grad: "linear-gradient(135deg,#e2f5ec,#f0faef)", bg: "#e2f5ec" },
];

const PRODUCTS = [
  { id: 1,  name: "无谷冻干双拼狗粮 2kg",  cat: "food",  price: 168, oldPrice: 198, emoji: "🥩", tag: "hot",   rating: 4.9, sales: "2.3k", desc: "鲜肉冻干+高蛋白，泪痕克星，适口性拉满" },
  { id: 2,  name: "幼猫鸡肉益生菌猫粮 1.5kg", cat: "food", price: 89,  oldPrice: null, emoji: "🐟", tag: null,   rating: 4.8, sales: "1.8k", desc: "30% 鲜鸡肉，添加益生菌，呵护娇嫩肠胃" },
  { id: 3,  name: "三文鱼冻干零食 90g",     cat: "food",  price: 39.9, oldPrice: 59,  emoji: "🍣", tag: "new",   rating: 4.9, sales: "986",  desc: "零添加原切冻干，训练奖励好帮手" },
  { id: 4,  name: "牛肉洁齿磨牙棒 12 支",   cat: "food",  price: 25.9, oldPrice: null, emoji: "🦴", tag: null,   rating: 4.7, sales: "5.1k", desc: "高蛋白洁齿，清新口气，越啃越健康" },
  { id: 5,  name: "智能激光逗猫棒",         cat: "toy",   price: 45,   oldPrice: 69,  emoji: "🐾", tag: "hot",   rating: 4.8, sales: "3.4k", desc: "红外亮点+逗趣晃动，猫咪根本停不下来" },
  { id: 6,  name: "乳胶发声小黄鸭玩具",     cat: "toy",   price: 29.9, oldPrice: null, emoji: "🦆", tag: null,   rating: 4.6, sales: "1.2k", desc: "环保乳胶，发声解闷，耐咬不掉屑" },
  { id: 7,  name: "绳结磨牙耐咬玩具",       cat: "toy",   price: 19.9, oldPrice: null, emoji: "🪢", tag: null,   rating: 4.7, sales: "2.7k", desc: "棉绳结设计，洁牙护齿，拔河游戏首选" },
  { id: 8,  name: "咔啦球漏食益智玩具",     cat: "toy",   price: 35,   oldPrice: null, emoji: "⚽", tag: "new",   rating: 4.8, sales: "764",  desc: "隐藏零食机关，锻炼智力，消耗过剩精力" },
  { id: 9,  name: "低敏氨基酸宠物沐浴露",   cat: "care",  price: 79,   oldPrice: 99,  emoji: "🧴", tag: null,   rating: 4.9, sales: "1.5k", desc: "温和氨基酸配方，深层洁净，留香持久" },
  { id: 10, name: "云朵速干宠物毛巾",       cat: "care",  price: 49.9, oldPrice: null, emoji: "🧺", tag: null,   rating: 4.7, sales: "2.1k", desc: "超细纤维 5 倍吸水，柔软不掉毛" },
  { id: 11, name: "宠物指甲剪护理套装",     cat: "care",  price: 32,   oldPrice: null, emoji: "✂️", tag: null,   rating: 4.6, sales: "1.9k", desc: "安全挡板+锉刀，新手也能轻松剪甲" },
  { id: 12, name: "犬用静音电动剃毛器",     cat: "care",  price: 129,  oldPrice: 169, emoji: "💈", tag: "new",   rating: 4.8, sales: "532",  desc: "低噪马达，陶瓷刀头，脚底毛一键修剪" },
  { id: 13, name: "四季通用云感宠物窝",     cat: "home",  price: 118,  oldPrice: 158, emoji: "🛏️", tag: "hot",   rating: 4.9, sales: "4.2k", desc: "可拆洗豆袋窝，睡眠安全感拉满" },
  { id: 14, name: "宠物连帽潮流卫衣",       cat: "home",  price: 99,   oldPrice: null, emoji: "🧥", tag: null,   rating: 4.7, sales: "887",  desc: "亲肤摇粒绒，秋冬保暖，出街回头率" },
  { id: 15, name: "加厚防水宠物雨披",       cat: "home",  price: 85,   oldPrice: 109, emoji: "☔", tag: "sale",  rating: 4.6, sales: "654",  desc: "防雨防水快干，透明帽檐视线无遮挡" },
  { id: 16, name: "珊瑚绒冬季保暖窝",       cat: "home",  price: 139,  oldPrice: 199, emoji: "🧶", tag: "sale",  rating: 4.8, sales: "1.1k", desc: "加厚珊瑚绒，寒冬里的暖呼呼小屋" },
  { id: 17, name: "宠物自动循环饮水机",     cat: "home",  price: 159,  oldPrice: null, emoji: "⛲", tag: "new",   rating: 4.9, sales: "2.9k", desc: "活水循环 4 重过滤，从此爱上喝水" },
  { id: 18, name: "航空箱外出登机箱",       cat: "gear",  price: 158,  oldPrice: null, emoji: "🧳", tag: null,   rating: 4.7, sales: "1.3k", desc: "透气加厚，飞机托运/自驾出行都能用" },
  { id: 19, name: "加宽帆布牵引绳套装",     cat: "gear",  price: 39.9, oldPrice: 59,  emoji: "🪢", tag: "sale",  rating: 4.8, sales: "6.7k", desc: "高强织带不勒手，反光条夜间更安全" },
  { id: 20, name: "宠物外出双肩太空包",     cat: "gear",  price: 199,  oldPrice: 259, emoji: "🎒", tag: "new",   rating: 4.9, sales: "3.8k", desc: "太空舱全景天窗，带毛孩看世界" },
  { id: 21, name: "可折叠车载宠物垫",       cat: "gear",  price: 69,   oldPrice: null, emoji: "🚗", tag: null,   rating: 4.6, sales: "976",  desc: "防刮防水易清洁，后座秒变专属沙发" },
  { id: 22, name: "低粉尘豆腐猫砂 6L",      cat: "clean", price: 45.9, oldPrice: 59,  emoji: "🫧", tag: "hot",   rating: 4.9, sales: "8.9k", desc: "2mm 豆腐砂，结团快不粘底，可冲厕所" },
  { id: 23, name: "宠物除味消毒喷雾 500ml", cat: "clean", price: 29.9, oldPrice: null, emoji: "💨", tag: null,   rating: 4.7, sales: "2.4k", desc: "植物分解异味，安全可舔舐，人宠共用" },
  { id: 24, name: "全封闭防外溅猫砂盆",     cat: "clean", price: 89,   oldPrice: 119, emoji: "🚽", tag: "sale",  rating: 4.8, sales: "1.6k", desc: "顶入式设计，杜绝猫砂带出，防臭升级" },
  { id: 25, name: "加厚吸水宠物尿垫 30 片", cat: "clean", price: 39.9, oldPrice: null, emoji: "🧻", tag: null,   rating: 4.7, sales: "3.2k", desc: "瞬吸防漏高分子，训练幼宠必备" },
];

/* 分类→背景色 */
function catStyle(catKey) {
  const c = CATEGORIES.find(x => x.key === catKey) || CATEGORIES[0];
  return { grad: c.grad, bg: c.bg };
}

/* 标签文案 */
function tagInfo(tag) {
  if (tag === "hot")  return { text: "🔥 热卖", cls: "tb-hot" };
  if (tag === "new")  return { text: "✨ 新品", cls: "tb-new" };
  if (tag === "sale") return { text: "💸 折扣", cls: "tb-sale" };
  return null;
}

const CAT_NAMES = Object.fromEntries(CATEGORIES.map(c => [c.key, c.name]));
