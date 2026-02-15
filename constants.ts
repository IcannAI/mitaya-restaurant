import { MenuItem, Category } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: { en: 'Truffle Mushroom Risotto', 'zh-TW': '松露野菇燉飯' },
    description: { en: 'Creamy arborio rice with black truffle oil and parmesan.', 'zh-TW': '義大利米燉煮，佐以黑松露油與帕瑪森起司。' },
    price: 450,
    category: 'main',
    isVegetarian: true,
    image: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: '2',
    name: { en: 'Wagyu Beef Burger', 'zh-TW': '和牛漢堡' },
    description: { en: 'Juicy wagyu patty with caramelized onions and brioche bun.', 'zh-TW': '多汁和牛漢堡排，搭配焦糖洋蔥與布里歐麵包。' },
    price: 580,
    category: 'main',
    isVegetarian: false,
    image: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: '3',
    name: { en: 'Caesar Salad', 'zh-TW': '凱薩沙拉' },
    description: { en: 'Fresh romaine lettuce with homemade dressing and croutons.', 'zh-TW': '新鮮蘿蔓生菜，搭配自製醬汁與麵包丁。' },
    price: 280,
    category: 'appetizer',
    isVegetarian: true,
    image: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: '4',
    name: { en: 'Chocolate Lava Cake', 'zh-TW': '熔岩巧克力蛋糕' },
    description: { en: 'Rich dark chocolate cake with a molten center.', 'zh-TW': '濃郁黑巧克力蛋糕，搭配流心內餡。' },
    price: 220,
    category: 'dessert',
    isVegetarian: true,
    image: 'https://picsum.photos/400/300?random=4'
  },
  {
    id: '5',
    name: { en: 'Signature Fruit Tea', 'zh-TW': '招牌水果茶' },
    description: { en: 'Refreshing blend of seasonal fruits and jasmine tea.', 'zh-TW': '清爽的時令水果與茉莉綠茶調和。' },
    price: 180,
    category: 'drink',
    isVegetarian: true,
    image: 'https://picsum.photos/400/300?random=5'
  },
  {
    id: '6',
    name: { en: 'Pan-Seared Scallops', 'zh-TW': '香煎干貝' },
    description: { en: 'Hokkaido scallops with pea purée.', 'zh-TW': '北海道干貝佐豌豆泥。' },
    price: 420,
    category: 'appetizer',
    isVegetarian: false,
    image: 'https://picsum.photos/400/300?random=6'
  },
];

export const CATEGORIES: { id: Category; label: { en: string; 'zh-TW': string } }[] = [
  { id: 'popular', label: { en: 'Popular', 'zh-TW': '熱門' } },
  { id: 'appetizer', label: { en: 'Appetizers', 'zh-TW': '開胃菜' } },
  { id: 'main', label: { en: 'Mains', 'zh-TW': '主菜' } },
  { id: 'dessert', label: { en: 'Desserts', 'zh-TW': '甜點' } },
  { id: 'drink', label: { en: 'Drinks', 'zh-TW': '飲品' } },
];

export const TRANSLATIONS = {
  en: {
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.reservation': 'Reservation',
    'hero.title': 'Experience the Taste of Luxury',
    'hero.subtitle': 'Modern fusion cuisine in the heart of the city.',
    'hero.cta': 'Book a Table',
    'menu.title': 'Our Menu',
    'menu.search': 'Search dishes...',
    'menu.vegetarian': 'Vegetarian Only',
    'menu.add': 'Add',
    'cart.title': 'Your Order',
    'cart.empty': 'Your cart is empty.',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout (Demo)',
    'res.title': 'Make a Reservation',
    'res.name': 'Name',
    'res.date': 'Date',
    'res.guests': 'Guests',
    'res.notes': 'Special Requests',
    'res.submit': 'Confirm Reservation',
    'res.success': 'Reservation Confirmed!',
    'res.error': 'Please check your inputs.',
    'footer.address': '123 Culinary Ave, Food City',
    'footer.rights': '© 2026 Mitaya Restaurant. All rights reserved.',
  },
  'zh-TW': {
    'nav.home': '首頁',
    'nav.menu': '菜單',
    'nav.reservation': '訂位',
    'hero.title': '體驗奢華的味覺饗宴',
    'hero.subtitle': '位於市中心的現代融合料理。',
    'hero.cta': '立即訂位',
    'menu.title': '精選菜單',
    'menu.search': '搜尋菜色...',
    'menu.vegetarian': '僅顯示素食',
    'menu.add': '加入',
    'cart.title': '您的訂單',
    'cart.empty': '購物車是空的。',
    'cart.total': '總計',
    'cart.checkout': '結帳 (演示)',
    'res.title': '預約訂位',
    'res.name': '姓名',
    'res.date': '日期',
    'res.guests': '人數',
    'res.notes': '特殊需求',
    'res.submit': '確認訂位',
    'res.success': '訂位已確認！',
    'res.error': '請檢查您的輸入。',
    'footer.address': '美食市美食大道123號',
    'footer.rights': '© 2026 Mit Restaurant. 版權所有。',
  }
};